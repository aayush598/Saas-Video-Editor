import { useEffect, useRef, useState } from 'react'
import { loadProjectState, saveProjectState, saveAsset, loadAsset } from '@/lib/db'
import { toast } from 'sonner'

export function useProjectPersistence({
    videoClips,
    timelineComponents,
    projectDuration,
    setVideoClips,
    setTimelineComponents,
    setProjectDuration,
    videoUrl,
    setVideoUrl,
    uploadedVideo,
    setUploadedVideo
}) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [restoredSession, setRestoredSession] = useState(false) // Track if we did a restore
    const isRestoring = useRef(false)

    // We keep a cache of which Blob URLs we have already persisted to avoid re-saving them every debounce.
    // Map: BlobURL -> AssetID
    const persistedAssets = useRef(new Map())

    // Helper to extract File/Blob from URL and save to IDB
    const persistBlobUrl = async (url) => {
        if (!url || typeof url !== 'string' || !url.startsWith('blob:')) return null

        if (persistedAssets.current.has(url)) {
            return persistedAssets.current.get(url)
        }

        try {
            const response = await fetch(url)
            const blob = await response.blob()
            const assetId = `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            await saveAsset(assetId, blob)
            persistedAssets.current.set(url, assetId)
            return assetId
        } catch (e) {
            console.error("Failed to persist asset", url, e)
            return null
        }
    }

    // Load on mount
    useEffect(() => {
        const initLoad = async () => {
            try {
                const savedState = await loadProjectState()
                if (savedState) {
                    isRestoring.current = true
                    console.log("Restoring session...", savedState)

                    // Restore Main Video
                    if (savedState.mainVideoAssetId) {
                        try {
                            const blob = await loadAsset(savedState.mainVideoAssetId)
                            if (blob) {
                                const url = URL.createObjectURL(blob)
                                setVideoUrl(url)
                                setUploadedVideo(new File([blob], "restored-video.webm", { type: blob.type }))
                                persistedAssets.current.set(url, savedState.mainVideoAssetId)
                            }
                        } catch (e) {
                            console.error("Failed to restore main video", e)
                        }
                    }

                    // Restore Components (and their assets)
                    const restoredComponents = await Promise.all(savedState.timelineComponents.map(async (comp) => {
                        const newProps = { ...comp.props }

                        // Check widely used asset keys
                        const keysToCheck = ['videoSrc', 'src', 'poster']
                        for (const key of keysToCheck) {
                            if (comp.assets && comp.assets[key]) {
                                // We have a saved asset ID for this prop
                                const assetId = comp.assets[key]
                                try {
                                    const blob = await loadAsset(assetId)
                                    if (blob) {
                                        const url = URL.createObjectURL(blob)
                                        newProps[key] = url
                                        persistedAssets.current.set(url, assetId)
                                    }
                                } catch (e) {
                                    console.warn(`Failed to restore asset ${assetId} for component ${comp.id}`)
                                }
                            }
                        }
                        return { ...comp, props: newProps }
                    }))

                    if (savedState.videoClips) setVideoClips(savedState.videoClips)
                    if (savedState.projectDuration) setProjectDuration(savedState.projectDuration)
                    setTimelineComponents(restoredComponents)
                    setRestoredSession(true)
                    toast.success("Previous session restored")
                }
            } catch (error) {
                console.error("Failed to restore project", error)
            } finally {
                setIsLoaded(true)
                setTimeout(() => { isRestoring.current = false }, 1000)
            }
        }
        initLoad()
    }, [])

    // Debounced Save
    // We depend on all persistable state
    useEffect(() => {
        if (!isLoaded || isRestoring.current) return

        const timeoutId = setTimeout(async () => {
            try {
                // 1. Persist Main Video
                let mainVideoAssetId = null
                if (videoUrl) {
                    mainVideoAssetId = await persistBlobUrl(videoUrl)
                }

                // 2. Persist Components
                const componentsToSave = await Promise.all(timelineComponents.map(async (comp) => {
                    const assets = {}
                    const keysToCheck = ['videoSrc', 'src', 'poster']

                    // Identify assets in props
                    for (const key of keysToCheck) {
                        const val = comp.props?.[key]
                        if (val && typeof val === 'string' && val.startsWith('blob:')) {
                            const assetId = await persistBlobUrl(val)
                            if (assetId) {
                                assets[key] = assetId
                            }
                        }
                    }

                    // Return clean component object with 'assets' map
                    // We keep the original props (with blob URLs) for the UI, 
                    // but the saved state will rely on the 'assets' map to reconstruct them.
                    return {
                        ...comp,
                        assets
                    }
                }))

                const stateToSave = {
                    projectDuration,
                    timestamp: Date.now(),
                    videoClips,
                    timelineComponents: componentsToSave,
                    mainVideoAssetId
                }

                await saveProjectState(stateToSave)
                // console.log("Auto-saved session")
            } catch (e) {
                console.error("Auto-save failed", e)
            }
        }, 2000) // 2s debounce

        return () => clearTimeout(timeoutId)
    }, [videoClips, timelineComponents, projectDuration, videoUrl, isLoaded])

    return { isLoaded, restoredSession }
}
