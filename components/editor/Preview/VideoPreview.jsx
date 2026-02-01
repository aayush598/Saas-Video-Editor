import { useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { ComponentOverlay } from './ComponentOverlay'

export function VideoPreview({
    videoUrl,
    videoRef,
    handleVideoUpload,
    activeComponents,
    currentTime,
    overlayRef,
    videoClips = [],
    isPlaying
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

    return (
        <div className="flex-1 bg-muted/30 flex items-center justify-center p-4 min-h-0">
            {!videoUrl ? (
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
                <div className="relative w-auto h-auto max-w-full max-h-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
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
                </div>
            )}
        </div>
    )
}
