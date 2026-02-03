import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Trash2, Download, Upload, Plus, Code2, Pencil } from 'lucide-react'

export function CustomComponentManager({ customLibrary }) {
    const { customTemplates, createTemplate, removeTemplate, exportTemplate, importTemplate, updateTemplate } = customLibrary
    const [isOpen, setIsOpen] = useState(false)
    const [mode, setMode] = useState('list') // 'list', 'create'
    const [editingId, setEditingId] = useState(null)
    const [newComponent, setNewComponent] = useState({ name: '', description: '', html: '', css: '' })
    const fileInputRef = useRef(null)

    const handleSave = async () => {
        if (!newComponent.name) return

        if (editingId) {
            await updateTemplate(editingId, newComponent)
        } else {
            await createTemplate(newComponent)
        }

        setMode('list')
        setEditingId(null)
        setNewComponent({ name: '', description: '', html: '', css: '' })
    }

    const handleEdit = (template) => {
        setNewComponent({
            name: template.name,
            description: template.description || '',
            html: template.defaultProps?.html || '',
            css: template.defaultProps?.css || ''
        })
        setEditingId(template.id)
        setMode('create') // We re-use the create mode view which is really an editor view
    }

    const handleCancel = () => {
        setMode('list')
        setEditingId(null)
        setNewComponent({ name: '', description: '', html: '', css: '' })
    }

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0]
        if (file) {
            await importTemplate(file)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full gap-2 mt-2">
                    <Code2 className="w-4 h-4" />
                    Manage Custom Components
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Custom Component Library</DialogTitle>
                    <DialogDescription>
                        Create, manage, and share your custom HTML/CSS components.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden min-h-[400px] flex flex-col">
                    {mode === 'list' ? (
                        <>
                            <div className="flex gap-2 mb-4 justify-between">
                                <div className="flex gap-2">
                                    <Button onClick={() => { setEditingId(null); setMode('create'); }} className="gap-2">
                                        <Plus className="w-4 h-4" /> Create New
                                    </Button>
                                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
                                        <Upload className="w-4 h-4" /> Import JSON
                                    </Button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept=".json"
                                        onChange={handleFileUpload}
                                    />
                                </div>
                            </div>

                            <ScrollArea className="flex-1 border rounded-md p-2">
                                {customTemplates.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        No custom components yet. Create one or import!
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                        {customTemplates.map(template => (
                                            <div key={template.id} className="border p-3 rounded-lg flex flex-col justify-between bg-muted/20">
                                                <div>
                                                    <div className="font-semibold flex items-center gap-2">
                                                        <Code2 className="w-4 h-4 text-primary" />
                                                        {template.name}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{template.description}</p>
                                                </div>
                                                <div className="flex justify-end gap-1 mt-3">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7"
                                                        onClick={() => handleEdit(template)}
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7"
                                                        onClick={() => exportTemplate(template)}
                                                        title="Download JSON"
                                                    >
                                                        <Download className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-destructive hover:text-destructive"
                                                        onClick={() => removeTemplate(template.id)}
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </>
                    ) : (
                        <div className="flex gap-6 h-full overflow-hidden">
                            {/* Editor Column */}
                            <div className="w-1/2 flex flex-col gap-4 overflow-y-auto pr-2">
                                <div className="space-y-3">
                                    <div>
                                        <Label>Component Name</Label>
                                        <Input
                                            value={newComponent.name}
                                            onChange={e => setNewComponent({ ...newComponent, name: e.target.value })}
                                            placeholder="My Custom Badge"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label>Description</Label>
                                        <Input
                                            value={newComponent.description}
                                            onChange={e => setNewComponent({ ...newComponent, description: e.target.value })}
                                            placeholder="A reusable badge component"
                                            className="mt-1"
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col gap-2">
                                    <Label>HTML Structure</Label>
                                    <Textarea
                                        value={newComponent.html}
                                        onChange={e => setNewComponent({ ...newComponent, html: e.target.value })}
                                        className="font-mono text-xs flex-1 min-h-[150px] bg-muted/30"
                                        placeholder="<div class='my-component'>Hello World</div>"
                                    />
                                </div>

                                <div className="flex-1 flex flex-col gap-2">
                                    <Label>CSS Styling</Label>
                                    <Textarea
                                        value={newComponent.css}
                                        onChange={e => setNewComponent({ ...newComponent, css: e.target.value })}
                                        className="font-mono text-xs flex-1 min-h-[150px] bg-muted/30"
                                        placeholder=".my-component { color: red; font-size: 20px; }"
                                    />
                                </div>
                            </div>

                            {/* Preview Column */}
                            <div className="w-1/2 flex flex-col border-l pl-6">
                                <Label className="mb-2">Live Preview</Label>
                                <div className="flex-1 bg-black/50 border rounded-lg relative overflow-hidden flex items-center justify-center p-8 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px]">
                                    {/* Preview Container */}
                                    <div className="relative">
                                        <style>{newComponent.css}</style>
                                        <div dangerouslySetInnerHTML={{ __html: newComponent.html || '<div class="text-white/50 text-sm">Preview Area</div>' }} />
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    This visual preview helps you design. The component will separate styles automatically when used.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="mt-4">
                    {mode === 'create' && (
                        <>
                            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                            <Button onClick={handleSave}>{editingId ? 'Update Component' : 'Save Component'}</Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
