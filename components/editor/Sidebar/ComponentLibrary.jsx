import { Card } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { COMPONENT_LIBRARY } from '@/lib/constants/componentLibrary'

export function ComponentLibrary({ addComponentToTimeline }) {
    return (
        <aside className="w-80 border-r bg-card flex flex-col">
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold mb-1">Component Library</h2>
                <p className="text-sm text-muted-foreground">Click to add effects to timeline</p>
            </div>
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                    {COMPONENT_LIBRARY.map((component) => {
                        const Icon = component.icon
                        return (
                            <Card
                                key={component.id}
                                className="p-4 cursor-pointer hover:border-primary transition-all hover:shadow-md"
                                onClick={() => addComponentToTimeline(component.id)}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm mb-1">{component.name}</h3>
                                        <p className="text-xs text-muted-foreground">{component.description}</p>
                                    </div>
                                    <Plus className="w-4 h-4 text-muted-foreground" />
                                </div>
                            </Card>
                        )
                    })}
                </div>
            </ScrollArea>
        </aside>
    )
}
