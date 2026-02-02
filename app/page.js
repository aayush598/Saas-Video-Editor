'use client'

import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { EditorLayout } from '@/components/editor/EditorLayout'
import { useTimeline } from '@/hooks/useTimeline'
import { usePlaybackEngine } from '@/hooks/usePlaybackEngine'
import { useVideoSync } from '@/hooks/useVideoSync'
import { useExport } from '@/hooks/useExport'

export default function App() {
  // Video Source State
  const [uploadedVideo, setUploadedVideo] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const videoRef = useRef(null)
  const overlayRef = useRef(null)

  // Playback State
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  // Timeline & Components Logic
  const timeline = useTimeline()

  // Export Logic
  const [exportFileName, setExportFileName] = useState('my-awesome-video')
  const {
    isExporting,
    isExportDialogOpen,
    setIsExportDialogOpen,
    handleExportClick,
    handleExportConfirm
  } = useExport(videoUrl, exportFileName, videoRef, overlayRef, setCurrentTime)

  // Derived State
  const activeComponents = timeline.timelineComponents.filter(
    c => currentTime >= c.startTime && currentTime <= c.endTime
  )

  // Hooks
  usePlaybackEngine({
    isPlaying,
    projectDuration: timeline.projectDuration,
    setCurrentTime,
    setIsPlaying
  })

  useVideoSync({
    videoRef,
    uploadedVideo,
    currentTime,
    videoClips: timeline.videoClips,
    isPlaying
  })

  // Handlers
  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file)
        setVideoUrl(url)
        setUploadedVideo(file)
        toast.success('Video uploaded successfully!')

        const video = document.createElement('video')
        video.src = url
        video.onloadedmetadata = () => {
          const duration = Math.floor(video.duration * 10) / 10
          // Initialize timeline with this video
          timeline.setProjectDuration(duration)
          timeline.setVideoClips([{
            id: 'clip-initial',
            sourceStart: 0,
            sourceEnd: duration,
            start: 0,
            end: duration,
            name: 'Main Clip'
          }])
        }
      } else {
        toast.error('Please upload a valid video file')
      }
    }
  }

  const handleRecordingComplete = (file) => {
    if (file) {
      const url = URL.createObjectURL(file)
      setVideoUrl(url)
      setUploadedVideo(file)
      toast.success('Screen recording captured!')

      const video = document.createElement('video')
      video.src = url
      video.onloadedmetadata = () => {
        const duration = Math.floor(video.duration * 10) / 10
        timeline.setProjectDuration(duration)
        timeline.setVideoClips([{
          id: 'clip-screen-' + Date.now(),
          sourceStart: 0,
          sourceEnd: duration,
          start: 0,
          end: duration,
          name: 'Screen Recording'
        }])
      }
    }
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  const skipBackward = () => {
    setCurrentTime(Math.max(0, currentTime - 5))
  }

  const skipForward = () => {
    setCurrentTime(Math.min(timeline.projectDuration, currentTime + 5))
  }

  return (
    <EditorLayout
      // Global
      uploadedVideo={uploadedVideo}
      videoUrl={videoUrl}
      videoRef={videoRef}
      overlayRef={overlayRef}
      handleVideoUpload={handleVideoUpload}
      handleRecordingComplete={handleRecordingComplete}

      // Playback
      isPlaying={isPlaying}
      togglePlayback={togglePlayback}
      currentTime={currentTime}
      setCurrentTime={setCurrentTime}
      skipBackward={skipBackward}
      skipForward={skipForward}

      // Timeline
      {...timeline}
      addComponentToTimeline={(id) => {
        if (id === 'freeze-frame' && videoRef.current) {
          try {
            const video = videoRef.current
            const canvas = document.createElement('canvas')
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            const ctx = canvas.getContext('2d')
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8)

            timeline.addComponentToTimeline(id, currentTime, { imageSrc: dataUrl })
          } catch (e) {
            console.error("Failed to capture frame", e)
            toast.error("Could not capture frame. Check console.")
            timeline.addComponentToTimeline(id, currentTime)
          }
        } else {
          timeline.addComponentToTimeline(id, currentTime)
        }
      }}
      handleSplit={() => timeline.handleSplit(currentTime)}
      handleClipMove={(id, newStart) => timeline.handleClipMove(id, newStart, timeline.projectDuration)}
      handleClipResize={(id, edge, newValue) => timeline.handleClipResize(id, edge, newValue, timeline.projectDuration)}
      copyItem={timeline.copyItem}
      pasteItem={() => timeline.pasteItem(currentTime)}
      clipboard={timeline.clipboard}

      // Export
      isExporting={isExporting}
      handleExportClick={handleExportClick}
      isExportDialogOpen={isExportDialogOpen}
      setIsExportDialogOpen={setIsExportDialogOpen}
      exportFileName={exportFileName}
      setExportFileName={setExportFileName}
      handleExportConfirm={handleExportConfirm}

      // Derived
      activeComponents={activeComponents}
    />
  )
}