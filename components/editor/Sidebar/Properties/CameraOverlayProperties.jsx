import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Video, Upload, Trash2, Circle, Square, StopCircle } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export function CameraOverlayProperties({ component, onUpdate }) {
    const props = component.props
    const [isRecording, setIsRecording] = useState(false)
    const mediaRecorderRef = useRef(null)
    const chunksRef = useRef([])
    const streamRef = useRef(null)

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop())
            }
        }
    }, [])

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720 },
                audio: true
            })

            streamRef.current = stream
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder
            chunksRef.current = []

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data)
                }
            }

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' })
                const url = URL.createObjectURL(blob)
                onUpdate({ videoSrc: url })

                // Cleanup
                stream.getTracks().forEach(track => track.stop())
                streamRef.current = null
            }

            mediaRecorder.start()
            setIsRecording(true)

        } catch (err) {
            console.error("Failed to start recording:", err)
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
        }
    }

    const handleUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            onUpdate({ videoSrc: url })
        }
    }

    const clearVideo = () => {
        onUpdate({ videoSrc: null })
    }

    return (
        <div className="space-y-6">
            {/* Source Management */}
            <div>
                <Label className="text-sm mb-3 block font-medium">Camera Source</Label>

                {!props.videoSrc ? (
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant={isRecording ? "destructive" : "outline"}
                            className="h-24 flex flex-col gap-2 border-dashed relative overflow-hidden"
                            onClick={isRecording ? stopRecording : startRecording}
                        >
                            {isRecording ? (
                                <>
                                    <StopCircle className="w-8 h-8 animate-pulse" />
                                    <span className="text-xs font-semibold">Stop Recording</span>
                                    <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none" />
                                </>
                            ) : (
                                <>
                                    <Circle className="w-8 h-8 fill-red-500 text-red-500" />
                                    <span className="text-xs font-semibold">Record Clip</span>
                                </>
                            )}
                        </Button>

                        <div className="relative group">
                            <input
                                type="file"
                                accept="video/*"
                                className="absolute inset-0 z-10 opacity-0 cursor-pointer w-full h-full"
                                onChange={handleUpload}
                                disabled={isRecording}
                            />
                            <Button
                                variant="outline"
                                className="w-full h-24 flex flex-col gap-2 border-dashed group-hover:border-primary group-hover:bg-primary/5 transition-colors"
                                disabled={isRecording}
                            >
                                <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                                <span className="text-xs font-semibold">Upload Video</span>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="border rounded-lg p-3 bg-muted/40 relative group overflow-hidden">
                        <div className="flex items-center justify-between mb-2 z-10 relative">
                            <div className="flex items-center gap-2">
                                <Video className="w-4 h-4 text-primary" />
                                <span className="text-xs font-medium text-muted-foreground">Recorded Clip</span>
                            </div>
                            <Button
                                size="icon"
                                variant="destructive"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={clearVideo}
                            >
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                        <video
                            src={props.videoSrc}
                            className="w-full h-32 object-cover rounded bg-black/90"
                            controls={false}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 pointer-events-none transition-colors" />
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div>
                    <Label className="text-sm mb-2 block">Position</Label>
                    <Select
                        value={props.position}
                        onValueChange={(value) => onUpdate({ position: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="top-left">Top Left</SelectItem>
                            <SelectItem value="top-right">Top Right</SelectItem>
                            <SelectItem value="bottom-left">Bottom Left</SelectItem>
                            <SelectItem value="bottom-right">Bottom Right</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label className="text-sm mb-2 block">Shape</Label>
                    <Select
                        value={props.shape}
                        onValueChange={(value) => onUpdate({ shape: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select shape" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="circle">Circle</SelectItem>
                            <SelectItem value="square">Square</SelectItem>
                            <SelectItem value="rectangle">Rectangle</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label className="text-sm mb-2 block">Size</Label>
                    <Select
                        value={props.size}
                        onValueChange={(value) => onUpdate({ size: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center justify-between">
                    <Label className="text-sm">Show Border</Label>
                    <Switch
                        checked={props.showBorder}
                        onCheckedChange={(checked) => onUpdate({ showBorder: checked })}
                    />
                </div>

                {props.showBorder && (
                    <div>
                        <Label className="text-sm mb-2 block">Border Color</Label>
                        <div className="flex gap-2">
                            <Input
                                type="color"
                                value={props.borderColor}
                                onChange={(e) => onUpdate({ borderColor: e.target.value })}
                                className="w-10 h-10 p-1 cursor-pointer"
                            />
                            <Input
                                type="text"
                                value={props.borderColor}
                                onChange={(e) => onUpdate({ borderColor: e.target.value })}
                                className="flex-1"
                            />
                        </div>
                    </div>
                )}

                <div>
                    <Label className="text-sm mb-2 block">Opacity: {props.opacity}</Label>
                    <Slider
                        value={[props.opacity || 1]}
                        min={0}
                        max={1}
                        step={0.1}
                        onValueChange={([val]) => onUpdate({ opacity: val })}
                    />
                </div>
            </div>
        </div>
    )
}
