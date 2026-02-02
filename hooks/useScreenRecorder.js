
import { useState, useRef, useCallback } from 'react'
import { toast } from 'sonner'

export function useScreenRecorder({ onRecordingComplete }) {
    const [isRecording, setIsRecording] = useState(false)
    const [isCountingDown, setIsCountingDown] = useState(false)
    const [countdown, setCountdown] = useState(3)
    const mediaRecorderRef = useRef(null)
    const chunksRef = useRef([])

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: { cursor: "always" },
                audio: true
            })

            // Check if user cancelled
            stream.getVideoTracks()[0].onended = () => {
                stopRecording()
            }

            // Start Countdown
            setIsCountingDown(true)
            let count = 3
            setCountdown(count)

            const timer = setInterval(() => {
                count--
                setCountdown(count)
                if (count === 0) {
                    clearInterval(timer)
                    setIsCountingDown(false)
                    beginMediaRecording(stream)
                }
            }, 1000)

        } catch (err) {
            console.error("Error starting screen recording:", err)
            toast.error("Failed to start screen recording")
        }
    }, [])

    const beginMediaRecording = (stream) => {
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder
        chunksRef.current = []

        // Metadata capture
        const events = []
        const startTime = Date.now()

        const clickHandler = (e) => {
            events.push({
                type: 'click',
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
                time: (Date.now() - startTime) / 1000 // seconds
            })
        }

        // Note: This only works for the current tab. 
        // Capturing events from other tabs/windows is not possible via standard Web APIs.
        window.addEventListener('click', clickHandler)

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunksRef.current.push(e.data)
            }
        }

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' })
            const file = new File([blob], "screen-recording.webm", { type: 'video/webm' })

            // Cleanup events
            window.removeEventListener('click', clickHandler)

            // Stop all tracks
            stream.getTracks().forEach(track => track.stop())

            setIsRecording(false)
            if (onRecordingComplete) {
                onRecordingComplete(file, events)
            }
        }

        mediaRecorder.start()
        setIsRecording(true)
    }

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop()
        }
    }, [])

    return {
        isRecording,
        isCountingDown,
        countdown,
        startRecording,
        stopRecording
    }
}
