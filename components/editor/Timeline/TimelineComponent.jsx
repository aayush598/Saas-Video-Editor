import { Trash2 } from 'lucide-react'

export function TimelineComponent({ component, projectDuration, zoom, onSelect, onRemove, isSelected }) {
    const leftPercent = (component.startTime / (projectDuration / zoom)) * 100
    const widthPercent = ((component.endTime - component.startTime) / (projectDuration / zoom)) * 100

    return (
        <div
            className={`absolute h-full rounded cursor-pointer transition-all group ${isSelected ? 'ring-2 ring-primary bg-primary' : 'bg-primary/70 hover:bg-primary'
                }`}
            style={{
                left: `${leftPercent}%`,
                width: `${widthPercent}%`,
            }}
            onClick={onSelect}
        >
            <div className="h-full px-2 flex items-center justify-between text-xs text-white font-medium">
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
        </div>
    )
}
