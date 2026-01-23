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
                    className="relative h-48 bg-muted/50 rounded-lg border overflow-x-auto cursor-crosshair"
                    onClick={(e) => {
                        if (!timelineRef.current) return
                        const rect = timelineRef.current.getBoundingClientRect()
                        const x = e.clientX - rect.left + timelineRef.current.scrollLeft
                        const totalWidth = timelineRef.current.scrollWidth
                        const percent = x / totalWidth
                        const newTime = Math.max(0, Math.min(percent * projectDuration, projectDuration))
                        setCurrentTime(newTime)
                    }}
                >
                    <div
                        className="relative h-full"
                        style={{ width: `${Math.max(100, zoom * 100)}%` }}
                    >
                        {/* Time Markers */}
                        <div className="absolute top-0 left-0 right-0 h-6 border-b bg-muted/80">
                            {Array.from({ length: Math.ceil(projectDuration) + 1 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute top-0 text-xs text-muted-foreground border-l pl-1 h-full flex items-center"
                                    style={{ left: `${(i / projectDuration) * 100}%` }}
                                >
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
        </div>
    )
}
