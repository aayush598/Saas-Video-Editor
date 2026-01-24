import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'

export function AudioProperties({ component, onUpdate }) {
    const props = component.props

    const handleAudioUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            const url = URL.createObjectURL(file)
            onUpdate({ audioSrc: url, fileName: file.name })
        }
    }

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-sm">Audio File</Label>
                <div className="space-y-2 mt-2">
                    {props.fileName && (
                        <div className="text-xs text-muted-foreground break-all p-2 bg-muted rounded border">
                            {props.fileName}
                        </div>
                    )}
                    <Input
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioUpload}
                        className="cursor-pointer"
                    />
                </div>
            </div>
            <div>
                <Label className="text-sm">Volume: {props.volume}%</Label>
                <Slider
                    value={[props.volume]}
                    onValueChange={([val]) => onUpdate({ volume: val })}
                    min={0}
                    max={100}
                    step={1}
                />
            </div>
            <div className="flex items-center justify-between">
                <Label className="text-sm">Loop</Label>
                <Switch
                    checked={props.loop}
                    onCheckedChange={(val) => onUpdate({ loop: val })}
                />
            </div>
        </div>
    )
}
