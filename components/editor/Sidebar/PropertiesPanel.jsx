import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Settings, Trash2 } from 'lucide-react'

import { AudioProperties } from './Properties/AudioProperties'
import { FloatingTextProperties } from './Properties/FloatingTextProperties'
import { BrowserFrameProperties } from './Properties/BrowserFrameProperties'
import { CalloutBubbleProperties } from './Properties/CalloutBubbleProperties'
import { TerminalProperties } from './Properties/TerminalProperties'
import { TextHighlightProperties } from './Properties/TextHighlightProperties'
import { PremiumCursorProperties } from './Properties/PremiumCursorProperties'
import { ProblemStatementProperties } from './Properties/ProblemStatementProperties'
import { FreezeFrameProperties } from './Properties/FreezeFrameProperties'
import { ZoomAreaProperties } from './Properties/ZoomAreaProperties'
import { RippleEffectProperties } from './Properties/RippleEffectProperties'

function PropertiesEditor({ component, onUpdate }) {
    if (!component) return null

    switch (component.type) {
        case 'audio':
            return <AudioProperties component={component} onUpdate={onUpdate} />
        case 'zoom-area':
            return <ZoomAreaProperties component={component} onUpdate={onUpdate} />
        case 'ripple-effect':
            return <RippleEffectProperties component={component} onUpdate={onUpdate} />
        case 'floating-text':
            return <FloatingTextProperties component={component} onUpdate={onUpdate} />
        case 'browser-frame':
            return <BrowserFrameProperties component={component} onUpdate={onUpdate} />
        case 'callout-bubble':
            return <CalloutBubbleProperties component={component} onUpdate={onUpdate} />
        case 'terminal':
            return <TerminalProperties component={component} onUpdate={onUpdate} />
        case 'text-highlight':
            return <TextHighlightProperties component={component} onUpdate={onUpdate} />
        case 'premium-cursor':
            return <PremiumCursorProperties component={component} onUpdate={onUpdate} />
        case 'problem-statement':
            return <ProblemStatementProperties component={component} onUpdate={onUpdate} />
        case 'freeze-frame':
            return <FreezeFrameProperties component={component} onUpdate={onUpdate} />
        default:
            return <p className="text-sm text-muted-foreground">No properties available for this component type.</p>
    }
}

export function PropertiesPanel({
    selectedComponent,
    selectedClip,
    removeComponent,
    updateComponentProps,
    updateComponentTiming,
    projectDuration,
    videoClips
}) {
    if (!selectedComponent && !selectedClip) return null

    return (
        <aside className="w-80 border-l bg-card flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    <h2 className="text-lg font-semibold">Properties</h2>
                </div>
                {selectedComponent && (
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeComponent(selectedComponent.id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                )}
            </div>
            <ScrollArea className="flex-1 p-4">
                {selectedComponent ? (
                    <div className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium mb-2 block">Component</Label>
                            <p className="text-sm text-muted-foreground">{selectedComponent.name}</p>
                        </div>

                        <Separator />

                        <div>
                            <Label className="text-sm font-medium mb-2 block">Timing</Label>
                            <div className="space-y-2">
                                <div>
                                    <Label className="text-xs">Start Time (seconds)</Label>
                                    <Input
                                        type="number"
                                        value={selectedComponent.startTime.toFixed(1)}
                                        onChange={(e) => updateComponentTiming(
                                            selectedComponent.id,
                                            parseFloat(e.target.value),
                                            selectedComponent.endTime
                                        )}
                                        min={0}
                                        step={0.1}
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">End Time (seconds)</Label>
                                    <Input
                                        type="number"
                                        value={selectedComponent.endTime.toFixed(1)}
                                        onChange={(e) => updateComponentTiming(
                                            selectedComponent.id,
                                            selectedComponent.startTime,
                                            parseFloat(e.target.value)
                                        )}
                                        min={selectedComponent.startTime}
                                        step={0.1}
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <PropertiesEditor
                            component={selectedComponent}
                            onUpdate={(newProps) => updateComponentProps(selectedComponent.id, newProps)}
                        />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium mb-2 block">Video Clip</Label>
                            <p className="text-sm text-muted-foreground">
                                {videoClips.find(c => c.id === selectedClip)?.name}
                            </p>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">
                                Duration: {(videoClips.find(c => c.id === selectedClip)?.end -
                                    videoClips.find(c => c.id === selectedClip)?.start).toFixed(1)}s
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Position: {videoClips.find(c => c.id === selectedClip)?.start.toFixed(1)}s
                            </p>
                        </div>
                    </div>
                )}
            </ScrollArea>
        </aside>
    )
}
