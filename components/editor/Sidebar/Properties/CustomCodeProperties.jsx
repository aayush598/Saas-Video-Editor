import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'

export function CustomCodeProperties({ component, onUpdate }) {
    const props = component.props

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label className="text-sm font-medium">HTML Structure</Label>
                <p className="text-xs text-muted-foreground mb-1">Enter raw HTML elements</p>
                <Textarea
                    className="font-mono text-xs min-h-[150px] bg-muted/50"
                    value={props.html}
                    onChange={(e) => onUpdate({ html: e.target.value })}
                    placeholder="<div class='my-box'>Content</div>"
                />
            </div>

            <div className="space-y-2">
                <Label className="text-sm font-medium">CSS Styling</Label>
                <p className="text-xs text-muted-foreground mb-1">Standard CSS syntax</p>
                <Textarea
                    className="font-mono text-xs min-h-[150px] bg-muted/50"
                    value={props.css}
                    onChange={(e) => onUpdate({ css: e.target.value })}
                    placeholder=".my-box { color: red; }"
                />
            </div>

            <div className="space-y-4 pt-4 border-t">
                <div>
                    <Label className="text-sm mb-2 block">Position Preset</Label>
                    <Select
                        value={props.position}
                        onValueChange={(value) => onUpdate({ position: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="top-left">Top Left</SelectItem>
                            <SelectItem value="top-right">Top Right</SelectItem>
                            <SelectItem value="bottom-left">Bottom Left</SelectItem>
                            <SelectItem value="bottom-right">Bottom Right</SelectItem>
                            <SelectItem value="custom">Custom Coordinates</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {props.position === 'custom' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs mb-1 block">X (%)</Label>
                            <div className="flex items-center gap-2">
                                <Slider
                                    value={[props.x]}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onValueChange={([val]) => onUpdate({ x: val })}
                                />
                                <span className="text-xs w-8 text-right">{props.x}%</span>
                            </div>
                        </div>
                        <div>
                            <Label className="text-xs mb-1 block">Y (%)</Label>
                            <div className="flex items-center gap-2">
                                <Slider
                                    value={[props.y]}
                                    min={0}
                                    max={100}
                                    step={1}
                                    onValueChange={([val]) => onUpdate({ y: val })}
                                />
                                <span className="text-xs w-8 text-right">{props.y}%</span>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <Label className="text-sm mb-2 block">Base Width (px)</Label>
                    <div className="flex items-center gap-2">
                        <Slider
                            value={[props.width]}
                            min={50}
                            max={1000}
                            step={10}
                            onValueChange={([val]) => onUpdate({ width: val })}
                            className="flex-1"
                        />
                        <Input
                            type="number"
                            className="w-20 h-8 font-mono text-xs"
                            value={props.width}
                            onChange={(e) => onUpdate({ width: parseInt(e.target.value) || 300 })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className="text-xs mb-2 block">Scale</Label>
                        <Slider
                            value={[props.scale]}
                            min={0.1}
                            max={3}
                            step={0.1}
                            onValueChange={([val]) => onUpdate({ scale: val })}
                        />
                    </div>
                    <div>
                        <Label className="text-xs mb-2 block">Opacity</Label>
                        <Slider
                            value={[props.opacity]}
                            min={0}
                            max={1}
                            step={0.05}
                            onValueChange={([val]) => onUpdate({ opacity: val })}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
