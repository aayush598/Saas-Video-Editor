export function Playhead({ currentTime, projectDuration, zoom }) {
    return (
        <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 pointer-events-none"
            style={{ left: `${(currentTime / projectDuration) * 100}%` }}
        >
            <div className="w-3 h-3 bg-red-500 rounded-full absolute -top-1.5 left-1/2 -translate-x-1/2" />
        </div>
    )
}
