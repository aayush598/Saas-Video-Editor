import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

export function ProblemStatementProperties({ component, onUpdate }) {
    const props = component.props

    const updateImgConfig = (which, key, val) => {
        const propName = which === 'top' ? 'imgTopConfig' : 'imgBottomConfig'
        onUpdate({
            [propName]: { ...props[propName], [key]: parseFloat(val) }
        })
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label className="text-sm font-semibold">Text Content</Label>
                <div className="grid gap-2">
                    <div>
                        <Label className="text-xs">First Big Words</Label>
                        <Input
                            value={props.firstWords}
                            onChange={(e) => onUpdate({ firstWords: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label className="text-xs">Rest of Sentence</Label>
                        <Input
                            value={props.restOfSentence}
                            onChange={(e) => onUpdate({ restOfSentence: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <Separator />

            <div className="space-y-2">
                <Label className="text-sm font-semibold">Top Image Visual</Label>
                <Input
                    className="text-xs mb-2"
                    placeholder="Image URL"
                    value={props.imgTopSrc}
                    onChange={(e) => onUpdate({ imgTopSrc: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label className="text-xs">X Offset</Label>
                        <Input type="number" value={props.imgTopConfig?.x} onChange={(e) => updateImgConfig('top', 'x', e.target.value)} />
                    </div>
                    <div>
                        <Label className="text-xs">Y Offset</Label>
                        <Input type="number" value={props.imgTopConfig?.y} onChange={(e) => updateImgConfig('top', 'y', e.target.value)} />
                    </div>
                    <div>
                        <Label className="text-xs">Rotate (deg)</Label>
                        <Input type="number" value={props.imgTopConfig?.rotate} onChange={(e) => updateImgConfig('top', 'rotate', e.target.value)} />
                    </div>
                    <div>
                        <Label className="text-xs">Blur (px)</Label>
                        <Input type="number" value={props.imgTopConfig?.blur} onChange={(e) => updateImgConfig('top', 'blur', e.target.value)} />
                    </div>
                </div>
            </div>

            <Separator />

            <div className="space-y-2">
                <Label className="text-sm font-semibold">Bottom Image Visual</Label>
                <Input
                    className="text-xs mb-2"
                    placeholder="Image URL"
                    value={props.imgBottomSrc}
                    onChange={(e) => onUpdate({ imgBottomSrc: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label className="text-xs">X Offset</Label>
                        <Input type="number" value={props.imgBottomConfig?.x} onChange={(e) => updateImgConfig('bottom', 'x', e.target.value)} />
                    </div>
                    <div>
                        <Label className="text-xs">Y Offset</Label>
                        <Input type="number" value={props.imgBottomConfig?.y} onChange={(e) => updateImgConfig('bottom', 'y', e.target.value)} />
                    </div>
                    <div>
                        <Label className="text-xs">Rotate (deg)</Label>
                        <Input type="number" value={props.imgBottomConfig?.rotate} onChange={(e) => updateImgConfig('bottom', 'rotate', e.target.value)} />
                    </div>
                    <div>
                        <Label className="text-xs">Blur (px)</Label>
                        <Input type="number" value={props.imgBottomConfig?.blur} onChange={(e) => updateImgConfig('bottom', 'blur', e.target.value)} />
                    </div>
                </div>
            </div>
        </div>
    )
}
