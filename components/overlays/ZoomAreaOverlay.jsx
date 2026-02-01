import { motion } from 'framer-motion'

export function ZoomAreaOverlay({ component, isPlaying }) {
    // If playing, we might not want to show the overlay box, 
    // unless we want a visual indicator (like a viewfinder). 
    // For now, let's hide it during playback so it looks like a real camera zoom.
    if (isPlaying) return null

    const { x, y, scale } = component.props

    // Calculate the dimensions of the "viewfinder" box
    // If scale is 2, box should be 50% width/height of container
    const width = 100 / scale
    const height = 100 / scale

    // x and y are the center percentages (0-100)
    // We need to position top-left
    const left = x - (width / 2)
    const top = y - (height / 2)

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* The Safe Area / Viewfinder */}
            <motion.div
                className="absolute border-2 border-primary bg-primary/20 backdrop-blur-[1px]"
                style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    width: `${width}%`,
                    height: `${height}%`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="absolute top-2 left-2 text-[10px] sm:text-xs font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded shadow-sm">
                    ZOOM TARGET
                </div>
            </motion.div>

            {/* Optional: Crosshair at internal center */}
            <div
                className="absolute w-4 h-4 text-primary"
                style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </div>
        </div>
    )
}
