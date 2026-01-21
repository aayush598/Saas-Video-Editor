'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
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
  Video
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
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [videoDuration, setVideoDuration] = useState(30)
  const [isExporting, setIsExporting] = useState(false)
  const videoRef = useRef(null)
  const fileInputRef = useRef(null)

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
          setVideoDuration(Math.floor(video.duration))
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
      endTime: currentTime + 3,
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
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    toast.info('Preparing export... This may take a moment')
    
    setTimeout(() => {
      setIsExporting(false)
      toast.success('Video exported successfully! Check your downloads folder.')
    }, 3000)
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
          onClick={handleExport} 
          disabled={!videoUrl || isExporting}
          size="lg"
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          {isExporting ? 'Exporting...' : 'Export Video'}
        </Button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Component Library */}
        <aside className="w-80 border-r bg-card flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold mb-1">Component Library</h2>
            <p className="text-sm text-muted-foreground">Drag or click to add effects</p>
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
                  className="w-full h-full object-contain"
                  onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
                  onLoadedMetadata={(e) => setVideoDuration(e.target.duration)}
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
                
                {/* Play/Pause Button */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="rounded-full w-14 h-14"
                    onClick={togglePlayback}
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          {videoUrl && (
            <div className="border-t bg-card">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Timeline</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{Math.floor(currentTime)}s</span>
                    <span>/</span>
                    <span>{Math.floor(videoDuration)}s</span>
                  </div>
                </div>
                
                {/* Timeline Track */}
                <div className="relative h-24 bg-muted/50 rounded-lg border overflow-x-auto">
                  {/* Time Markers */}
                  <div className="absolute top-0 left-0 right-0 h-6 flex items-center border-b px-2">
                    {Array.from({ length: Math.ceil(videoDuration) + 1 }).map((_, i) => (
                      <div key={i} className="flex-1 text-xs text-muted-foreground text-center">
                        {i}s
                      </div>
                    ))}
                  </div>
                  
                  {/* Components on Timeline */}
                  <div className="absolute top-6 left-0 right-0 bottom-0 p-2">
                    {timelineComponents.map((component) => (
                      <TimelineComponent
                        key={component.id}
                        component={component}
                        videoDuration={videoDuration}
                        onSelect={() => setSelectedComponent(component)}
                        onRemove={() => removeComponent(component.id)}
                        isSelected={selectedComponent?.id === component.id}
                      />
                    ))}
                  </div>
                  
                  {/* Playhead */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                    style={{ left: `${(currentTime / videoDuration) * 100}%` }}
                  >
                    <div className="w-3 h-3 bg-red-500 rounded-full absolute -top-1.5 left-1/2 -translate-x-1/2" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Properties Panel */}
        {selectedComponent && (
          <aside className="w-80 border-l bg-card flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Properties</h2>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeComponent(selectedComponent.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-4">
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
                        value={selectedComponent.startTime}
                        onChange={(e) => updateComponentTiming(
                          selectedComponent.id,
                          parseFloat(e.target.value),
                          selectedComponent.endTime
                        )}
                        min={0}
                        max={videoDuration}
                        step={0.1}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">End Time (seconds)</Label>
                      <Input
                        type="number"
                        value={selectedComponent.endTime}
                        onChange={(e) => updateComponentTiming(
                          selectedComponent.id,
                          selectedComponent.startTime,
                          parseFloat(e.target.value)
                        )}
                        min={selectedComponent.startTime}
                        max={videoDuration}
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
            </ScrollArea>
          </aside>
        )}
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
        className={`absolute pointer-events-none ${
          component.props.position === 'top-right' ? 'top-20 right-20' :
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

function TimelineComponent({ component, videoDuration, onSelect, onRemove, isSelected }) {
  const leftPercent = (component.startTime / videoDuration) * 100
  const widthPercent = ((component.endTime - component.startTime) / videoDuration) * 100
  
  return (
    <div
      className={`absolute h-12 rounded cursor-pointer transition-all group ${
        isSelected ? 'ring-2 ring-primary bg-primary' : 'bg-primary/70 hover:bg-primary'
      }`}
      style={{
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        top: '0'
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