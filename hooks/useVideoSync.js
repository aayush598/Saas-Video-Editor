import { useEffect, useRef } from 'react'

export function useVideoSync({ videoRef, uploadedVideo, currentTime, videoClips, isPlaying }) {
    const seekTimeoutRef = useRef(null)

    useEffect(() => {
        if (!videoRef.current || !uploadedVideo) return

        // Clear any pending seeks from previous renders to avoid stacking
        if (seekTimeoutRef.current) {
            clearTimeout(seekTimeoutRef.current)
        }

        const currentClip = videoClips.find(c => currentTime >= c.start && currentTime < c.end)

        if (currentClip) {
            const timeInClip = currentTime - currentClip.start
            const videoTime = currentClip.sourceStart + timeInClip

            const diff = Math.abs(videoRef.current.currentTime - videoTime)
            // Use strict threshold when paused (seeking) for frame accuracy
            // Use looser threshold when playing to avoid stuttering from constant seeking
            const threshold = isPlaying ? 0.25 : 0.05

            if (diff > threshold) {
                const updateVideo = () => {
                    if (videoRef.current) {
                        videoRef.current.currentTime = videoTime
                    }
                }

                if (isPlaying) {
                    // Always update immediately during playback to correct drift
                    updateVideo()
                } else {
                    // Smart seeking when paused (scrubbing/clicking)
                    // If video is already seeking, wait to avoid overwhelming the decoder
                    if (videoRef.current.seeking) {
                        seekTimeoutRef.current = setTimeout(updateVideo, 50)
                    } else {
                        updateVideo()
                    }
                }
            }

            if (isPlaying && videoRef.current.paused) {
                videoRef.current.play().catch(() => { })
            } else if (!isPlaying && !videoRef.current.paused) {
                videoRef.current.pause()
            }
        } else {
            if (!videoRef.current.paused) {
                videoRef.current.pause()
            }
        }

        return () => {
            if (seekTimeoutRef.current) {
                clearTimeout(seekTimeoutRef.current)
            }
        }
    }, [currentTime, videoClips, isPlaying, uploadedVideo, videoRef])
}
