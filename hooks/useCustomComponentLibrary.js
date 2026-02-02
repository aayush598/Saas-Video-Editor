import { useState, useEffect } from 'react'
import { loadTemplates, saveTemplate, deleteTemplate } from '@/lib/db'
import { customCodeConfig } from '@/lib/constants/library/customCodeConfig'
import { toast } from 'sonner'
import { Code2 } from 'lucide-react'

export function useCustomComponentLibrary() {
    const [customTemplates, setCustomTemplates] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchTemplates = async () => {
        try {
            const templates = await loadTemplates()
            setCustomTemplates(templates || [])
        } catch (e) {
            console.error("Failed to load custom templates", e)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchTemplates()
    }, [])

    const createTemplate = async (meta) => {
        const id = `custom-template-${Date.now()}`
        const newTemplate = {
            id,
            type: 'custom-code', // Underlying logic type
            name: meta.name || 'New Component',
            description: meta.description || 'Custom HTML/CSS Component',
            iconName: 'code', // Store string reference
            isCustom: true,
            defaultProps: {
                ...customCodeConfig.defaultProps,
                html: meta.html || customCodeConfig.defaultProps.html,
                css: meta.css || customCodeConfig.defaultProps.css,
            }
        }

        try {
            await saveTemplate(newTemplate)
            setCustomTemplates(prev => [...prev, newTemplate])
            toast.success("Component saved to library")
            return newTemplate
        } catch (e) {
            console.error("Failed to save template", e)
            toast.error("Failed to save component")
            return null
        }
    }

    const removeTemplate = async (id) => {
        try {
            await deleteTemplate(id)
            setCustomTemplates(prev => prev.filter(t => t.id !== id))
            toast.success("Component deleted")
        } catch (e) {
            toast.error("Failed to delete component")
        }
    }

    const exportTemplate = (template) => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(template, null, 2))
        const downloadAnchorNode = document.createElement('a')
        downloadAnchorNode.setAttribute("href", dataStr)
        downloadAnchorNode.setAttribute("download", `${template.name.replace(/\s+/g, '-').toLowerCase()}.json`)
        document.body.appendChild(downloadAnchorNode)
        downloadAnchorNode.click()
        downloadAnchorNode.remove()
    }

    const importTemplate = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = async (e) => {
                try {
                    const content = JSON.parse(e.target.result)
                    // Validate basic structure
                    if (!content.defaultProps || !content.defaultProps.html) {
                        toast.error("Invalid component file")
                        return
                    }

                    // Assign new ID to avoid collisions
                    const importedTemplate = {
                        ...content,
                        id: `imported-${Date.now()}`,
                        name: `${content.name} (Imported)`
                    }

                    await saveTemplate(importedTemplate)
                    setCustomTemplates(prev => [...prev, importedTemplate])
                    toast.success("Component imported successfully")
                    resolve(importedTemplate)
                } catch (err) {
                    toast.error("Failed to parse file")
                    reject(err)
                }
            }
            reader.readAsText(file)
        })
    }

    return {
        customTemplates,
        createTemplate,
        removeTemplate,
        exportTemplate,
        importTemplate,
        isLoading
    }
}
