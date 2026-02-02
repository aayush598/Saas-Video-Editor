import { useState } from 'react'
import { toast } from 'sonner'
import { COMPONENT_LIBRARY } from '@/lib/constants/componentLibrary'

export function useTimeline() {
    const [timelineComponents, setTimelineComponents] = useState([])
    const [videoClips, setVideoClips] = useState([])
    const [selectedComponentId, setSelectedComponentId] = useState(null)
    const [selectedClip, setSelectedClip] = useState(null)
    const [clipboard, setClipboard] = useState(null)
    const [projectDuration, setProjectDuration] = useState(30)
    const [zoom, setZoom] = useState(1)

    // Derived selected component to ensure it's always fresh
    const selectedComponent = timelineComponents.find(c => c.id === selectedComponentId) || null

    // Helper to maintain interface
    const setSelectedComponent = (input) => {
        if (!input) {
            setSelectedComponentId(null)
            return
        }
        // Support both ID string and Component object
        const id = typeof input === 'string' ? input : input.id
        setSelectedComponentId(id)
    }

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
            setSelectedComponentId(newComponent.id)
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

    const addComponentToTimeline = (componentType, currentTime, propsOverride = {}) => {
        const component = COMPONENT_LIBRARY.find(c => c.id === componentType)
        const defaultDuration = component.defaultProps.duration || 3

        let startTime = currentTime

        // Special handling for Ripple Effect with Clip Metadata
        if (componentType === 'ripple-effect') {
            // Check if there is a clip at the current time that has metadata
            const clipAtPlayhead = videoClips.find(c => currentTime >= c.start && currentTime <= c.end)

            if (clipAtPlayhead && clipAtPlayhead.events && clipAtPlayhead.events.length > 0) {
                const clickEvents = clipAtPlayhead.events.filter(e => e.type === 'click')

                if (clickEvents.length > 0) {
                    // Add a ripple for EACH click event found in the metadata
                    // We adjust the time based on the clip's current position and offset

                    const newComponents = clickEvents.map((evt, index) => {
                        // Calculate absolute timeline time for this event
                        // Event time is relative to source start (0)
                        // We need to map it to timeline time:
                        // clip.start + (eventTime - clip.sourceStart)  <-- assuming eventTime is 0-based from recording start

                        // Note: events stored as seconds from recording start.
                        // Clip sourceStart moves if we trim.
                        // But if we just recorded, sourceStart is 0.
                        // If we trimmed the left side, we need to check if the event is within the visible range.

                        const eventTimeInSource = evt.time

                        if (eventTimeInSource >= clipAtPlayhead.sourceStart && eventTimeInSource <= clipAtPlayhead.sourceEnd) {
                            const relativeTime = eventTimeInSource - clipAtPlayhead.sourceStart
                            const timelineTime = clipAtPlayhead.start + relativeTime

                            return {
                                id: `ripple-${Date.now()}-${index}`,
                                type: 'ripple-effect',
                                name: 'Click Ripple',
                                startTime: timelineTime,
                                endTime: timelineTime + 0.6, // Short duration for burst
                                props: {
                                    ...component.defaultProps,
                                    x: evt.x,
                                    y: evt.y,
                                    duration: 0.6
                                }
                            }
                        }
                        return null
                    }).filter(Boolean)

                    if (newComponents.length > 0) {
                        setTimelineComponents(prev => [...prev, ...newComponents])
                        toast.success(`Auto-generated ${newComponents.length} ripple effects from recording!`)
                        return // Exit, don't add the default single ripple
                    }
                }
            }
        }

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

        const newComponent = {
            id: `${componentType}-${Date.now()}`,
            type: componentType,
            name: component.name,
            startTime: startTime,
            endTime: startTime + defaultDuration,
            props: { ...component.defaultProps, ...propsOverride }
        }
        setTimelineComponents(prev => [...prev, newComponent])
        setSelectedComponentId(newComponent.id)
        toast.success(`${component.name} added to timeline`)
    }

    const removeComponent = (id) => {
        // If removing a freeze frame, we should probably close the gap?
        // For now, simpler to just remove the overlay, but gaps remain.
        // Advanced users can move clips to close gaps.
        setTimelineComponents(timelineComponents.filter(c => c.id !== id))
        if (selectedComponentId === id) {
            setSelectedComponentId(null)
        }
        toast.info('Component removed')
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
