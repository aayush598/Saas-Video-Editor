import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function ZoomAreaProperties({ component, onUpdate }) {
    const props = component.props

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-sm">Zoom Level: {props.scale}x</Label>
                <Slider
                    value={[props.scale]}
                    onValueChange={([value]) => onUpdate({ scale: value })}
                    min={1}
                    max={5}
                    step={0.1}
                    className="mt-2"
                />
            </div>

            <div>
                <Label className="text-sm">Center X: {props.x}%</Label>
                <Slider
                    value={[props.x]}
                    onValueChange={([value]) => onUpdate({ x: value })}
                    min={0}
                    max={100}
                    step={1}
                    className="mt-2"
                />
            </div>

            <div>
                <Label className="text-sm">Center Y: {props.y}%</Label>
                <Slider
                    value={[props.y]}
                    onValueChange={([value]) => onUpdate({ y: value })}
                    min={0}
                    max={100}
                    step={1}
                    className="mt-2"
                />
            </div>

            <div>
                <Label className="text-sm">Easing</Label>
                <Select
                    value={props.ease || 'easeInOut'}
                    onValueChange={(value) => onUpdate({ ease: value })}
                >
                    <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select easing" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="linear">Linear</SelectItem>
                        <SelectItem value="easeIn">Ease In</SelectItem>
                        <SelectItem value="easeOut">Ease Out</SelectItem>
                        <SelectItem value="easeInOut">Ease In Out</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
