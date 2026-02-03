import { useState, useRef, useEffect } from 'react'
import { Trash2 } from 'lucide-react'

export function TimelineComponent({ component, projectDuration, zoom, onSelect, onRemove, isSelected, onUpdate }) {
    const [isDragging, setIsDragging] = useState(false)
    const [isResizing, setIsResizing] = useState(null)
    const [dragStart, setDragStart] = useState(null)
    const componentRef = useRef(null)

    const duration = component.endTime - component.startTime
    const leftPercent = (component.startTime / projectDuration) * 100
    const widthPercent = (duration / projectDuration) * 100

    const handleMouseDown = (e, type) => {
        e.stopPropagation()
        onSelect(e.shiftKey || e.ctrlKey || e.metaKey)

        if (type === 'move') {
            setIsDragging(true)
            setDragStart({ x: e.clientX, start: component.startTime })
        } else {
            setIsResizing(type)
            setDragStart({ x: e.clientX, value: type === 'left' ? component.startTime : component.endTime })
        }
    }

    useEffect(() => {
        if (!isDragging && !isResizing) return

        const handleMouseMove = (e) => {
            if (!componentRef.current || !dragStart) return

            const parent = componentRef.current.parentElement
            if (!parent) return

            const parentWidth = parent.offsetWidth
            const deltaX = e.clientX - dragStart.x
            const deltaTime = (deltaX / parentWidth) * projectDuration

            if (isDragging) {
                const newStart = Math.max(0, dragStart.start + deltaTime)
                // Maintain duration
                const newEnd = newStart + duration
                if (newEnd <= projectDuration) {
                    onUpdate(component.id, newStart, newEnd)
                }
            } else if (isResizing) {
                if (isResizing === 'left') {
                    const newStart = Math.min(Math.max(0, dragStart.value + deltaTime), component.endTime - 0.1)
                    onUpdate(component.id, newStart, component.endTime)
                } else {
                    const newEnd = Math.min(Math.max(component.startTime + 0.1, dragStart.value + deltaTime), projectDuration)
                    onUpdate(component.id, component.startTime, newEnd)
                }
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
    }, [isDragging, isResizing, dragStart, component, projectDuration, zoom, onUpdate, duration])

    return (
        <div
            ref={componentRef}
            className={`absolute h-8 rounded cursor-pointer transition-all group border-2 ${isSelected
                ? 'border-yellow-400 ring-2 ring-yellow-400/50 bg-primary shadow-xl z-20'
                : 'border-transparent bg-primary/70 hover:bg-primary z-10'
                } ${isDragging || isResizing ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
                left: `${leftPercent}%`,
                width: `${widthPercent}%`,
                top: component.row ? `${component.row * 36}px` : '0px'
            }}
            onMouseDown={(e) => handleMouseDown(e, 'move')}
        >
            <div className="h-full px-2 flex items-center justify-between text-xs text-white font-medium overflow-hidden">
                <span className="truncate">{component.name}</span>
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onRemove()
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Trash2 className="w-3 h-3" />
                </button>
            </div>

            {/* Left Resize Handle */}
            <div
                className="absolute left-0 top-0 bottom-0 w-2 hover:bg-white/20 cursor-w-resize z-10"
                onMouseDown={(e) => handleMouseDown(e, 'left')}
            />

            {/* Right Resize Handle */}
            <div
                className="absolute right-0 top-0 bottom-0 w-2 hover:bg-white/20 cursor-e-resize z-10"
                onMouseDown={(e) => handleMouseDown(e, 'right')}
            />
        </div>
    )
}
