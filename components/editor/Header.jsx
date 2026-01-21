import { Button } from '@/components/ui/button'
import { Download, Video } from 'lucide-react'

export function Header({ handleExportClick, isExporting, videoUrl }) {
    return (
        <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Video className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">SaaS Video Editor</h1>
                    <p className="text-sm text-muted-foreground">Professional video editing for product launches</p>
                </div>
            </div>
            <Button
                onClick={handleExportClick}
                disabled={!videoUrl || isExporting}
                size="lg"
            >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export Video'}
            </Button>
        </header>
    )
}
