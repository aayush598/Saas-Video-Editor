import { useState } from 'react'
import { toast } from 'sonner'

export function useExport(videoUrl, exportFileName, videoRef, overlayRef, setCurrentTime) {
    const [isExporting, setIsExporting] = useState(false)
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)

    const handleExportClick = () => {
        // If we were using exportFileName in state passed here, we might reset it or something
        // But typically we just open dialog
        setIsExportDialogOpen(true)
    }

    const handleExportConfirm = async () => {
        setIsExportDialogOpen(false)
        setIsExporting(true)
        toast.info('Starting rendering process...')

        try {
            const video = videoRef.current
            const overlay = overlayRef.current

            if (!video || !overlay) {
                throw new Error('Video or overlay elements not found')
            }

            const width = video.videoWidth % 2 === 0 ? video.videoWidth : video.videoWidth - 1
            const height = video.videoHeight % 2 === 0 ? video.videoHeight : video.videoHeight - 1
            const duration = video.duration
            const fps = 30
            const totalFrames = Math.ceil(duration * fps)

            // Initialize Muxer
            const { Muxer, ArrayBufferTarget } = await import('mp4-muxer')
            const html2canvas = (await import('html2canvas')).default

            const muxer = new Muxer({
                target: new ArrayBufferTarget(),
                video: {
                    codec: 'avc',
                    width,
                    height
                },
                fastStart: 'in-memory'
            })

            const videoEncoder = new VideoEncoder({
                output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
                error: (e) => {
                    console.error('VideoEncoder error:', e)
                    toast.error('Video encoding error: ' + e.message)
                }
            })

            videoEncoder.configure({
                codec: 'avc1.4d002a', // Main Profile Level 4.2 (Supports 1080p, 60fps)
                width,
                height,
                bitrate: 5_000_000 // 5 Mbps
            })

            // Prepare Canvas
            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d', { willReadFrequently: true })

            // Save original state
            const originalTime = video.currentTime
            const wasPlaying = !video.paused
            if (wasPlaying) video.pause()

            // Rendering Loop
            for (let i = 0; i < totalFrames; i++) {
                const time = i / fps
                setCurrentTime(time)
                video.currentTime = time

                // Wait for seek and Render
                await new Promise(resolve => {
                    const onSeek = () => {
                        video.removeEventListener('seeked', onSeek)
                        // Wait a bit for React to update the overlay
                        setTimeout(resolve, 100)
                    }
                    // Handle case where seek might not fire if time is same
                    if (Math.abs(video.currentTime - time) < 0.001 && i === 0) {
                        setTimeout(resolve, 100)
                    } else {
                        video.addEventListener('seeked', onSeek)
                        // Safety timeout
                        setTimeout(() => {
                            video.removeEventListener('seeked', onSeek)
                            resolve()
                        }, 1000)
                    }
                })

                // Draw video frame
                ctx.drawImage(video, 0, 0, width, height)

                // Draw overlay
                // Use html2canvas to capture overlay container
                // We need to scale it to match video resolution if video is different from display size
                const overlayRect = overlay.getBoundingClientRect()
                const scaleX = width / overlayRect.width
                const scaleY = height / overlayRect.height

                try {
                    const overlayCanvas = await html2canvas(overlay, {
                        backgroundColor: null,
                        scale: Math.max(scaleX, scaleY), // Best effort scale
                        logging: false,
                        useCORS: true
                    })

                    // Draw overlay canvas on top (scaling to fit)
                    ctx.drawImage(overlayCanvas, 0, 0, width, height)
                } catch (err) {
                    console.warn('Overlay capture failed at', time, err)
                }

                // Encode Frame
                if (videoEncoder.state === 'configured') {
                    const frame = new VideoFrame(canvas, {
                        timestamp: i * (1_000_000 / fps), // microseconds
                        duration: 1_000_000 / fps
                    })

                    videoEncoder.encode(frame, { keyFrame: i % 30 === 0 })
                    frame.close()
                } else {
                    console.error('VideoEncoder not configured, stopping export. State:', videoEncoder.state)
                    break
                }

                // Progress feedback
                if (i % 30 === 0) {
                    toast.loading(`Rendering: ${Math.round((i / totalFrames) * 100)}%`, { id: 'rendering-toast' })
                }
            }

            await videoEncoder.flush()
            muxer.finalize()

            const { buffer } = muxer.target
            const blob = new Blob([buffer], { type: 'video/mp4' })

            // Download
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${exportFileName}.mp4`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)

            // Restore state
            video.currentTime = originalTime
            if (wasPlaying) video.play()

            toast.dismiss('rendering-toast')
            toast.success('Export successful!')

        } catch (error) {
            console.error('Export failed:', error)
            toast.error('Export failed: ' + error.message)
        } finally {
            setIsExporting(false)
        }
    }

    return {
        isExporting,
        setIsExporting,
        isExportDialogOpen,
        setIsExportDialogOpen,
        handleExportClick,
        handleExportConfirm
    }
}
