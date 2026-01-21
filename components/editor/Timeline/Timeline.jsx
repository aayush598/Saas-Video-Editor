import { useRef } from 'react'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { VideoClip } from './VideoClip'
import { TimelineComponent } from './TimelineComponent'
import { Playhead } from './Playhead'

export function Timeline({
    videoClips,
    timelineComponents,
    currentTime,
    projectDuration,
    zoom,
    setZoom,
    setCurrentTime,
    handleClipMove,
    handleClipResize,
    deleteClip,
    selectedClip,
    setSelectedClip,
    selectedComponent,
    setSelectedComponent,
    removeComponent
}) {
    const timelineRef = useRef(null)

    const handleTimelineClick = (e) => {
        if (!timelineRef.current) return
        const rect = timelineRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const percent = x / rect.width
        const newTime = Math.max(0, Math.min(percent * projectDuration / zoom, projectDuration))
        setCurrentTime(newTime)
    }

    return (
        <div className="border-t bg-card">
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Timeline</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Label className="text-xs">Zoom:</Label>
                            <Slider
                                value={[zoom]}
                                onValueChange={([val]) => setZoom(val)}
                                min={0.5}
                                max={3}
                                step={0.1}
                                className="w-24"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{currentTime.toFixed(1)}s</span>
                            <span>/</span>
                            <span>{projectDuration.toFixed(1)}s</span>
                        </div>
                    </div>
                </div>

                {/* Timeline Track */}
                <div
                    ref={timelineRef}
                    className="relative h-32 bg-muted/50 rounded-lg border overflow-x-auto cursor-crosshair"
                    onClick={handleTimelineClick}
                >
                    {/* Time Markers */}
                    <div className="absolute top-0 left-0 right-0 h-6 flex items-center border-b px-2 bg-muted/80">
                        {Array.from({ length: Math.ceil((projectDuration / zoom)) + 1 }).map((_, i) => (
                            <div key={i} className="flex-1 text-xs text-muted-foreground text-center min-w-[40px]">
                                {i}s
                            </div>
                        ))}
                    </div>

                    {/* Video Clips Track */}
                    <div className="absolute top-8 left-0 right-0 h-14 p-2">
                        <div className="relative h-full">
                            {videoClips.map((clip) => (
                                <VideoClip
                                    key={clip.id}
                                    clip={clip}
                                    projectDuration={projectDuration}
                                    zoom={zoom}
                                    onMove={handleClipMove}
                                    onResize={handleClipResize}
                                    onDelete={deleteClip}
                                    isSelected={selectedClip === clip.id}
                                    onSelect={() => setSelectedClip(clip.id)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Overlay Components Track */}
                    <div className="absolute top-24 left-0 right-0 h-12 p-2">
                        <div className="relative h-full">
                            {timelineComponents.map((component) => (
                                <TimelineComponent
                                    key={component.id}
                                    component={component}
                                    projectDuration={projectDuration}
                                    zoom={zoom}
                                    onSelect={() => setSelectedComponent(component)}
                                    onRemove={() => removeComponent(component.id)}
                                    isSelected={selectedComponent?.id === component.id}
                                />
                            ))}
                        </div>
                    </div>

                    <Playhead
                        currentTime={currentTime}
                        projectDuration={projectDuration}
                        zoom={zoom}
                    />
                </div>
            </div>
        </div>
    )
}
