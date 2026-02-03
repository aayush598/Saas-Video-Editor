import { useRef, useMemo, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Copy, Clipboard, Trash2, Scissors } from 'lucide-react'
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
    selectedClipIds = [],
    setSelectedClip,
    selectedComponent, // Still used for Properties Panel single view? Assuming yes or updated props
    selectedComponentIds = [],
    setSelectedComponent,
    removeComponent,
    copyItem,
    pasteItem,
    clipboard,
    handleSplit,
    updateComponentTiming
}) {
    const timelineRef = useRef(null)

    const getTimelineInterval = () => {
        const visibleDuration = projectDuration / Math.max(0.1, zoom)

        if (visibleDuration <= 20) return 1
        if (visibleDuration <= 60) return 2
        if (visibleDuration <= 120) return 5
        if (visibleDuration <= 300) return 10 // 5 mins
        if (visibleDuration <= 600) return 15 // 10 mins
        if (visibleDuration <= 1800) return 30 // 30 mins
        if (visibleDuration <= 3600) return 60 // 1 hour
        return 120
    }

    const interval = getTimelineInterval()

    const packedComponents = useMemo(() => {
        const sorted = [...timelineComponents].sort((a, b) => a.startTime - b.startTime);
        const rows = [];
        return sorted.map(comp => {
            let rowIndex = 0;
            while (true) {
                // simple collision check: if this row has no items bumping into us
                // Actually we just need to track the end time of the last item in this row
                // BUT, items might be removed/filtered. 
                // A robust way is: check against ALL items currently assigned to this row.
                // Optimisation: track 'maxEndTime' for each row.
                // Since sorted by startTime, if comp.startTime >= rowMaxEndTime, it fits.

                const lastEndTime = rows[rowIndex] || 0;
                if (comp.startTime >= lastEndTime) {
                    rows[rowIndex] = comp.endTime; // update row end time
                    return { ...comp, row: rowIndex };
                }
                rowIndex++;
            }
        });
    }, [timelineComponents]);

    const packedVideoClips = useMemo(() => {
        const sorted = [...videoClips].sort((a, b) => a.start - b.start);
        const rows = [];
        return sorted.map(clip => {
            let rowIndex = 0;
            while (true) {
                const lastEndTime = rows[rowIndex] || 0;
                if (clip.start >= lastEndTime - 0.01) { // 0.01 tolerance
                    rows[rowIndex] = clip.end;
                    return { ...clip, row: rowIndex };
                }
                rowIndex++;
            }
        });
    }, [videoClips]);

    const videoRows = Math.max(0, ...packedVideoClips.map(c => c.row)) + 1;
    const videoTrackHeight = Math.max(videoRows * 45, 60); // 45px per row (40px height + 5px gap), min 60px

    const maxRows = Math.max(0, ...packedComponents.map(c => c.row)) + 1;
    const componentTrackHeight = Math.max(maxRows * 40, 60);

    const trackHeight = videoTrackHeight + componentTrackHeight + 50; // Total padded height

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore if typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (e.key.toLowerCase() === 's') {
                e.preventDefault();
                handleSplit(currentTime);
            }

            if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                e.preventDefault();
                copyItem();
            }

            if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
                e.preventDefault();
                pasteItem(currentTime);
            }

            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                if (selectedClipIds.length > 0) deleteClip(selectedClipIds[0]);
                if (selectedComponentIds.length > 0) removeComponent(selectedComponentIds[0]);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentTime, selectedClipIds, selectedComponentIds, handleSplit, copyItem, pasteItem, deleteClip, removeComponent]);

    return (
        <div className="border-t bg-card">
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Timeline</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 mr-4 border-r pr-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleSplit}
                                title="Split Video at Playhead (S)"
                            >
                                <Scissors className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={copyItem}
                                disabled={selectedClipIds.length === 0 && selectedComponentIds.length === 0}
                                title="Copy"
                            >
                                <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={pasteItem}
                                disabled={!clipboard}
                                title="Paste"
                            >
                                <Clipboard className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    if (selectedClipIds.length > 0) deleteClip(selectedClipIds[0])
                                    if (selectedComponentIds.length > 0) removeComponent(selectedComponentIds[0])
                                }}
                                disabled={selectedClipIds.length === 0 && selectedComponentIds.length === 0}
                                title="Delete"
                                className="text-destructive hover:text-destructive"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
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
                    className="relative bg-muted/50 rounded-lg border overflow-x-auto cursor-crosshair"
                    style={{ height: `${100 + trackHeight}px` }}
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
                            {Array.from({ length: Math.ceil(projectDuration / interval) + 1 }).map((_, idx) => {
                                const i = idx * interval
                                if (i > projectDuration) return null
                                return (
                                    <div
                                        key={i}
                                        className="absolute top-0 text-xs text-muted-foreground border-l pl-1 h-full flex items-center"
                                        style={{ left: `${(i / projectDuration) * 100}%` }}
                                    >
                                        {i}s
                                    </div>
                                )
                            })}
                        </div>

                        {/* Video Clips Track */}
                        <div
                            className="absolute left-0 right-0 p-2"
                            style={{
                                top: '32px', // 8 * 4
                                height: `${videoTrackHeight}px`
                            }}
                        >
                            <div className="relative h-full">
                                {packedVideoClips.map((clip) => (
                                    <VideoClip
                                        key={clip.id}
                                        clip={clip}
                                        projectDuration={projectDuration}
                                        zoom={zoom}
                                        onMove={handleClipMove}
                                        onResize={handleClipResize}
                                        onDelete={deleteClip}
                                        isSelected={selectedClipIds.includes(clip.id)}
                                        onSelect={(multi) => setSelectedClip(clip.id, multi)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Overlay Components Track */}
                        <div
                            className="absolute left-0 right-0 p-2 border-t border-dashed border-white/10"
                            style={{
                                top: `${32 + videoTrackHeight}px`,
                                height: `${componentTrackHeight}px`
                            }}
                        >
                            <div className="relative h-full">
                                {packedComponents.map((component) => (
                                    <TimelineComponent
                                        key={component.id}
                                        component={component}
                                        projectDuration={projectDuration}
                                        zoom={zoom}
                                        onSelect={(multi) => setSelectedComponent(component, multi)}
                                        onRemove={() => removeComponent(component.id)}
                                        onUpdate={updateComponentTiming}
                                        isSelected={selectedComponentIds.includes(component.id)}
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
