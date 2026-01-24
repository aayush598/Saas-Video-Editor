import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function CalloutBubbleProperties({ component, onUpdate }) {
    const props = component.props

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
