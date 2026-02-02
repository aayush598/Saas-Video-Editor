import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, CameraOff } from 'lucide-react'

export function CameraOverlay({ component, currentTime, isPlaying }) {
    const videoRef = useRef(null)
    const [stream, setStream] = useState(null)
    const [error, setError] = useState(null)
    const { position, shape, size, showBorder, borderColor, opacity, videoSrc } = component.props

    // Live Camera Logic
    useEffect(() => {
        if (videoSrc) {
            // Stop stream if we switched to video mode
            if (stream) {
                stream.getTracks().forEach(track => track.stop())
                setStream(null)
            }
            return
        }

        let currentStream = null

        const startCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 1280, height: 720 }
                })
                setStream(mediaStream)
                currentStream = mediaStream
                if (videoRef.current && !videoSrc) {
                    videoRef.current.srcObject = mediaStream
                }
            } catch (err) {
                console.error("Error accessing camera:", err)
                setError("Camera access denied or unavailable")
            }
        }

        startCamera()

        return () => {
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop())
            }
        }
    }, [videoSrc])

    // Video Playback Sync Logic
    useEffect(() => {
        if (!videoSrc || !videoRef.current) return

        const video = videoRef.current
        const localTime = currentTime - (component.startTime || 0)

        // Sync if drift is significant (> 0.2s)
        const targetTime = Math.max(0, localTime)
        if (Math.abs(video.currentTime - targetTime) > 0.2) {
            video.currentTime = targetTime
        }

        // Check bounds
        const componentDuration = component.endTime - component.startTime
        if (localTime >= 0 && localTime <= componentDuration) {
            if (isPlaying) {
                video.play().catch(() => { })
            } else {
                video.pause()
            }
        } else {
            video.pause()
            if (localTime < 0) video.currentTime = 0
            // if localTime > duration, we can leave it at last frame or loop logic (user didn't specify, default to stop at end or pause)
        }

    }, [currentTime, isPlaying, videoSrc, component.startTime, component.endTime])

    // Position styles
    const getPositionStyles = () => {
        const margin = '20px'
        switch (position) {
            case 'top-left': return { top: margin, left: margin }
            case 'top-right': return { top: margin, right: margin }
            case 'bottom-left': return { bottom: margin, left: margin }
            case 'bottom-right': return { bottom: margin, right: margin }
            default: return { bottom: margin, right: margin }
        }
    }

    // Size styles
    const getSizeStyles = () => {
        const baseSize = shape === 'rectangle' ? { width: '320px', height: '180px' } : { width: '200px', height: '200px' }

        let scale = 1
        if (size === 'small') scale = 0.75
        if (size === 'large') scale = 1.25

        return {
            width: `calc(${baseSize.width} * ${scale})`,
            height: `calc(${baseSize.height} * ${scale})`
        }
    }

    const containerStyles = {
        ...getPositionStyles(),
        ...getSizeStyles(),
        opacity: opacity !== undefined ? opacity : 1,
        borderRadius: shape === 'circle' ? '50%' : '12px',
        border: showBorder ? `4px solid ${borderColor}` : 'none',
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute z-50 overflow-hidden bg-black shadow-2xl"
            style={containerStyles}
        >
            {error && !videoSrc ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/50 bg-neutral-900 p-4 text-center">
                    <CameraOff className="w-8 h-8 mb-2" />
                    <span className="text-xs">{error}</span>
                </div>
            ) : (
                <div className="w-full h-full relative">
                    <video
                        ref={videoRef}
                        src={videoSrc}
                        autoPlay={!videoSrc}
                        muted={!videoSrc} // Mute if live camera to avoid feedback
                        playsInline
                        className="w-full h-full object-cover"
                        style={{ transform: videoSrc ? 'none' : 'scaleX(-1)' }} // Mirror only live camera
                    />
                    {!stream && !videoSrc && (
                        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 text-white/50">
                            <Camera className="w-8 h-8 animate-pulse" />
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    )
}
