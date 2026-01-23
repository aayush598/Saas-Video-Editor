import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Plus, Search } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { COMPONENT_LIBRARY } from '@/lib/constants/componentLibrary'

export function ComponentLibrary({ addComponentToTimeline }) {
    const [searchQuery, setSearchQuery] = useState('')

    const filteredComponents = COMPONENT_LIBRARY.filter(component =>
        component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <aside className="w-80 border-r bg-card flex flex-col">
            <div className="p-4 border-b space-y-4">
                <div>
                    <h2 className="text-lg font-semibold mb-1">Component Library</h2>
                    <p className="text-sm text-muted-foreground">Click to add effects to timeline</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search components..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                    {filteredComponents.length > 0 ? (
                        filteredComponents.map((component) => {
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
                        })
                    ) : (
                        <div className="text-center text-sm text-muted-foreground py-8">
                            No components found matching "{searchQuery}"
                        </div>
                    )}
                </div>
            </ScrollArea>
        </aside>
    )
}
