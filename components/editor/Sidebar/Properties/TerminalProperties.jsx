import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'

export function TerminalProperties({ component, onUpdate }) {
    const props = component.props

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
