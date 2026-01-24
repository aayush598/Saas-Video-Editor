import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

export function PremiumCursorProperties({ component, onUpdate }) {
    const props = component.props

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
