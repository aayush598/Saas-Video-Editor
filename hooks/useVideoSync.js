import { useEffect } from 'react'

export function useVideoSync({ videoRef, uploadedVideo, currentTime, videoClips, isPlaying }) {
    useEffect(() => {
        if (!videoRef.current || !uploadedVideo) return

        const currentClip = videoClips.find(c => currentTime >= c.start && currentTime < c.end)

        if (currentClip) {
            const timeInClip = currentTime - currentClip.start
            const videoTime = currentClip.sourceStart + timeInClip

            if (Math.abs(videoRef.current.currentTime - videoTime) > 0.3) {
                videoRef.current.currentTime = videoTime
            }

            if (isPlaying && videoRef.current.paused) {
                videoRef.current.play().catch(() => { })
            } else if (!isPlaying && !videoRef.current.paused) {
                videoRef.current.pause()
            }
            videoRef.current.style.opacity = '1'
        } else {
            if (!videoRef.current.paused) {
                videoRef.current.pause()
            }
            videoRef.current.style.opacity = '0.3'
        }
    }, [currentTime, videoClips, isPlaying, uploadedVideo, videoRef])
}
