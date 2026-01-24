import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'

export function BrowserFrameProperties({ component, onUpdate }) {
    const props = component.props

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
