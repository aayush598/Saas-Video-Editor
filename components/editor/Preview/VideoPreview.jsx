import { useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { ComponentOverlay } from './ComponentOverlay'
import { Play, Pause, SkipBack, SkipForward, Maximize, Settings, Volume2, RotateCcw } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function VideoPreview({
    videoUrl,
    videoRef,
    handleVideoUpload,
    activeComponents,
    currentTime,
    overlayRef,
    videoClips = [],
    isPlaying,
    addComponentToTimeline,
    togglePlayback,
    skipBackward,
    skipForward
}) {
    const fileInputRef = useRef(null)

    // Check if current time is within any active video clip
    const isVideoVisible = videoClips.some(clip =>
        currentTime >= clip.start && currentTime < clip.end
    )

    // Calculate zoom if active
    const zoomComponent = activeComponents.find(c => c.type === 'zoom-area')
    let scale = 1
    let originX = 50
    let originY = 50

    if (zoomComponent) {
        const { x, y, scale: targetScale } = zoomComponent.props
        const duration = zoomComponent.endTime - zoomComponent.startTime
        const elapsed = currentTime - zoomComponent.startTime
        const remaining = zoomComponent.endTime - currentTime

        // Transition time (0.5s default)
        const transitionTime = Math.min(0.5, duration / 2)

        let progress = 0
        if (elapsed >= 0 && remaining >= 0) {
            if (elapsed < transitionTime) {
                progress = elapsed / transitionTime
            } else if (remaining < transitionTime) {
                progress = remaining / transitionTime
            } else {
                progress = 1
            }
        }

        // Simple Ease In Out
        const easeInOut = t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
        const smoothedProgress = easeInOut(Math.max(0, Math.min(1, progress)))

        scale = 1 + (targetScale - 1) * smoothedProgress
        originX = x
        originY = y
    }

    const [volume, setVolume] = useState(1)
    const [playbackSpeed, setPlaybackSpeed] = useState(1)
    const [showControls, setShowControls] = useState(false)

    const toggleFullScreen = () => {
        if (!videoRef.current) return
        if (document.fullscreenElement) {
            document.exitFullscreen()
        } else {
            videoRef.current.parentElement.requestFullscreen()
        }
    }

    const handleSpeedChange = (value) => {
        const speed = parseFloat(value)
        setPlaybackSpeed(speed)
        if (videoRef.current) {
            videoRef.current.playbackRate = speed
        }
    }

    return (
        <div className="flex-1 bg-muted/30 flex items-center justify-center p-4 min-h-0 flex-col gap-2">
            {!videoUrl || videoClips.length === 0 ? (
                <Card className="p-12 text-center max-w-md">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Upload Your Video</h3>
                    <p className="text-muted-foreground mb-6">
                        Upload your product demo or launch video to start adding professional effects
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                    />
                    <Button
                        size="lg"
                        onClick={() => fileInputRef.current?.click()}
                        className="gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        Choose Video File
                    </Button>
                </Card>
            ) : (
                <div
                    className="relative w-auto h-auto max-w-full max-h-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl group cursor-pointer"
                    onMouseEnter={() => setShowControls(true)}
                    onMouseLeave={() => setShowControls(false)}
                    onClick={togglePlayback}
                >
                    <motion.div
                        className="w-full h-full relative"
                        animate={{
                            scale: scale,
                            transformOrigin: `${originX}% ${originY}%`
                        }}
                        transition={{ duration: 0 }}
                    >
                        <video
                            ref={videoRef}
                            src={videoUrl}
                            className="w-full h-full object-contain transition-opacity duration-150"
                            style={{
                                opacity: isVideoVisible ? 1 : 0,
                                visibility: isVideoVisible ? 'visible' : 'hidden'
                            }}
                            muted={false}
                        />

                        {/* Overlay Components */}
                        <div ref={overlayRef} className="absolute inset-0 z-10 pointer-events-none">
                            <AnimatePresence>
                                {activeComponents.map((component) => (
                                    <ComponentOverlay
                                        key={component.id}
                                        component={component}
                                        currentTime={currentTime}
                                        isPlaying={isPlaying}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Central Play/Pause Button */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                        {!isPlaying && (
                            <div className="bg-black/50 rounded-full p-4 text-white backdrop-blur-sm shadow-xl transition-all scale-100 opacity-100">
                                <Play className="w-12 h-12 fill-white" />
                            </div>
                        )}
                        {isPlaying && showControls && (
                            <div className="bg-black/30 rounded-full p-4 text-white backdrop-blur-sm shadow-xl transition-all scale-100 opacity-0 group-hover:opacity-100">
                                <Pause className="w-12 h-12 fill-white" />
                            </div>
                        )}
                    </div>

                    {/* Video Controls Bar */}
                    <div
                        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 z-30 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'} cursor-default`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between gap-4 text-white">
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={togglePlayback}>
                                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                                </Button>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={skipBackward}>
                                    <SkipBack className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={skipForward}>
                                    <SkipForward className="w-5 h-5" />
                                </Button>
                                <div className="text-xs font-medium ml-2">
                                    {new Date(currentTime * 1000).toISOString().substr(14, 5)}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 text-xs gap-1 h-8">
                                            {playbackSpeed}x
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-24 p-1">
                                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                                            <div
                                                key={speed}
                                                className={`cursor-pointer px-2 py-1.5 text-sm hover:bg-muted rounded ${playbackSpeed === speed ? 'bg-muted font-medium' : ''}`}
                                                onClick={() => handleSpeedChange(speed)}
                                            >
                                                {speed}x
                                            </div>
                                        ))}
                                    </PopoverContent>
                                </Popover>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-8">
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-32 p-1">
                                        <div className="px-2 py-1.5 text-xs text-muted-foreground font-semibold">Quality</div>
                                        <div className="cursor-pointer px-2 py-1.5 text-sm hover:bg-muted rounded text-primary font-medium">1080p HD</div>
                                        <div className="cursor-pointer px-2 py-1.5 text-sm hover:bg-muted rounded">720p</div>
                                        <div className="cursor-pointer px-2 py-1.5 text-sm hover:bg-muted rounded">480p</div>
                                    </PopoverContent>
                                </Popover>

                                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={toggleFullScreen}>
                                    <Maximize className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
