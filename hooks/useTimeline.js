import { useState } from 'react'
import { toast } from 'sonner'
import { COMPONENT_LIBRARY } from '@/lib/constants/componentLibrary'

export function useTimeline() {
    const [timelineComponents, setTimelineComponents] = useState([])
    const [videoClips, setVideoClips] = useState([])
    const [selectedComponent, setSelectedComponent] = useState(null)
    const [selectedClip, setSelectedClip] = useState(null)
    const [clipboard, setClipboard] = useState(null)
    const [projectDuration, setProjectDuration] = useState(30)
    const [zoom, setZoom] = useState(1)

    const copyItem = () => {
        if (selectedComponent) {
            setClipboard({ type: 'component', data: selectedComponent })
            toast.success('Component copied')
        } else if (selectedClip) {
            const clip = videoClips.find(c => c.id === selectedClip)
            if (clip) {
                setClipboard({ type: 'clip', data: clip })
                toast.success('Clip copied')
            }
        }
    }

    const pasteItem = (currentTime) => {
        if (!clipboard) return

        if (clipboard.type === 'component') {
            const newComponent = {
                ...clipboard.data,
                id: `${clipboard.data.type}-${Date.now()}`,
                startTime: currentTime,
                endTime: Math.min(currentTime + (clipboard.data.endTime - clipboard.data.startTime), projectDuration)
            }
            setTimelineComponents([...timelineComponents, newComponent])
            setSelectedComponent(newComponent)
            toast.success('Component pasted')
        } else if (clipboard.type === 'clip') {
            const duration = clipboard.data.end - clipboard.data.start
            const newClip = {
                ...clipboard.data,
                id: `clip-${Date.now()}`,
                start: currentTime,
                end: currentTime + duration,
                name: `${clipboard.data.name} (Copy)`
            }
            setVideoClips([...videoClips, newClip].sort((a, b) => a.start - b.start))

            // Extend project duration if needed
            const maxEnd = Math.max(...[...videoClips, newClip].map(c => c.end))
            setProjectDuration(maxEnd)

            setSelectedClip(newClip.id)
            toast.success('Clip pasted')
        }
    }

    const addComponentToTimeline = (componentType, currentTime) => {
        const component = COMPONENT_LIBRARY.find(c => c.id === componentType)
        const newComponent = {
            id: `${componentType}-${Date.now()}`,
            type: componentType,
            name: component.name,
            startTime: currentTime,
            endTime: Math.min(currentTime + 3, projectDuration),
            props: { ...component.defaultProps }
        }
        setTimelineComponents([...timelineComponents, newComponent])
        setSelectedComponent(newComponent)
        toast.success(`${component.name} added to timeline`)
    }

    const removeComponent = (id) => {
        setTimelineComponents(timelineComponents.filter(c => c.id !== id))
        if (selectedComponent?.id === id) {
            setSelectedComponent(null)
        }
        toast.info('Component removed')
    }

    const updateComponentProps = (id, newProps) => {
        setTimelineComponents(timelineComponents.map(c =>
            c.id === id ? { ...c, props: { ...c.props, ...newProps } } : c
        ))
    }

    const updateComponentTiming = (id, startTime, endTime) => {
        setTimelineComponents(timelineComponents.map(c =>
            c.id === id ? { ...c, startTime, endTime } : c
        ))
    }

    const handleSplit = (currentTime) => {
        const clipAtPlayhead = videoClips.find(c => currentTime > c.start && currentTime < c.end)
        if (!clipAtPlayhead) {
            toast.error("No video clip at playhead to split")
            return
        }

        const splitPoint = currentTime
        const relativeSplit = splitPoint - clipAtPlayhead.start
        const sourceSplit = clipAtPlayhead.sourceStart + relativeSplit

        const clipLeft = {
            ...clipAtPlayhead,
            id: `clip-${Date.now()}-1`,
            end: splitPoint,
            sourceEnd: sourceSplit,
            name: clipAtPlayhead.name + ' (1)'
        }

        const clipRight = {
            ...clipAtPlayhead,
            id: `clip-${Date.now()}-2`,
            start: splitPoint,
            sourceStart: sourceSplit,
            name: clipAtPlayhead.name + ' (2)'
        }

        const newClips = videoClips.flatMap(c =>
            c.id === clipAtPlayhead.id ? [clipLeft, clipRight] : [c]
        )
        setVideoClips(newClips)
        toast.success("Video split at playhead!")
    }

    const handleClipMove = (id, newStart, videoDuration) => {
        setVideoClips(prev => {
            const clip = prev.find(c => c.id === id)
            if (!clip) return prev

            const duration = clip.end - clip.start
            const newEnd = newStart + duration

            const updated = prev.map(c =>
                c.id === id ? { ...c, start: newStart, end: newEnd } : c
            ).sort((a, b) => a.start - b.start)

            const maxEnd = Math.max(...updated.map(c => c.end), videoDuration)
            setProjectDuration(maxEnd)

            return updated
        })
    }

    const handleClipResize = (id, edge, newValue, videoDuration) => {
        setVideoClips(prev => {
            const clip = prev.find(c => c.id === id)
            if (!clip) return prev

            let updated = { ...clip }

            if (edge === 'left') {
                const maxStart = clip.end - 0.1
                const newStart = Math.max(0, Math.min(newValue, maxStart))
                const trimAmount = newStart - clip.start
                updated = {
                    ...clip,
                    start: newStart,
                    sourceStart: clip.sourceStart + trimAmount
                }
            } else if (edge === 'right') {
                const minEnd = clip.start + 0.1
                const sourceDuration = clip.sourceEnd - clip.sourceStart
                const maxEnd = clip.start + sourceDuration
                const newEnd = Math.max(minEnd, Math.min(newValue, maxEnd))
                updated = {
                    ...clip,
                    end: newEnd,
                    sourceEnd: clip.sourceStart + (newEnd - clip.start)
                }
            }

            const newClips = prev.map(c => c.id === id ? updated : c)
            const maxEnd = Math.max(...newClips.map(c => c.end), videoDuration)
            setProjectDuration(maxEnd)

            return newClips
        })
    }

    const deleteClip = (id) => {
        setVideoClips(prev => {
            const newClips = prev.filter(c => c.id !== id)
            if (newClips.length === 0) {
                toast.error("Cannot delete the last clip")
                return prev
            }

            const maxEnd = Math.max(...newClips.map(c => c.end))
            setProjectDuration(maxEnd)
            toast.success("Clip deleted")
            return newClips
        })
        if (selectedClip === id) {
            setSelectedClip(null)
        }
    }

    return {
        timelineComponents,
        setTimelineComponents,
        videoClips,
        setVideoClips,
        selectedComponent,
        setSelectedComponent,
        selectedClip,
        setSelectedClip,
        projectDuration,
        setProjectDuration,
        zoom,
        setZoom,
        addComponentToTimeline,
        removeComponent,
        updateComponentProps,
        updateComponentTiming,
        handleSplit,
        handleClipMove,
        handleClipResize,
        handleClipMove,
        handleClipResize,
        deleteClip,
        copyItem,
        pasteItem,
        clipboard
    }
}
