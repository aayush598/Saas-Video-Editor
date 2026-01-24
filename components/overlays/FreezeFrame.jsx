import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export function FreezeFrame({ component, currentTime }) {
    const {
        imageSrc,
        dimOpacity = 0.7,
        highlights = [],
        duration
    } = component.props || {}

    const containerRef = useRef(null)
    const [aspectRatio, setAspectRatio] = useState(16 / 9)

    useEffect(() => {
        const updateRatio = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect()
                if (height > 0) {
                    setAspectRatio(width / height)
                }
            }
        }

        updateRatio()
        window.addEventListener('resize', updateRatio) // Handle resize

        // Also simpler: ResizeObserver might be better but window resize is usually enough for editor
        return () => window.removeEventListener('resize', updateRatio)
    }, [])

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden">
            {/* 1. Underlying Frozen Frame Image */}
            {imageSrc && (
                <img
                    src={imageSrc}
                    alt="Frozen Frame"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            )}

            {/* 2. Dimmed Overlay with Cutouts (SVG Mask) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
                <defs>
                    <mask id={`mask-${component.id}`} maskContentUnits="objectBoundingBox">
                        {/* 1. Everything White (Opaque/Visible Dimmer) */}
                        <rect x="0" y="0" width="1" height="1" fill="white" />

                        {/* 2. Highlights Black (Transparent/Invisible Dimmer -> Clear Hole) */}
                        {highlights.map((h) => {
                            // Check timing for animation state
                            const start = parseFloat(h.startTime) || 0
                            const hDuration = parseFloat(h.duration)
                            const end = !isNaN(hDuration) ? start + hDuration : duration

                            const relativeTime = currentTime - component.startTime
                            const isActive = relativeTime >= start && relativeTime < end

                            // Calculate symmetric radius based on Width %
                            const radiusRaw = parseFloat(h.borderRadius) || 0
                            const rx = radiusRaw / 100
                            const ry = rx * aspectRatio

                            return (
                                <motion.rect
                                    key={h.id}
                                    x={(parseFloat(h.x) || 0) / 100}
                                    y={(parseFloat(h.y) || 0) / 100}
                                    width={(parseFloat(h.width) || 0) / 100}
                                    height={(parseFloat(h.height) || 0) / 100}
                                    rx={rx}
                                    ry={ry}
                                    fill="black"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: isActive ? 1 : 0 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                />
                            )
                        })}
                    </mask>
                </defs>

                {/* The Dimming Layer */}
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill={`rgba(0,0,0,${dimOpacity})`}
                    mask={`url(#mask-${component.id})`}
                    className="transition-opacity duration-300"
                />
            </svg>
        </div>
    )
}
