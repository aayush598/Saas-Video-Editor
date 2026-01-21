import { useEffect } from 'react'

export function usePlaybackEngine({ isPlaying, projectDuration, setCurrentTime, setIsPlaying }) {
    useEffect(() => {
        let animationFrame
        let lastTime = performance.now()

        const tick = (now) => {
            if (isPlaying) {
                const delta = (now - lastTime) / 1000
                lastTime = now

                setCurrentTime(prev => {
                    const next = prev + delta
                    if (next >= projectDuration) {
                        setIsPlaying(false)
                        return projectDuration
                    }
                    return next
                })
                animationFrame = requestAnimationFrame(tick)
            }
        }

        if (isPlaying) {
            lastTime = performance.now()
            animationFrame = requestAnimationFrame(tick)
        }

        return () => cancelAnimationFrame(animationFrame)
    }, [isPlaying, projectDuration, setCurrentTime, setIsPlaying])
}
