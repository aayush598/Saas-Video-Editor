import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function ExportDialog({
    isOpen,
    setIsOpen,
    exportFileName,
    setExportFileName,
    handleExportConfirm
}) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Export Video</DialogTitle>
                    <DialogDescription>
                        Choose a name for your video file.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="filename" className="text-right">
                            File Name
                        </Label>
                        <Input
                            id="filename"
                            value={exportFileName}
                            onChange={(e) => setExportFileName(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleExportConfirm}>
                        Export & Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
