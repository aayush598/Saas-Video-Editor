import { Button } from '@/components/ui/button'
import { Scissors, SkipBack, Play, Pause, SkipForward, Circle, Square } from 'lucide-react'

export function Toolbar({
    handleSplit,
    uploadedVideo,
    skipBackward,
    skipForward,
    togglePlayback,
    isPlaying,
    recorder
}) {
    const {
        isRecording,
        isCountingDown,
        countdown,
        startRecording,
        stopRecording
    } = recorder || {}

    return (
        <div className="border-b bg-muted/40 px-4 py-2 flex items-center gap-2">
            <Button
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isCountingDown}
                className={isRecording ? "animate-pulse" : ""}
                title={isRecording ? "Stop Recording" : "Record Screen"}
            >
                {isCountingDown ? (
                    <span className="font-bold">{countdown}</span>
                ) : isRecording ? (
                    <>
                        <Square className="w-4 h-4 mr-2 fill-current" />
                        Stop
                    </>
                ) : (
                    <>
                        <Circle className="w-4 h-4 mr-2 fill-red-500 text-red-500" />
                        Record
                    </>
                )}
            </Button>

            <div className="h-4 w-px bg-border mx-2" />

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
                {isRecording ? "Recording... Click Stop to finish" : "Drag clips to move • Drag edges to trim • Click split to cut"}
            </span>
        </div>
    )
}
