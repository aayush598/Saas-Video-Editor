import { useState, useRef, useEffect } from 'react'
import { Trash2 } from 'lucide-react'

export function VideoClip({ clip, projectDuration, zoom, onMove, onResize, onDelete, isSelected, onSelect }) {
    const [isDragging, setIsDragging] = useState(false)
    const [isResizing, setIsResizing] = useState(null)
    const [dragStart, setDragStart] = useState(null)
    const clipRef = useRef(null)

    const duration = clip.end - clip.start
    const leftPercent = (clip.start / projectDuration) * 100
    const widthPercent = (duration / projectDuration) * 100

    const handleMouseDown = (e, type) => {
        e.stopPropagation()
        onSelect(e.shiftKey || e.ctrlKey || e.metaKey)

        if (type === 'move') {
            setIsDragging(true)
            setDragStart({ x: e.clientX, start: clip.start })
        } else {
            setIsResizing(type)
            setDragStart({ x: e.clientX, value: type === 'left' ? clip.start : clip.end })
        }
    }

    useEffect(() => {
        if (!isDragging && !isResizing) return

        const handleMouseMove = (e) => {
            if (!clipRef.current || !dragStart) return

            const parent = clipRef.current.parentElement
            if (!parent) return

            const parentWidth = parent.offsetWidth
            const deltaX = e.clientX - dragStart.x
            const deltaTime = (deltaX / parentWidth) * projectDuration

            if (isDragging) {
                const newStart = Math.max(0, dragStart.start + deltaTime)
                onMove(clip.id, newStart)
            } else if (isResizing) {
                const newValue = dragStart.value + deltaTime
                onResize(clip.id, isResizing, newValue)
            }
        }

        const handleMouseUp = () => {
            setIsDragging(false)
            setIsResizing(null)
            setDragStart(null)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging, isResizing, dragStart, clip, projectDuration, zoom, onMove, onResize])

    return (
        <div
            ref={clipRef}
            className={`absolute rounded-md overflow-hidden border-2 transition-all ${isSelected
                ? 'border-yellow-400 ring-2 ring-yellow-400/50 bg-blue-600 shadow-xl z-20'
                : 'border-blue-400/50 bg-blue-600/80 hover:bg-blue-600 z-10'
                } ${isDragging || isResizing ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
                left: `${leftPercent}%`,
                width: `${widthPercent}%`,
                top: `${(clip.row || 0) * 45}px`,
                height: '40px'
            }}
            onMouseDown={(e) => handleMouseDown(e, 'move')}
        >
            <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
                <span className="text-xs text-white/90 font-medium truncate">{clip.name}</span>
                <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto"
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete(clip.id)
                    }}
                >
                    <Trash2 className="w-3 h-3 text-white" />
                </button>
            </div>

            {/* Left Resize Handle */}
            <div
                className="absolute left-0 top-0 bottom-0 w-2 bg-white/20 hover:bg-white/50 cursor-w-resize z-10 pointer-events-auto"
                onMouseDown={(e) => handleMouseDown(e, 'left')}
            />

            {/* Right Resize Handle */}
            <div
                className="absolute right-0 top-0 bottom-0 w-2 bg-white/20 hover:bg-white/50 cursor-e-resize z-10 pointer-events-auto"
                onMouseDown={(e) => handleMouseDown(e, 'right')}
            />
        </div>
    )
}
