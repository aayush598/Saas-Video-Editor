import { Button } from '@/components/ui/button'
import { Scissors, SkipBack, Play, Pause, SkipForward } from 'lucide-react'

export function Toolbar({
    handleSplit,
    uploadedVideo,
    skipBackward,
    skipForward,
    togglePlayback,
    isPlaying
}) {
    return (
        <div className="border-b bg-muted/40 px-4 py-2 flex items-center gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={handleSplit}
                disabled={!uploadedVideo}
                title="Split Video at Playhead (S)"
            >
                <Scissors className="w-4 h-4 mr-2" />
                Split
            </Button>
            <div className="h-4 w-px bg-border mx-2" />
            <Button
                variant="ghost"
                size="sm"
                onClick={skipBackward}
                disabled={!uploadedVideo}
                title="Skip Backward 5s"
            >
                <SkipBack className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={togglePlayback}
                disabled={!uploadedVideo}
                title="Play/Pause (Space)"
            >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={skipForward}
                disabled={!uploadedVideo}
                title="Skip Forward 5s"
            >
                <SkipForward className="w-4 h-4" />
            </Button>
            <div className="h-4 w-px bg-border mx-2" />
            <span className="text-xs text-muted-foreground">
                Drag clips to move • Drag edges to trim • Click split to cut
            </span>
        </div>
    )
}
