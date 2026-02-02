import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Upload, Trash2, CheckCircle2, Video } from 'lucide-react'

export function VideoOverlayProperties({ component, onUpdate }) {
    const props = component.props

    const handleUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            onUpdate({ videoSrc: url })
        }
    }

    return (
        <div className="space-y-6">
            {/* Video Source */}
            <div>
                <Label className="text-sm mb-3 block font-medium">Video Source</Label>
                {!props.videoSrc ? (
                    <div className="relative group">
                        <input
                            type="file"
                            accept="video/*"
                            className="absolute inset-0 z-10 opacity-0 cursor-pointer w-full h-full"
                            onChange={handleUpload}
                        />
                        <div className="w-full h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground group-hover:border-primary group-hover:bg-primary/5 transition-all">
                            <Upload className="w-6 h-6" />
                            <span className="text-xs font-semibold">Click to Upload Video</span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="border rounded-lg p-3 bg-muted/40 relative group overflow-hidden">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Video className="w-4 h-4 text-primary" />
                                    <span className="text-xs font-medium text-muted-foreground">Attached Video</span>
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                    onClick={() => onUpdate({ videoSrc: null })}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                            <video
                                src={props.videoSrc}
                                className="w-full h-24 object-cover rounded bg-black/50"
                            />
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full relative"
                        >
                            <input
                                type="file"
                                accept="video/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleUpload}
                            />
                            Replace Video
                        </Button>
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
                            <SelectItem value="center">Center</SelectItem>
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
                            <SelectItem value="rectangle">Rectangle (16:9)</SelectItem>
                            <SelectItem value="circle">Circle</SelectItem>
                            <SelectItem value="square">Square</SelectItem>
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

                <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">Active Shadow</Label>
                        <Switch
                            checked={props.activeShadow}
                            onCheckedChange={(checked) => onUpdate({ activeShadow: checked })}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label className="text-sm">Show Border</Label>
                        <Switch
                            checked={props.showBorder}
                            onCheckedChange={(checked) => onUpdate({ showBorder: checked })}
                        />
                    </div>
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
                                className="flex-1 font-mono text-xs uppercase"
                            />
                        </div>
                    </div>
                )}

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <Label className="text-sm">Opacity</Label>
                        <span className="text-xs text-muted-foreground">{Math.round((props.opacity || 1) * 100)}%</span>
                    </div>
                    <Slider
                        value={[props.opacity || 1]}
                        min={0}
                        max={1}
                        step={0.05}
                        onValueChange={([val]) => onUpdate({ opacity: val })}
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <Label className="text-sm">Volume</Label>
                        <span className="text-xs text-muted-foreground">{Math.round((props.volume || 1) * 100)}%</span>
                    </div>
                    <Slider
                        value={[props.volume !== undefined ? props.volume : 1]}
                        min={0}
                        max={1}
                        step={0.05}
                        onValueChange={([val]) => onUpdate({ volume: val })}
                    />
                </div>
            </div>
        </div>
    )
}
