import { useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { ComponentOverlay } from './ComponentOverlay'

export function VideoPreview({
    videoUrl,
    videoRef,
    handleVideoUpload,
    activeComponents,
    currentTime,
    overlayRef
}) {
    const fileInputRef = useRef(null)

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
                    <video
                        ref={videoRef}
                        src={videoUrl}
                        className="w-full h-full object-contain transition-opacity duration-300"
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
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    )
}
