import { useEffect, useRef, useState } from 'react'

export function AudioPlayer({ component, currentTime, isPlaying }) {
    const audioRef = useRef(null)
    const { audioSrc, volume = 100, loop = false } = component.props
    const [duration, setDuration] = useState(0)

    // Handle Metadata Load
    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration)
        }
    }

    // Effect for Volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = Math.max(0, Math.min(1, volume / 100))
        }
    }, [volume])

    // Effect for Sync and Playback
    useEffect(() => {
        const audio = audioRef.current
        if (!audio || !audioSrc) return

        const relativeTime = currentTime - component.startTime
        const componentDuration = component.endTime - component.startTime

        // Check if we are within the component's timeline window
        if (relativeTime >= 0 && relativeTime <= componentDuration) {
            // Determine active audio time
            let targetTime = relativeTime
            if (loop && duration > 0) {
                targetTime = relativeTime % duration
            }

            // Sync Time: Only if drift is significant to avoid stutter
            if (Math.abs(audio.currentTime - targetTime) > 0.3) {
                audio.currentTime = targetTime
            }

            // Sync Playback State
            if (isPlaying) {
                if (audio.paused) {
                    audio.play().catch(e => {
                        // Ignore auto-play errors
                        console.log("Audio play prevented:", e)
                    })
                }
            } else {
                if (!audio.paused) {
                    audio.pause()
                }
            }
        } else {
            // Outside of window
            if (!audio.paused) {
                audio.pause()
            }
            // Reset to start if we moved before the clip
            if (relativeTime < 0 && Math.abs(audio.currentTime - 0) > 0.1) {
                audio.currentTime = 0
            }
        }
    }, [currentTime, isPlaying, component.startTime, component.endTime, audioSrc, loop, duration])

    if (!audioSrc) return null

    return (
        <audio
            ref={audioRef}
            src={audioSrc}
            loop={loop}
            onLoadedMetadata={handleLoadedMetadata}
            className="hidden"
        />
    )
}
