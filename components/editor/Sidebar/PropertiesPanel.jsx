import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Settings, Trash2 } from 'lucide-react'

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

    if (component.type === 'premium-cursor') {
        const updateNestedProp = (key, subKey, value) => {
            onUpdate({
                [key]: {
                    ...props[key],
                    [subKey]: value
                }
            })
        }

        return (
            <div className="space-y-4">
                <div>
                    <Label className="text-sm">Cursor Type</Label>
                    <select
                        className="w-full h-10 px-3 rounded-md border bg-background"
                        value={props.cursorType}
                        onChange={(e) => onUpdate({ cursorType: e.target.value })}
                    >
                        <option value="macos">macOS</option>
                        <option value="windows">Windows</option>
                        <option value="neon">Neon</option>
                        <option value="circle-focus">Circle Focus</option>
                        <option value="avatar">Avatar</option>
                    </select>
                </div>

                {props.cursorType === 'avatar' && (
                    <div>
                        <Label className="text-sm">Avatar URL</Label>
                        <Input
                            value={props.customImage || ''}
                            onChange={(e) => onUpdate({ customImage: e.target.value })}
                            placeholder="https://example.com/me.jpg"
                        />
                    </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label className="text-xs">Start X (%)</Label>
                        <Input
                            type="number"
                            value={props.startPos?.x}
                            onChange={(e) => updateNestedProp('startPos', 'x', parseFloat(e.target.value))}
                        />
                    </div>
                    <div>
                        <Label className="text-xs">Start Y (%)</Label>
                        <Input
                            type="number"
                            value={props.startPos?.y}
                            onChange={(e) => updateNestedProp('startPos', 'y', parseFloat(e.target.value))}
                        />
                    </div>
                    <div>
                        <Label className="text-xs">End X (%)</Label>
                        <Input
                            type="number"
                            value={props.endPos?.x}
                            onChange={(e) => updateNestedProp('endPos', 'x', parseFloat(e.target.value))}
                        />
                    </div>
                    <div>
                        <Label className="text-xs">End Y (%)</Label>
                        <Input
                            type="number"
                            value={props.endPos?.y}
                            onChange={(e) => updateNestedProp('endPos', 'y', parseFloat(e.target.value))}
                        />
                    </div>
                </div>

                <div>
                    <Label className="text-sm">Motion Path</Label>
                    <div className="flex items-center gap-2 mt-2">
                        <Label className="text-xs">Show Path</Label>
                        <Switch
                            checked={props.showPath}
                            onCheckedChange={(val) => onUpdate({ showPath: val })}
                        />
                    </div>
                    {props.showPath && (
                        <div className="mt-2 space-y-2">
                            <select
                                className="w-full h-10 px-3 rounded-md border bg-background"
                                value={props.pathType}
                                onChange={(e) => onUpdate({ pathType: e.target.value })}
                            >
                                <option value="natural-arc">Natural Arc (Premium)</option>
                                <option value="s-curve">S-Curve (Cinematic)</option>
                                <option value="curved">Simple Curve</option>
                                <option value="linear">Straight Line</option>
                            </select>
                            <div className="flex items-center gap-2">
                                <Label className="text-xs">Color</Label>
                                <Input
                                    type="color"
                                    className="h-8 w-8 p-0 border-none"
                                    value={props.pathColor}
                                    onChange={(e) => onUpdate({ pathColor: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <Label className="text-sm">Effects</Label>
                    <div className="space-y-3 mt-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs">Click Ripple</Label>
                            <Switch
                                checked={props.clickEffect}
                                onCheckedChange={(val) => onUpdate({ clickEffect: val })}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label className="text-xs">Zoom Spotlight</Label>
                            <Switch
                                checked={props.zoomOnAction}
                                onCheckedChange={(val) => onUpdate({ zoomOnAction: val })}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <Label className="text-sm">Size</Label>
                    <select
                        className="w-full h-10 px-3 rounded-md border bg-background"
                        value={props.size}
                        onChange={(e) => onUpdate({ size: e.target.value })}
                    >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                        <option value="xlarge">Extra Large</option>
                    </select>
                </div>

                <div>
                    <Label className="text-sm">Easing</Label>
                    <select
                        className="w-full h-10 px-3 rounded-md border bg-background"
                        value={props.easing}
                        onChange={(e) => onUpdate({ easing: e.target.value })}
                    >
                        <option value="linear">Linear</option>
                        <option value="easeIn">Ease In</option>
                        <option value="easeOut">Ease Out</option>
                        <option value="easeInOut">Ease In Out</option>
                    </select>
                </div>
            </div>
        )
    }

    if (component.type === 'problem-statement') {
        const updateImgConfig = (which, key, val) => {
            const propName = which === 'top' ? 'imgTopConfig' : 'imgBottomConfig'
            onUpdate({
                [propName]: { ...props[propName], [key]: parseFloat(val) }
            })
        }

        return (
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label className="text-sm font-semibold">Text Content</Label>
                    <div className="grid gap-2">
                        <div>
                            <Label className="text-xs">First Big Words</Label>
                            <Input
                                value={props.firstWords}
                                onChange={(e) => onUpdate({ firstWords: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label className="text-xs">Rest of Sentence</Label>
                            <Input
                                value={props.restOfSentence}
                                onChange={(e) => onUpdate({ restOfSentence: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="space-y-2">
                    <Label className="text-sm font-semibold">Top Image Visual</Label>
                    <Input
                        className="text-xs mb-2"
                        placeholder="Image URL"
                        value={props.imgTopSrc}
                        onChange={(e) => onUpdate({ imgTopSrc: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Label className="text-xs">X Offset</Label>
                            <Input type="number" value={props.imgTopConfig?.x} onChange={(e) => updateImgConfig('top', 'x', e.target.value)} />
                        </div>
                        <div>
                            <Label className="text-xs">Y Offset</Label>
                            <Input type="number" value={props.imgTopConfig?.y} onChange={(e) => updateImgConfig('top', 'y', e.target.value)} />
                        </div>
                        <div>
                            <Label className="text-xs">Rotate (deg)</Label>
                            <Input type="number" value={props.imgTopConfig?.rotate} onChange={(e) => updateImgConfig('top', 'rotate', e.target.value)} />
                        </div>
                        <div>
                            <Label className="text-xs">Blur (px)</Label>
                            <Input type="number" value={props.imgTopConfig?.blur} onChange={(e) => updateImgConfig('top', 'blur', e.target.value)} />
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="space-y-2">
                    <Label className="text-sm font-semibold">Bottom Image Visual</Label>
                    <Input
                        className="text-xs mb-2"
                        placeholder="Image URL"
                        value={props.imgBottomSrc}
                        onChange={(e) => onUpdate({ imgBottomSrc: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Label className="text-xs">X Offset</Label>
                            <Input type="number" value={props.imgBottomConfig?.x} onChange={(e) => updateImgConfig('bottom', 'x', e.target.value)} />
                        </div>
                        <div>
                            <Label className="text-xs">Y Offset</Label>
                            <Input type="number" value={props.imgBottomConfig?.y} onChange={(e) => updateImgConfig('bottom', 'y', e.target.value)} />
                        </div>
                        <div>
                            <Label className="text-xs">Rotate (deg)</Label>
                            <Input type="number" value={props.imgBottomConfig?.rotate} onChange={(e) => updateImgConfig('bottom', 'rotate', e.target.value)} />
                        </div>
                        <div>
                            <Label className="text-xs">Blur (px)</Label>
                            <Input type="number" value={props.imgBottomConfig?.blur} onChange={(e) => updateImgConfig('bottom', 'blur', e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (component.type === 'freeze-frame') {
        const addHighlight = () => {
            const newHighlight = {
                id: crypto.randomUUID(),
                name: 'New Highlight',
                x: 30, y: 30, width: 20, height: 20,
                startTime: 0,
                duration: 2,
                color: '#3b82f6'
            }
            onUpdate({ highlights: [...(props.highlights || []), newHighlight] })
        }

        const updateHighlight = (id, field, value) => {
            const updated = (props.highlights || []).map(h =>
                h.id === id ? { ...h, [field]: value } : h
            )
            onUpdate({ highlights: updated })
        }

        const removeHighlight = (id) => {
            onUpdate({ highlights: (props.highlights || []).filter(h => h.id !== id) })
        }

        return (
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Darken Background</Label>
                    <div className="flex items-center gap-4">
                        <Slider
                            value={[props.dimOpacity || 0.7]}
                            onValueChange={([val]) => onUpdate({ dimOpacity: val })}
                            min={0}
                            max={1}
                            step={0.1}
                            className="flex-1"
                        />
                        <span className="text-xs text-muted-foreground w-8">
                            {(props.dimOpacity || 0.7).toFixed(1)}
                        </span>
                    </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">Highlights</Label>
                    <Button variant="outline" size="sm" onClick={addHighlight} className="h-8 text-xs">
                        + Add Area
                    </Button>
                </div>

                <div className="space-y-3">
                    {(props.highlights || []).length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-4">
                            No active highlights. Add one to focus on a specific area.
                        </p>
                    )}
                    {(props.highlights || []).map((h, index) => (
                        <div key={h.id} className="border rounded-lg bg-card/50 p-3 space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                                    {index + 1}
                                </div>
                                <Input
                                    value={h.name}
                                    onChange={(e) => updateHighlight(h.id, 'name', e.target.value)}
                                    className="h-7 text-xs"
                                    placeholder="Label..."
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                    onClick={() => removeHighlight(h.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label className="text-[10px] text-muted-foreground mb-1 block">Start (sec)</Label>
                                    <Input
                                        type="number"
                                        value={h.startTime}
                                        onChange={(e) => updateHighlight(h.id, 'startTime', e.target.value)}
                                        className="h-7 text-xs"
                                        step={0.1}
                                    />
                                </div>
                                <div>
                                    <Label className="text-[10px] text-muted-foreground mb-1 block">Duration</Label>
                                    <Input
                                        type="number"
                                        value={h.duration}
                                        onChange={(e) => updateHighlight(h.id, 'duration', e.target.value)}
                                        className="h-7 text-xs"
                                        step={0.1}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-1">
                                <div>
                                    <Label className="text-[10px] text-muted-foreground">X %</Label>
                                    <Input
                                        type="number" value={h.x}
                                        onChange={(e) => updateHighlight(h.id, 'x', e.target.value)}
                                        className="h-6 text-[10px] px-1"
                                    />
                                </div>
                                <div>
                                    <Label className="text-[10px] text-muted-foreground">Y %</Label>
                                    <Input
                                        type="number" value={h.y}
                                        onChange={(e) => updateHighlight(h.id, 'y', e.target.value)}
                                        className="h-6 text-[10px] px-1"
                                    />
                                </div>
                                <div>
                                    <Label className="text-[10px] text-muted-foreground">W %</Label>
                                    <Input
                                        type="number" value={h.width}
                                        onChange={(e) => updateHighlight(h.id, 'width', e.target.value)}
                                        className="h-6 text-[10px] px-1"
                                    />
                                </div>
                                <div>
                                    <Label className="text-[10px] text-muted-foreground">H %</Label>
                                    <Input
                                        type="number" value={h.height}
                                        onChange={(e) => updateHighlight(h.id, 'height', e.target.value)}
                                        className="h-6 text-[10px] px-1"
                                    />
                                </div>
                                <div>
                                    <Label className="text-[10px] text-muted-foreground">Radius %</Label>
                                    <Input
                                        type="number" value={h.borderRadius}
                                        onChange={(e) => updateHighlight(h.id, 'borderRadius', e.target.value)}
                                        className="h-6 text-[10px] px-1"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return <p className="text-sm text-muted-foreground">No properties available</p>
}

export function PropertiesPanel({
    selectedComponent,
    selectedClip,
    removeComponent,
    updateComponentProps,
    updateComponentTiming,
    projectDuration,
    videoClips
}) {
    if (!selectedComponent && !selectedClip) return null

    return (
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
    )
}
