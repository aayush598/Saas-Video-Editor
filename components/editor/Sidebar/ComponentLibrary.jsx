import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Plus, Search, Code2, ChevronLeft, ChevronRight, Layers } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { COMPONENT_LIBRARY } from '@/lib/constants/componentLibrary'
import { CustomComponentManager } from './CustomComponentManager'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function ComponentLibrary({ addComponentToTimeline, customTemplates = [], customLibrary }) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    // Merge static and custom libraries
    const fullLibrary = [...COMPONENT_LIBRARY, ...customTemplates]

    const filteredComponents = fullLibrary.filter(component =>
        component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.description.toLowerCase().includes(searchQuery.toLowerCase())
    )


    return (
        <aside
            className={`${isCollapsed ? 'w-20' : 'w-80'} border-r bg-card flex flex-col transition-all duration-300 ease-in-out relative`}
        >
            <div className={`p-4 border-b space-y-4 ${isCollapsed ? 'px-2' : ''}`}>
                <div className="flex items-center justify-between">
                    {!isCollapsed && (
                        <div>
                            <h2 className="text-lg font-semibold mb-1">Library</h2>
                            <p className="text-xs text-muted-foreground">Add effects</p>
                        </div>
                    )}
                    {isCollapsed && (
                        <div className="w-full flex justify-center mb-2">
                            <Layers className="w-6 h-6 text-muted-foreground" />
                        </div>
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        className={isCollapsed ? "mx-auto h-8 w-8" : "h-8 w-8"}
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </Button>
                </div>

                {!isCollapsed && (
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            className="pl-8 h-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                )}
            </div>

            <ScrollArea className="flex-1 p-3">
                <div className="space-y-3">
                    {filteredComponents.length > 0 ? (
                        filteredComponents.map((component) => {
                            let Icon = component.icon
                            if (!Icon && component.iconName === 'code') {
                                Icon = Code2
                            }

                            if (isCollapsed) {
                                return (
                                    <TooltipProvider key={component.id} delayDuration={0}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div
                                                    className="w-10 h-10 mx-auto bg-primary/10 rounded-lg flex items-center justify-center cursor-pointer hover:bg-primary/20 hover:shadow-md transition-all text-primary"
                                                    onClick={() => addComponentToTimeline(component)}
                                                >
                                                    {Icon ? <Icon className="w-5 h-5" /> : <div className="w-5 h-5 bg-primary/20 rounded-full" />}
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent side="right">
                                                <p className="font-semibold">{component.name}</p>
                                                <p className="text-xs">{component.description}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )
                            }

                            return (
                                <Card
                                    key={component.id}
                                    className="p-3 cursor-pointer hover:border-primary transition-all hover:shadow-md group"
                                    onClick={() => addComponentToTimeline(component)}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                            {Icon ? <Icon className="w-5 h-5 text-primary" /> : <div className="w-5 h-5 bg-primary/20 rounded-full" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-sm mb-1 truncate">{component.name}</h3>
                                            <p className="text-xs text-muted-foreground line-clamp-2">{component.description}</p>
                                        </div>
                                        <Plus className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </Card>
                            )
                        })
                    ) : (
                        !isCollapsed && (
                            <div className="text-center text-sm text-muted-foreground py-8">
                                No components found
                            </div>
                        )
                    )}
                </div>
            </ScrollArea>
            {!isCollapsed && customLibrary && (
                <div className="p-4 border-t bg-muted/20">
                    <CustomComponentManager customLibrary={customLibrary} />
                </div>
            )}
        </aside>
    )
}
