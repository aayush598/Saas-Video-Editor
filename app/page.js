'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  Download,
  Upload,
  Plus,
  Trash2,
  Type,
  Monitor,
  Smartphone,
  MessageSquare,
  Terminal,
  Sparkles,
  Settings,
  Video,
  Scissors,
  SkipBack,
  SkipForward
} from 'lucide-react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'

const COMPONENT_LIBRARY = [
  {
    id: 'floating-text',
    name: 'Floating Punch Text',
    icon: Type,
    description: 'Animated floating text with customizable effects',
    defaultProps: {
      text: 'Your Text Here',
      fontSize: 48,
      color: '#ffffff',
      animation: 'float',
      duration: 2
    }
  },
  {
    id: 'browser-frame',
    name: 'Browser Frame',
    icon: Monitor,
    description: 'Floating browser mockup frame',
    defaultProps: {
      url: 'yoursite.com',
      title: 'Your Product',
      width: 800,
      shadow: true
    }
  },
  {
    id: 'device-mockup',
    name: 'Device Mockup',
    icon: Smartphone,
    description: 'Mobile or tablet device mockup',
    defaultProps: {
      device: 'iphone',
      orientation: 'portrait',
      scale: 1
    }
  },
  {
    id: 'callout-bubble',
    name: 'Feature Callout',
    icon: MessageSquare,
    description: 'Animated callout bubble',
    defaultProps: {
      text: 'Key Feature',
      position: 'top-right',
      color: '#3b82f6',
      size: 'medium'
    }
  },
  {
    id: 'terminal',
    name: 'Terminal Window',
    icon: Terminal,
    description: 'Typewriter terminal effect',
    defaultProps: {
      code: 'npm install your-package',
      theme: 'dark',
      speed: 50
    }
  },
  {
    id: 'text-highlight',
    name: 'Text Highlight',
    icon: Sparkles,
    description: 'Highlighted text animation',
    defaultProps: {
      text: 'Important Feature',
      highlightColor: '#fbbf24',
      animationStyle: 'sweep'
    }
  }
]

function App() {
  const [uploadedVideo, setUploadedVideo] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [timelineComponents, setTimelineComponents] = useState([])
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [videoClips, setVideoClips] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [videoDuration, setVideoDuration] = useState(30)
  const [projectDuration, setProjectDuration] = useState(30)
  const [isExporting, setIsExporting] = useState(false)
  const [selectedClip, setSelectedClip] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [exportFileName, setExportFileName] = useState('my-awesome-video')
  const videoRef = useRef(null)
  const fileInputRef = useRef(null)
  const timelineRef = useRef(null)

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
          setVideoDuration(duration)
          setProjectDuration(duration)
          setVideoClips([{
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

  const addComponentToTimeline = (componentType) => {
    const component = COMPONENT_LIBRARY.find(c => c.id === componentType)
    const newComponent = {
      id: `${componentType}-${Date.now()}`,
      type: componentType,
      name: component.name,
      startTime: currentTime,
      endTime: Math.min(currentTime + 3, projectDuration),
      props: { ...component.defaultProps }
    }
    setTimelineComponents([...timelineComponents, newComponent])
    setSelectedComponent(newComponent)
    toast.success(`${component.name} added to timeline`)
  }

  const removeComponent = (id) => {
    setTimelineComponents(timelineComponents.filter(c => c.id !== id))
    if (selectedComponent?.id === id) {
      setSelectedComponent(null)
    }
    toast.info('Component removed')
  }

  const updateComponentProps = (id, newProps) => {
    setTimelineComponents(timelineComponents.map(c =>
      c.id === id ? { ...c, props: { ...c.props, ...newProps } } : c
    ))
  }

  const updateComponentTiming = (id, startTime, endTime) => {
    setTimelineComponents(timelineComponents.map(c =>
      c.id === id ? { ...c, startTime, endTime } : c
    ))
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  const skipBackward = () => {
    setCurrentTime(Math.max(0, currentTime - 5))
  }

  const skipForward = () => {
    setCurrentTime(Math.min(projectDuration, currentTime + 5))
  }

  // Playback Engine
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
  }, [isPlaying, projectDuration])

  // Video Synchronization
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
  }, [currentTime, videoClips, isPlaying, uploadedVideo])

  const handleSplit = () => {
    const clipAtPlayhead = videoClips.find(c => currentTime > c.start && currentTime < c.end)
    if (!clipAtPlayhead) {
      toast.error("No video clip at playhead to split")
      return
    }

    const splitPoint = currentTime
    const relativeSplit = splitPoint - clipAtPlayhead.start
    const sourceSplit = clipAtPlayhead.sourceStart + relativeSplit

    const clipLeft = {
      ...clipAtPlayhead,
      id: `clip-${Date.now()}-1`,
      end: splitPoint,
      sourceEnd: sourceSplit,
      name: clipAtPlayhead.name + ' (1)'
    }

    const clipRight = {
      ...clipAtPlayhead,
      id: `clip-${Date.now()}-2`,
      start: splitPoint,
      sourceStart: sourceSplit,
      name: clipAtPlayhead.name + ' (2)'
    }

    const newClips = videoClips.flatMap(c =>
      c.id === clipAtPlayhead.id ? [clipLeft, clipRight] : [c]
    )
    setVideoClips(newClips)
    toast.success("Video split at playhead!")
  }

  const handleClipMove = (id, newStart) => {
    setVideoClips(prev => {
      const clip = prev.find(c => c.id === id)
      if (!clip) return prev

      const duration = clip.end - clip.start
      const newEnd = newStart + duration

      const updated = prev.map(c =>
        c.id === id ? { ...c, start: newStart, end: newEnd } : c
      ).sort((a, b) => a.start - b.start)

      const maxEnd = Math.max(...updated.map(c => c.end), videoDuration)
      setProjectDuration(maxEnd)

      return updated
    })
  }

  const handleClipResize = (id, edge, newValue) => {
    setVideoClips(prev => {
      const clip = prev.find(c => c.id === id)
      if (!clip) return prev

      let updated = { ...clip }

      if (edge === 'left') {
        const maxStart = clip.end - 0.1
        const newStart = Math.max(0, Math.min(newValue, maxStart))
        const trimAmount = newStart - clip.start
        updated = {
          ...clip,
          start: newStart,
          sourceStart: clip.sourceStart + trimAmount
        }
      } else if (edge === 'right') {
        const minEnd = clip.start + 0.1
        const sourceDuration = clip.sourceEnd - clip.sourceStart
        const maxEnd = clip.start + sourceDuration
        const newEnd = Math.max(minEnd, Math.min(newValue, maxEnd))
        updated = {
          ...clip,
          end: newEnd,
          sourceEnd: clip.sourceStart + (newEnd - clip.start)
        }
      }

      const newClips = prev.map(c => c.id === id ? updated : c)
      const maxEnd = Math.max(...newClips.map(c => c.end), videoDuration)
      setProjectDuration(maxEnd)

      return newClips
    })
  }

  const deleteClip = (id) => {
    setVideoClips(prev => {
      const newClips = prev.filter(c => c.id !== id)
      if (newClips.length === 0) {
        toast.error("Cannot delete the last clip")
        return prev
      }

      const maxEnd = Math.max(...newClips.map(c => c.end))
      setProjectDuration(maxEnd)
      toast.success("Clip deleted")
      return newClips
    })
    if (selectedClip === id) {
      setSelectedClip(null)
    }
  }

  const handleExportClick = () => {
    setExportFileName(`video-${Date.now()}`)
    setIsExportDialogOpen(true)
  }

  const handleExportConfirm = async () => {
    setIsExportDialogOpen(false)

    let fileHandle = null
    try {
      if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
        fileHandle = await window.showSaveFilePicker({
          suggestedName: `${exportFileName}.mp4`,
          types: [{
            description: 'MP4 Video',
            accept: { 'video/mp4': ['.mp4'] },
          }],
        })
      }
    } catch (err) {
      if (err.name === 'AbortError') return
      console.error('File picker error:', err)
    }

    setIsExporting(true)
    toast.info('Rendering video...')

    // Simulate rendering delay
    setTimeout(async () => {
      setIsExporting(false)

      try {
        if (fileHandle) {
          const writable = await fileHandle.createWritable()
          const response = await fetch(videoUrl)
          const blob = await response.blob()
          await writable.write(blob)
          await writable.close()
          toast.success('Video saved successfully!')
        } else {
          // Fallback
          const a = document.createElement('a')
          a.href = videoUrl
          a.download = `${exportFileName}.mp4`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)

          toast.success('Video saved successfully!')
        }
      } catch (error) {
        console.error('Export failed:', error)
        toast.error('Export failed')
      }
    }, 2000)
  }

  const handleTimelineClick = (e) => {
    if (!timelineRef.current) return
    const rect = timelineRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percent = x / rect.width
    const newTime = Math.max(0, Math.min(percent * projectDuration / zoom, projectDuration))
    setCurrentTime(newTime)
  }

  const activeComponents = timelineComponents.filter(
    c => currentTime >= c.startTime && currentTime <= c.endTime
  )

  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Video className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">SaaS Video Editor</h1>
            <p className="text-sm text-muted-foreground">Professional video editing for product launches</p>
          </div>
        </div>
        <Button
          onClick={handleExportClick}
          disabled={!videoUrl || isExporting}
          size="lg"
        >
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export Video'}
        </Button>
      </header>

      {/* Toolbar */}
      <div className="border-b bg-muted/40 px-4 py-2 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSplit}
          disabled={!uploadedVideo}
          title="Split Video at Playhead (S)"
        >
          <Scissors className="w-4 h-4 mr-2" />
          Split
        </Button>
        <div className="h-4 w-px bg-border mx-2" />
        <Button
          variant="ghost"
          size="sm"
          onClick={skipBackward}
          disabled={!uploadedVideo}
          title="Skip Backward 5s"
        >
          <SkipBack className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={togglePlayback}
          disabled={!uploadedVideo}
          title="Play/Pause (Space)"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={skipForward}
          disabled={!uploadedVideo}
          title="Skip Forward 5s"
        >
          <SkipForward className="w-4 h-4" />
        </Button>
        <div className="h-4 w-px bg-border mx-2" />
        <span className="text-xs text-muted-foreground">
          Drag clips to move • Drag edges to trim • Click split to cut
        </span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Component Library */}
        <aside className="w-80 border-r bg-card flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold mb-1">Component Library</h2>
            <p className="text-sm text-muted-foreground">Click to add effects to timeline</p>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {COMPONENT_LIBRARY.map((component) => {
                const Icon = component.icon
                return (
                  <Card
                    key={component.id}
                    className="p-4 cursor-pointer hover:border-primary transition-all hover:shadow-md"
                    onClick={() => addComponentToTimeline(component.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1">{component.name}</h3>
                        <p className="text-xs text-muted-foreground">{component.description}</p>
                      </div>
                      <Plus className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Video Preview */}
          <div className="flex-1 bg-muted/30 flex items-center justify-center p-8">
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
              <div className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full object-contain transition-opacity duration-300"
                  muted={false}
                />

                {/* Overlay Components */}
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
            )}
          </div>

          {/* Timeline */}
          {videoUrl && (
            <div className="border-t bg-card">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Timeline</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">Zoom:</Label>
                      <Slider
                        value={[zoom]}
                        onValueChange={([val]) => setZoom(val)}
                        min={0.5}
                        max={3}
                        step={0.1}
                        className="w-24"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{currentTime.toFixed(1)}s</span>
                      <span>/</span>
                      <span>{projectDuration.toFixed(1)}s</span>
                    </div>
                  </div>
                </div>

                {/* Timeline Track */}
                <div
                  ref={timelineRef}
                  className="relative h-32 bg-muted/50 rounded-lg border overflow-x-auto cursor-crosshair"
                  onClick={handleTimelineClick}
                >
                  {/* Time Markers */}
                  <div className="absolute top-0 left-0 right-0 h-6 flex items-center border-b px-2 bg-muted/80">
                    {Array.from({ length: Math.ceil((projectDuration / zoom)) + 1 }).map((_, i) => (
                      <div key={i} className="flex-1 text-xs text-muted-foreground text-center min-w-[40px]">
                        {i}s
                      </div>
                    ))}
                  </div>

                  {/* Video Clips Track */}
                  <div className="absolute top-8 left-0 right-0 h-14 p-2">
                    <div className="relative h-full">
                      {videoClips.map((clip) => (
                        <VideoClip
                          key={clip.id}
                          clip={clip}
                          projectDuration={projectDuration}
                          zoom={zoom}
                          onMove={handleClipMove}
                          onResize={handleClipResize}
                          onDelete={deleteClip}
                          isSelected={selectedClip === clip.id}
                          onSelect={() => setSelectedClip(clip.id)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Overlay Components Track */}
                  <div className="absolute top-24 left-0 right-0 h-12 p-2">
                    <div className="relative h-full">
                      {timelineComponents.map((component) => (
                        <TimelineComponent
                          key={component.id}
                          component={component}
                          projectDuration={projectDuration}
                          zoom={zoom}
                          onSelect={() => setSelectedComponent(component)}
                          onRemove={() => removeComponent(component.id)}
                          isSelected={selectedComponent?.id === component.id}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Playhead */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 pointer-events-none"
                    style={{ left: `${(currentTime / (projectDuration / zoom)) * 100}%` }}
                  >
                    <div className="w-3 h-3 bg-red-500 rounded-full absolute -top-1.5 left-1/2 -translate-x-1/2" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Properties Panel */}
        {(selectedComponent || selectedClip) && (
          <aside className="w-80 border-l bg-card flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Properties</h2>
              </div>
              {selectedComponent && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeComponent(selectedComponent.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <ScrollArea className="flex-1 p-4">
              {selectedComponent ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Component</Label>
                    <p className="text-sm text-muted-foreground">{selectedComponent.name}</p>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Timing</Label>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs">Start Time (seconds)</Label>
                        <Input
                          type="number"
                          value={selectedComponent.startTime.toFixed(1)}
                          onChange={(e) => updateComponentTiming(
                            selectedComponent.id,
                            parseFloat(e.target.value),
                            selectedComponent.endTime
                          )}
                          min={0}
                          max={projectDuration}
                          step={0.1}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">End Time (seconds)</Label>
                        <Input
                          type="number"
                          value={selectedComponent.endTime.toFixed(1)}
                          onChange={(e) => updateComponentTiming(
                            selectedComponent.id,
                            selectedComponent.startTime,
                            parseFloat(e.target.value)
                          )}
                          min={selectedComponent.startTime}
                          max={projectDuration}
                          step={0.1}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <PropertiesEditor
                    component={selectedComponent}
                    onUpdate={(newProps) => updateComponentProps(selectedComponent.id, newProps)}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Video Clip</Label>
                    <p className="text-sm text-muted-foreground">
                      {videoClips.find(c => c.id === selectedClip)?.name}
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Duration: {(videoClips.find(c => c.id === selectedClip)?.end -
                        videoClips.find(c => c.id === selectedClip)?.start).toFixed(1)}s
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Position: {videoClips.find(c => c.id === selectedClip)?.start.toFixed(1)}s
                    </p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </aside>
        )}
      </div>

      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Video</DialogTitle>
            <DialogDescription>
              Choose a name for your video file.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="filename" className="text-right">
                File Name
              </Label>
              <Input
                id="filename"
                value={exportFileName}
                onChange={(e) => setExportFileName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExportConfirm}>
              Export & Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function VideoClip({ clip, projectDuration, zoom, onMove, onResize, onDelete, isSelected, onSelect }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(null)
  const [dragStart, setDragStart] = useState(null)
  const clipRef = useRef(null)

  const duration = clip.end - clip.start
  const leftPercent = (clip.start / (projectDuration / zoom)) * 100
  const widthPercent = (duration / (projectDuration / zoom)) * 100

  const handleMouseDown = (e, type) => {
    e.stopPropagation()
    onSelect()

    if (type === 'move') {
      setIsDragging(true)
      setDragStart({ x: e.clientX, start: clip.start })
    } else {
      setIsResizing(type)
      setDragStart({ x: e.clientX, value: type === 'left' ? clip.start : clip.end })
    }
  }

  useEffect(() => {
    if (!isDragging && !isResizing) return

    const handleMouseMove = (e) => {
      if (!clipRef.current || !dragStart) return

      const parent = clipRef.current.parentElement
      if (!parent) return

      const parentWidth = parent.offsetWidth
      const deltaX = e.clientX - dragStart.x
      const deltaTime = (deltaX / parentWidth) * (projectDuration / zoom)

      if (isDragging) {
        const newStart = Math.max(0, dragStart.start + deltaTime)
        onMove(clip.id, newStart)
      } else if (isResizing) {
        const newValue = dragStart.value + deltaTime
        onResize(clip.id, isResizing, newValue)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(null)
      setDragStart(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing, dragStart, clip, projectDuration, zoom, onMove, onResize])

  return (
    <div
      ref={clipRef}
      className={`absolute h-full rounded-md overflow-hidden border-2 transition-all ${isSelected
        ? 'border-blue-400 bg-blue-600 shadow-lg'
        : 'border-blue-400/50 bg-blue-600/80 hover:bg-blue-600'
        } ${isDragging || isResizing ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
      }}
      onMouseDown={(e) => handleMouseDown(e, 'move')}
    >
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <span className="text-xs text-white/90 font-medium truncate">{clip.name}</span>
        <button
          className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(clip.id)
          }}
        >
          <Trash2 className="w-3 h-3 text-white" />
        </button>
      </div>

      {/* Left Resize Handle */}
      <div
        className="absolute left-0 top-0 bottom-0 w-2 bg-white/20 hover:bg-white/50 cursor-w-resize z-10 pointer-events-auto"
        onMouseDown={(e) => handleMouseDown(e, 'left')}
      />

      {/* Right Resize Handle */}
      <div
        className="absolute right-0 top-0 bottom-0 w-2 bg-white/20 hover:bg-white/50 cursor-e-resize z-10 pointer-events-auto"
        onMouseDown={(e) => handleMouseDown(e, 'right')}
      />
    </div>
  )
}

function TimelineComponent({ component, projectDuration, zoom, onSelect, onRemove, isSelected }) {
  const leftPercent = (component.startTime / (projectDuration / zoom)) * 100
  const widthPercent = ((component.endTime - component.startTime) / (projectDuration / zoom)) * 100

  return (
    <div
      className={`absolute h-full rounded cursor-pointer transition-all group ${isSelected ? 'ring-2 ring-primary bg-primary' : 'bg-primary/70 hover:bg-primary'
        }`}
      style={{
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
      }}
      onClick={onSelect}
    >
      <div className="h-full px-2 flex items-center justify-between text-xs text-white font-medium">
        <span className="truncate">{component.name}</span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}

function ComponentOverlay({ component, currentTime }) {
  const progress = (currentTime - component.startTime) / (component.endTime - component.startTime)

  if (component.type === 'floating-text') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{
          opacity: 1,
          y: component.props.animation === 'float' ? [0, -20, 0] : 0
        }}
        exit={{ opacity: 0, y: -50 }}
        transition={{
          duration: component.props.duration || 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      >
        <div
          className="font-bold text-center drop-shadow-2xl"
          style={{
            fontSize: `${component.props.fontSize}px`,
            color: component.props.color,
            textShadow: '0 0 20px rgba(0,0,0,0.5)'
          }}
        >
          {component.props.text}
        </div>
      </motion.div>
    )
  }

  if (component.type === 'browser-frame') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: `${component.props.width}px` }}
      >
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
          <div className="h-8 bg-gray-700 flex items-center px-3 gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 h-5 bg-gray-600 rounded text-xs flex items-center px-2 text-gray-300">
              {component.props.url}
            </div>
          </div>
          <div className="bg-white h-48 flex items-center justify-center text-gray-400">
            <Monitor className="w-12 h-12" />
          </div>
        </div>
      </motion.div>
    )
  }

  if (component.type === 'callout-bubble') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        className={`absolute pointer-events-none ${component.props.position === 'top-right' ? 'top-20 right-20' :
          component.props.position === 'top-left' ? 'top-20 left-20' :
            component.props.position === 'bottom-right' ? 'bottom-20 right-20' :
              'bottom-20 left-20'
          }`}
      >
        <div
          className="px-6 py-3 rounded-full text-white font-semibold shadow-lg"
          style={{ backgroundColor: component.props.color }}
        >
          {component.props.text}
        </div>
      </motion.div>
    )
  }

  if (component.type === 'terminal') {
    const displayedText = component.props.code.substring(
      0,
      Math.floor(progress * component.props.code.length)
    )

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: '600px' }}
      >
        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl border border-gray-700">
          <div className="h-8 bg-gray-800 flex items-center px-3 gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-xs text-gray-400">Terminal</span>
          </div>
          <div className="p-4 font-mono text-sm text-green-400">
            <span>$ </span>
            <span>{displayedText}</span>
            <span className="animate-pulse">_</span>
          </div>
        </div>
      </motion.div>
    )
  }

  if (component.type === 'device-mockup') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        className="absolute top-1/2 right-20 -translate-y-1/2 pointer-events-none"
      >
        <div className="bg-gray-900 rounded-3xl p-3 shadow-2xl" style={{ width: '200px' }}>
          <div className="bg-white rounded-2xl aspect-[9/19] flex items-center justify-center">
            <Smartphone className="w-12 h-12 text-gray-300" />
          </div>
        </div>
      </motion.div>
    )
  }

  if (component.type === 'text-highlight') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 pointer-events-none"
      >
        <div className="relative inline-block">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 opacity-30 -z-10"
            style={{ backgroundColor: component.props.highlightColor }}
          />
          <span className="text-4xl font-bold text-white px-4">
            {component.props.text}
          </span>
        </div>
      </motion.div>
    )
  }

  return null
}

function PropertiesEditor({ component, onUpdate }) {
  const props = component.props

  if (component.type === 'floating-text') {
    return (
      <div className="space-y-4">
        <div>
          <Label className="text-sm">Text</Label>
          <Input
            value={props.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="Enter your text"
          />
        </div>
        <div>
          <Label className="text-sm">Font Size: {props.fontSize}px</Label>
          <Slider
            value={[props.fontSize]}
            onValueChange={([value]) => onUpdate({ fontSize: value })}
            min={24}
            max={120}
            step={4}
          />
        </div>
        <div>
          <Label className="text-sm">Color</Label>
          <Input
            type="color"
            value={props.color}
            onChange={(e) => onUpdate({ color: e.target.value })}
          />
        </div>
      </div>
    )
  }

  if (component.type === 'browser-frame') {
    return (
      <div className="space-y-4">
        <div>
          <Label className="text-sm">URL</Label>
          <Input
            value={props.url}
            onChange={(e) => onUpdate({ url: e.target.value })}
            placeholder="yoursite.com"
          />
        </div>
        <div>
          <Label className="text-sm">Width: {props.width}px</Label>
          <Slider
            value={[props.width]}
            onValueChange={([value]) => onUpdate({ width: value })}
            min={400}
            max={1200}
            step={50}
          />
        </div>
      </div>
    )
  }

  if (component.type === 'callout-bubble') {
    return (
      <div className="space-y-4">
        <div>
          <Label className="text-sm">Text</Label>
          <Input
            value={props.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="Feature description"
          />
        </div>
        <div>
          <Label className="text-sm">Position</Label>
          <select
            className="w-full h-10 px-3 rounded-md border bg-background"
            value={props.position}
            onChange={(e) => onUpdate({ position: e.target.value })}
          >
            <option value="top-left">Top Left</option>
            <option value="top-right">Top Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="bottom-right">Bottom Right</option>
          </select>
        </div>
        <div>
          <Label className="text-sm">Color</Label>
          <Input
            type="color"
            value={props.color}
            onChange={(e) => onUpdate({ color: e.target.value })}
          />
        </div>
      </div>
    )
  }

  if (component.type === 'terminal') {
    return (
      <div className="space-y-4">
        <div>
          <Label className="text-sm">Command</Label>
          <Input
            value={props.code}
            onChange={(e) => onUpdate({ code: e.target.value })}
            placeholder="npm install..."
          />
        </div>
        <div>
          <Label className="text-sm">Typing Speed: {props.speed}ms</Label>
          <Slider
            value={[props.speed]}
            onValueChange={([value]) => onUpdate({ speed: value })}
            min={10}
            max={200}
            step={10}
          />
        </div>
      </div>
    )
  }

  if (component.type === 'text-highlight') {
    return (
      <div className="space-y-4">
        <div>
          <Label className="text-sm">Text</Label>
          <Input
            value={props.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="Important text"
          />
        </div>
        <div>
          <Label className="text-sm">Highlight Color</Label>
          <Input
            type="color"
            value={props.highlightColor}
            onChange={(e) => onUpdate({ highlightColor: e.target.value })}
          />
        </div>
      </div>
    )
  }

  return <p className="text-sm text-muted-foreground">No properties available</p>
}

export default App