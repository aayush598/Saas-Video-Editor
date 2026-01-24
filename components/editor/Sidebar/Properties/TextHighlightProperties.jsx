import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function TextHighlightProperties({ component, onUpdate }) {
    const props = component.props

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
