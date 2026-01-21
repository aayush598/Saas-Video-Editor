import { useState } from 'react'
import { toast } from 'sonner'

export function useExport(videoUrl, exportFileName) {
    const [isExporting, setIsExporting] = useState(false)
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)

    const handleExportClick = () => {
        // If we were using exportFileName in state passed here, we might reset it or something
        // But typically we just open dialog
        setIsExportDialogOpen(true)
    }

    const handleExportConfirm = async () => {
        setIsExportDialogOpen(false)

        let fileHandle = null
        try {
            if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
                fileHandle = await window.showSaveFilePicker({
                    suggestedName: `${exportFileName}.mp4`,
                    types: [{
                        description: 'MP4 Video',
                        accept: { 'video/mp4': ['.mp4'] },
                    }],
                })
            }
        } catch (err) {
            if (err.name === 'AbortError') return
            console.error('File picker error:', err)
        }

        setIsExporting(true)
        toast.info('Rendering video...')

        // Simulate rendering delay
        setTimeout(async () => {
            setIsExporting(false)

            try {
                if (fileHandle) {
                    const writable = await fileHandle.createWritable()
                    const response = await fetch(videoUrl)
                    const blob = await response.blob()
                    await writable.write(blob)
                    await writable.close()
                    toast.success('Video saved successfully!')
                } else {
                    // Fallback
                    const a = document.createElement('a')
                    a.href = videoUrl
                    a.download = `${exportFileName}.mp4`
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)

                    toast.success('Video saved successfully!')
                }
            } catch (error) {
                console.error('Export failed:', error)
                toast.error('Export failed')
            }
        }, 2000)
    }

    return {
        isExporting,
        setIsExporting,
        isExportDialogOpen,
        setIsExportDialogOpen,
        handleExportClick,
        handleExportConfirm
    }
}
