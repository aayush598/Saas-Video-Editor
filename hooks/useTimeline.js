import { useState } from 'react'
import { toast } from 'sonner'
import { COMPONENT_LIBRARY } from '@/lib/constants/componentLibrary'

export function useTimeline() {
    const [timelineComponents, setTimelineComponents] = useState([])
    const [videoClips, setVideoClips] = useState([])
    const [selectedComponentIds, setSelectedComponentIds] = useState([])
    const [selectedClipIds, setSelectedClipIds] = useState([])
    const [clipboard, setClipboard] = useState(null)
    const [projectDuration, setProjectDuration] = useState(10)
    const [zoom, setZoom] = useState(1)

    const calculateTotalDuration = (clips, components) => {
        const clipsEnd = Math.max(0, ...clips.map(c => c.end))
        const componentsEnd = Math.max(0, ...components.map(c => c.endTime))
        return Math.max(clipsEnd, componentsEnd)
    }

    // Derived selected components
    const selectedComponent = timelineComponents.find(c => selectedComponentIds.includes(c.id)) || null

    // Helper to maintain interface
    const toggleComponentSelection = (input, isMulti) => {
        if (!input) {
            setSelectedComponentIds([])
            return
        }
        const id = typeof input === 'string' ? input : input.id

        if (isMulti) {
            setSelectedComponentIds(prev =>
                prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
            )
        } else {
            setSelectedComponentIds([id])
        }
        // Clear clip selection when selecting component
        if (!isMulti) setSelectedClipIds([])
    }

    const toggleClipSelection = (id, isMulti) => {
        if (isMulti) {
            setSelectedClipIds(prev =>
                prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
            )
        } else {
            setSelectedClipIds([id])
        }
        // Clear component selection when selecting clip
        if (!isMulti) setSelectedComponentIds([])
    }

    const copyItem = () => {
        if (selectedComponentIds.length > 0) {
            const comps = timelineComponents.filter(c => selectedComponentIds.includes(c.id))
            setClipboard({ type: 'components', data: comps })
            toast.success(`${comps.length} Component(s) copied`)
        } else if (selectedClipIds.length > 0) {
            const clips = videoClips.filter(c => selectedClipIds.includes(c.id))
            setClipboard({ type: 'clips', data: clips })
            toast.success(`${clips.length} Clip(s) copied`)
        }
    }

    const pasteItem = (currentTime) => {
        if (!clipboard) return

        if (clipboard.type === 'components') {
            const newComponents = clipboard.data.map((item, index) => ({
                ...item,
                id: `${item.type}-${Date.now()}-${index}`,
                startTime: currentTime,
                endTime: Math.min(currentTime + (item.endTime - item.startTime), projectDuration)
            }))

            setTimelineComponents([...timelineComponents, ...newComponents])
            setSelectedComponentIds(newComponents.map(c => c.id))
            toast.success('Components pasted')
        } else if (clipboard.type === 'clips') {
            const newClips = clipboard.data.map((item, index) => {
                const duration = item.end - item.start
                return {
                    ...item,
                    id: `clip-${Date.now()}-${index}`,
                    start: currentTime,
                    end: currentTime + duration,
                    name: `${item.name} (Copy)`
                }
            })
            setVideoClips([...videoClips, ...newClips].sort((a, b) => a.start - b.start))

            // Extend project duration if needed
            setProjectDuration(calculateTotalDuration([...videoClips, ...newClips], timelineComponents))

            setSelectedClipIds(newClips.map(c => c.id))
            toast.success('Clips pasted')
        }
    }

    const addComponentToTimeline = (componentType, currentTime, propsOverride = {}, durationOverride = null) => {
        let component;
        if (typeof componentType === 'string') {
            component = COMPONENT_LIBRARY.find(c => c.id === componentType)
        } else {
            component = componentType // It's a config object (custom template)
        }

        if (!component) {
            toast.error("Component type not found")
            return
        }

        const defaultDuration = durationOverride || component.defaultProps?.duration || 3

        let startTime = currentTime



        // ... existing logic for freeze-frame ...
        // If it's a freeze frame, we need to split the video and make a gap
        if (componentType === 'freeze-frame') {
            const clipAtPlayhead = videoClips.find(c => currentTime > c.start && currentTime < c.end)
            if (clipAtPlayhead) {
                const splitPoint = currentTime
                const relativeSplit = splitPoint - clipAtPlayhead.start
                const sourceSplit = clipAtPlayhead.sourceStart + relativeSplit

                const clipLeft = {
                    ...clipAtPlayhead,
                    id: `clip-${Date.now()}-1`,
                    end: splitPoint,
                    sourceEnd: sourceSplit,
                    name: clipAtPlayhead.name
                }

                const clipRight = {
                    ...clipAtPlayhead,
                    id: `clip-${Date.now()}-2`,
                    start: splitPoint + defaultDuration,
                    end: clipAtPlayhead.end + defaultDuration,
                    sourceStart: sourceSplit,
                    name: clipAtPlayhead.name
                }

                const otherClipsShifted = videoClips
                    .filter(c => c.id !== clipAtPlayhead.id)
                    .map(c => {
                        if (c.start >= splitPoint) {
                            return {
                                ...c,
                                start: c.start + defaultDuration,
                                end: c.end + defaultDuration
                            }
                        }
                        return c
                    })

                setVideoClips([clipLeft, clipRight, ...otherClipsShifted].sort((a, b) => a.start - b.start))

                // Shift existing components that are after the split point
                setTimelineComponents(prev => prev.map(c => {
                    if (c.startTime >= splitPoint) {
                        return {
                            ...c,
                            startTime: c.startTime + defaultDuration,
                            endTime: c.endTime + defaultDuration
                        }
                    }
                    return c
                }))

                // Update Project Duration
                const maxEnd = Math.max(...[clipLeft, clipRight, ...otherClipsShifted].map(c => c.end))
                setProjectDuration(maxEnd)
            }
        }

        // Handle Custom Templates (objects)
        let finalType = typeof componentType === 'string' ? componentType : (component.type || 'custom-code')
        let finalProps = { ...component.defaultProps, ...propsOverride }

        // If this is a custom template from the library (object with html/css)
        if (typeof componentType !== 'string' && (component.html || component.css)) {
            finalType = 'custom-code'
            finalProps = {
                ...finalProps,
                html: component.html,
                css: component.css,
                // Set defaults if not present
                position: finalProps.position || 'center',
                scale: finalProps.scale || 1,
                opacity: finalProps.opacity || 1,
                width: finalProps.width || 'auto',
                height: finalProps.height || 'auto'
            }
        }

        const newComponent = {
            id: `${finalType}-${Date.now()}`,
            type: finalType,
            name: component.name,
            startTime: startTime,
            endTime: startTime + defaultDuration,
            props: finalProps
        }
        setTimelineComponents(prev => [...prev, newComponent])
        setTimelineComponents(prev => [...prev, newComponent])
        setSelectedComponentIds([newComponent.id])
        toast.success(`${component.name} added to timeline`)
    }


    const removeComponent = (id) => {
        let idsToRemove = [id]
        // If the ID passed is part of selection, remove all selected
        if (selectedComponentIds.includes(id)) {
            idsToRemove = selectedComponentIds
        }

        const newComponents = timelineComponents.filter(c => !idsToRemove.includes(c.id))
        setTimelineComponents(newComponents)
        setProjectDuration(calculateTotalDuration(videoClips, newComponents))

        setSelectedComponentIds([])
        toast.info('Components removed')
    }

    const updateComponentProps = (id, newProps) => {
        setTimelineComponents(timelineComponents.map(c =>
            c.id === id ? { ...c, props: { ...c.props, ...newProps } } : c
        ))
    }

    const updateComponentTiming = (id, startTime, endTime) => {
        const component = timelineComponents.find(c => c.id === id)

        if (component?.type === 'freeze-frame') {
            // Calculate the delta in duration change
            const currentDuration = component.endTime - component.startTime
            const newDuration = endTime - startTime
            const delta = newDuration - currentDuration

            // If duration changed, we need to push/pull everything after this component
            if (Math.abs(delta) > 0.01) {
                const pivotPoint = component.endTime

                // Shift Video Clips
                setVideoClips(prev => prev.map(c => {
                    if (c.start >= pivotPoint - 0.1) { // -0.1 tolerance
                        return {
                            ...c,
                            start: c.start + delta,
                            end: c.end + delta
                        }
                    }
                    return c
                }))

                // Shift Components
                setTimelineComponents(prev => prev.map(c => {
                    if (c.id === id) {
                        return { ...c, startTime, endTime }
                    }
                    if (c.startTime >= pivotPoint - 0.1) {
                        return {
                            ...c,
                            startTime: c.startTime + delta,
                            endTime: c.endTime + delta
                        }
                    }
                    return c
                }))

                // Update total duration
                setTimeout(() => {
                    setVideoClips(current => {
                        const maxEnd = Math.max(...current.map(c => c.end))
                        setProjectDuration(maxEnd)
                        return current
                    })
                }, 0)

                return
            }
        }

        const newComponents = timelineComponents.map(c =>
            c.id === id ? { ...c, startTime, endTime } : c
        )
        setTimelineComponents(newComponents)

        // Recalculate duration
        const clipsEnd = Math.max(0, ...videoClips.map(c => c.end))
        const componentsEnd = Math.max(0, ...newComponents.map(c => c.endTime))
        setProjectDuration(Math.max(clipsEnd, componentsEnd))
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
            name: clipAtPlayhead.name
        }

        const clipRight = {
            ...clipAtPlayhead,
            id: `clip-${Date.now()}-2`,
            start: splitPoint,
            sourceStart: sourceSplit,
            name: clipAtPlayhead.name
        }

        const newClips = videoClips.flatMap(c =>
            c.id === clipAtPlayhead.id ? [clipLeft, clipRight] : [c]
        )
        setVideoClips(newClips)
        toast.success("Video split at playhead!")
    }

    const handleClipMove = (id, newStart) => {
        setVideoClips(prev => {
            const clip = prev.find(c => c.id === id)
            if (!clip) return prev

            const duration = clip.end - clip.start
            const newEnd = newStart + duration

            const updated = prev.map(c =>
                c.id === id ? { ...c, start: newStart, end: newEnd } : c
            ).sort((a, b) => a.start - b.start)

            setProjectDuration(calculateTotalDuration(updated, timelineComponents))

            return updated
        })
    }

    const handleClipResize = (id, edge, newValue) => {
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
            setProjectDuration(calculateTotalDuration(newClips, timelineComponents))

            return newClips
        })
    }

    const deleteClip = (id) => {
        setVideoClips(prev => {
            let idsToRemove = [id]
            if (selectedClipIds.includes(id)) {
                idsToRemove = selectedClipIds
            }

            const newClips = prev.filter(c => !idsToRemove.includes(c.id))

            setProjectDuration(calculateTotalDuration(newClips, timelineComponents))
            toast.success("Clips deleted")
            return newClips
        })
        setSelectedClipIds([])
    }

    return {
        timelineComponents,
        setTimelineComponents,
        videoClips,
        setVideoClips,
        selectedComponent,
        selectedComponent,
        setSelectedComponent: toggleComponentSelection,
        selectedClipIds, // Renamed
        setSelectedClip: toggleClipSelection,
        selectedComponentIds, // Added for timeline usage
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
