import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'

export function FloatingTextProperties({ component, onUpdate }) {
    const props = component.props

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
