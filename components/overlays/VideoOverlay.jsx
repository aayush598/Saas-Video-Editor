import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, AlertCircle } from 'lucide-react'

export function VideoOverlay({ component, currentTime, isPlaying }) {
    const videoRef = useRef(null)
    const [duration, setDuration] = useState(0)
    const {
        position,
        shape,
        size,
        showBorder,
        borderColor,
        opacity,
        videoSrc,
        activeShadow,
        volume
    } = component.props

    // Sync Video Playback
    useEffect(() => {
        if (!videoSrc || !videoRef.current) return

        const video = videoRef.current
        const localTime = currentTime - (component.startTime || 0)

        // Sync if drift is significant (> 0.2s)
        if (Math.abs(video.currentTime - localTime) > 0.2) {
            video.currentTime = Math.max(0, localTime)
        }

        const componentDuration = component.endTime - component.startTime

        if (localTime >= 0 && localTime <= componentDuration) {
            if (isPlaying) {
                video.play().catch(() => { })
            } else {
                video.pause()
            }
        } else {
            video.pause()
        }

    }, [currentTime, isPlaying, videoSrc, component.startTime, component.endTime])

    // Update volume
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = volume !== undefined ? volume : 1
        }
    }, [volume])

    // Handle Metadata
    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration)
        }
    }

    // Position styles
    const getPositionStyles = () => {
        const margin = '32px' // More breathing room for "professional" look
        switch (position) {
            case 'top-left': return { top: margin, left: margin }
            case 'top-right': return { top: margin, right: margin }
            case 'bottom-left': return { bottom: margin, left: margin }
            case 'bottom-right': return { bottom: margin, right: margin }
            case 'center': return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
            default: return { bottom: margin, right: margin }
        }
    }

    // Size styles
    const getSizeStyles = () => {
        const baseSize = shape === 'rectangle' ? { width: '360px', height: '202px' } : { width: '240px', height: '240px' }

        let scale = 1
        if (size === 'small') scale = 0.75
        if (size === 'large') scale = 1.5

        return {
            width: `calc(${baseSize.width} * ${scale})`,
            height: `calc(${baseSize.height} * ${scale})`
        }
    }

    const containerStyles = {
        ...getPositionStyles(),
        ...getSizeStyles(),
        opacity: opacity !== undefined ? opacity : 1,
        borderRadius: shape === 'circle' ? '50%' : (shape === 'square' ? '16px' : '12px'),
        border: showBorder ? `4px solid ${borderColor}` : 'none',
        boxShadow: activeShadow ? '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4)' : 'none',
    }

    // If center, we need to handle transform separately in motion.div or inline style to avoid conflict??
    // Actually framer motion handles transform seamlessly if we use x/y or just standard css transform if we rely on classes.
    // The explicit transform in getPositionStyles for center might conflict with motion's transform prop if used.
    // simpler to use Flex/Grid centering or standard absolute centering without transform if we can, but transform translate is standard.
    // We'll let `style` prop handle it.

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} // smooth professional ease
            className="absolute z-40 overflow-hidden bg-black"
            style={containerStyles}
        >
            {!videoSrc ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/40 bg-neutral-900 p-6 text-center border-2 border-dashed border-white/10">
                    <Upload className="w-10 h-10 mb-3 opacity-50" />
                    <span className="text-sm font-medium">No video selected</span>
                    <span className="text-xs mt-1 opacity-70">Upload form settings</span>
                </div>
            ) : (
                <video
                    ref={videoRef}
                    src={videoSrc}
                    className="w-full h-full object-cover"
                    onLoadedMetadata={handleLoadedMetadata}
                    muted={false} // Allow audio
                />
            )}
        </motion.div>
    )
}
