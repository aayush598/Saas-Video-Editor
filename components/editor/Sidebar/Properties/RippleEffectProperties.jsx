
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'

export function RippleEffectProperties({ component, onUpdate }) {
    const handleChange = (key, value) => {
        onUpdate({
            ...component.props,
            [key]: value
        })
    }

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-xs mb-2 block">Position X (%)</Label>
                <Slider
                    value={[component.props.x]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={([val]) => handleChange('x', val)}
                />
            </div>

            <div>
                <Label className="text-xs mb-2 block">Position Y (%)</Label>
                <Slider
                    value={[component.props.y]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={([val]) => handleChange('y', val)}
                />
            </div>

            <div>
                <Label className="text-xs mb-2 block">Size (px)</Label>
                <Input
                    type="number"
                    value={component.props.size}
                    onChange={(e) => handleChange('size', parseInt(e.target.value))}
                />
            </div>

            <div>
                <Label className="text-xs mb-2 block">Color</Label>
                <div className="flex gap-2">
                    <Input
                        type="color"
                        value={component.props.color}
                        onChange={(e) => handleChange('color', e.target.value)}
                        className="w-10 h-10 p-1"
                    />
                    <Input
                        type="text"
                        value={component.props.color}
                        onChange={(e) => handleChange('color', e.target.value)}
                        className="flex-1"
                    />
                </div>
            </div>
        </div>
    )
}
