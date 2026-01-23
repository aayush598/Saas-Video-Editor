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
    )
}
