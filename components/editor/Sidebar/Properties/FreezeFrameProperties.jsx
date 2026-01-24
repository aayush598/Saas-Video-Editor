import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export function FreezeFrameProperties({ component, onUpdate }) {
    const props = component.props

    const addHighlight = () => {
        const newHighlight = {
            id: crypto.randomUUID(),
            name: 'New Highlight',
            x: 30, y: 30, width: 20, height: 20,
            startTime: 0,
            duration: 2,
            color: '#3b82f6'
        }
        onUpdate({ highlights: [...(props.highlights || []), newHighlight] })
    }

    const updateHighlight = (id, field, value) => {
        const updated = (props.highlights || []).map(h =>
            h.id === id ? { ...h, [field]: value } : h
        )
        onUpdate({ highlights: updated })
    }

    const removeHighlight = (id) => {
        onUpdate({ highlights: (props.highlights || []).filter(h => h.id !== id) })
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label className="text-sm font-medium">Darken Background</Label>
                <div className="flex items-center gap-4">
                    <Slider
                        value={[props.dimOpacity || 0.7]}
                        onValueChange={([val]) => onUpdate({ dimOpacity: val })}
                        min={0}
                        max={1}
                        step={0.1}
                        className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground w-8">
                        {(props.dimOpacity || 0.7).toFixed(1)}
                    </span>
                </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Highlights</Label>
                <Button variant="outline" size="sm" onClick={addHighlight} className="h-8 text-xs">
                    + Add Area
                </Button>
            </div>

            <div className="space-y-3">
                {(props.highlights || []).length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">
                        No active highlights. Add one to focus on a specific area.
                    </p>
                )}
                {(props.highlights || []).map((h, index) => (
                    <div key={h.id} className="border rounded-lg bg-card/50 p-3 space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                                {index + 1}
                            </div>
                            <Input
                                value={h.name}
                                onChange={(e) => updateHighlight(h.id, 'name', e.target.value)}
                                className="h-7 text-xs"
                                placeholder="Label..."
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                onClick={() => removeHighlight(h.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label className="text-[10px] text-muted-foreground mb-1 block">Start (sec)</Label>
                                <Input
                                    type="number"
                                    value={h.startTime}
                                    onChange={(e) => updateHighlight(h.id, 'startTime', e.target.value)}
                                    className="h-7 text-xs"
                                    step={0.1}
                                />
                            </div>
                            <div>
                                <Label className="text-[10px] text-muted-foreground mb-1 block">Duration</Label>
                                <Input
                                    type="number"
                                    value={h.duration}
                                    onChange={(e) => updateHighlight(h.id, 'duration', e.target.value)}
                                    className="h-7 text-xs"
                                    step={0.1}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-1">
                            <div>
                                <Label className="text-[10px] text-muted-foreground">X %</Label>
                                <Input
                                    type="number" value={h.x}
                                    onChange={(e) => updateHighlight(h.id, 'x', e.target.value)}
                                    className="h-6 text-[10px] px-1"
                                />
                            </div>
                            <div>
                                <Label className="text-[10px] text-muted-foreground">Y %</Label>
                                <Input
                                    type="number" value={h.y}
                                    onChange={(e) => updateHighlight(h.id, 'y', e.target.value)}
                                    className="h-6 text-[10px] px-1"
                                />
                            </div>
                            <div>
                                <Label className="text-[10px] text-muted-foreground">W %</Label>
                                <Input
                                    type="number" value={h.width}
                                    onChange={(e) => updateHighlight(h.id, 'width', e.target.value)}
                                    className="h-6 text-[10px] px-1"
                                />
                            </div>
                            <div>
                                <Label className="text-[10px] text-muted-foreground">H %</Label>
                                <Input
                                    type="number" value={h.height}
                                    onChange={(e) => updateHighlight(h.id, 'height', e.target.value)}
                                    className="h-6 text-[10px] px-1"
                                />
                            </div>
                            <div>
                                <Label className="text-[10px] text-muted-foreground">Radius %</Label>
                                <Input
                                    type="number" value={h.borderRadius}
                                    onChange={(e) => updateHighlight(h.id, 'borderRadius', e.target.value)}
                                    className="h-6 text-[10px] px-1"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
