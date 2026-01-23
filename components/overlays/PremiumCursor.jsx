import { useRef, useMemo } from 'react'
import { motion, useTransform, useMotionValue } from 'framer-motion'
import { MousePointer2, Hand, Move, crosshair, Target, User } from 'lucide-react'

// --- Cursor Icons ---
const MacCursor = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
        <path d="M5.5 3.5L19 16.5L12.5 17.5L17 26.5L14.5 27.5L10 18.5L5.5 23.5V3.5Z" fill="black" stroke="white" strokeWidth="1.5" />
    </svg>
)

const WinCursor = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
        <path d="M5.65376 3.09033L17.5126 14.8087L11.5367 15.6888L15.6989 24.3806L13.3932 25.3806L9.23101 16.6888L5.65376 21.0903V3.09033Z" fill="white" stroke="black" strokeWidth="1.5" />
    </svg>
)

const NeonCursor = ({ color = "#00ff9d" }) => (
    <div className="relative">
        <div className="absolute inset-0 blur-sm" style={{ backgroundColor: color }} />
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="relative z-10">
            <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill={color} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </div>
)

const CircleFocus = ({ color = "#3b82f6" }) => (
    <div className="relative flex items-center justify-center w-16 h-16">
        <div className="absolute inset-0 rounded-full opacity-30 animate-pulse" style={{ backgroundColor: color }} />
        <div className="w-4 h-4 rounded-full border-2 border-white shadow-lg" style={{ backgroundColor: color }} />
    </div>
)

const CustomAvatar = ({ src }) => (
    <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-white shadow-2xl overflow-hidden bg-gray-200">
            {src ? (
                <img src={src} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600">
                    <User className="w-6 h-6 text-white" />
                </div>
            )}
        </div>
        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 border border-white">
            <MousePointer2 className="w-3 h-3 text-white" />
        </div>
    </div>
)

// --- Main Component ---
export function PremiumCursor({ component, currentTime }) {
    const {
        cursorType = 'macos',
        startPos = { x: 10, y: 10 },
        endPos = { x: 50, y: 50 },
        showPath = true,
        pathType = 'curved', // linear, curved
        pathColor = '#3b82f6',
        clickEffect = true,
        rippleColor = 'rgba(59, 130, 246, 0.5)',
        zoomOnAction = false,
        size = 'medium',
        customImage = null,
        easing = 'easeInOut'
    } = component.props || {}

    // Calculate progress (0 to 1)
    const duration = component.endTime - component.startTime
    const progress = Math.min(Math.max((currentTime - component.startTime) / duration, 0), 1)

    // Scale Logic
    const scaleMap = { small: 0.8, medium: 1, large: 1.5, xlarge: 2 }
    const scale = scaleMap[size] || 1

    // Easing Functions
    const ease = (t) => {
        switch (easing) {
            case 'linear': return t
            case 'easeIn': return t * t
            case 'easeOut': return t * (2 - t)
            case 'easeInOut': return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
            default: return t
        }
    }
    const easedProgress = ease(progress)

    // Position Interpolation
    const currentX = startPos.x + (endPos.x - startPos.x) * easedProgress
    const currentY = startPos.y + (endPos.y - startPos.y) * easedProgress

    // Path Logic (SVG curve)
    // A simple quadratic bezier curve for 'curved', or straight line for 'linear'
    const controlPointX = pathType === 'curved' ? startPos.x + (endPos.x - startPos.x) / 2 : (startPos.x + endPos.x) / 2
    const controlPointY = pathType === 'curved' ? startPos.y : (startPos.y + endPos.y) / 2 - 20 // add some arc?

    const pathD = pathType === 'curved'
        ? `M ${startPos.x} ${startPos.y} Q ${startPos.x} ${endPos.y}, ${endPos.x} ${endPos.y}` // Simple curve
        : `M ${startPos.x} ${startPos.y} L ${endPos.x} ${endPos.y}`

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">

            {/* 1. Zoom Spotlight Effect (Optional) */}
            {zoomOnAction && progress > 0.8 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/40 z-0 transition-opacity duration-300"
                    style={{
                        maskImage: `radial-gradient(circle at ${currentX}% ${currentY}%, transparent 100px, black 160px)`
                    }}
                />
            )}

            {/* 2. Cursor Path */}
            {showPath && (
                <svg className="absolute inset-0 w-full h-full z-0 overflow-visible">
                    <motion.path
                        d={pathD}
                        fill="none"
                        stroke={pathColor}
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: progress, opacity: 0.6 }}
                        // Keep visible based on progress
                        style={{ vectorEffect: 'non-scaling-stroke' }}
                    // Note: percentage coordinates in SVG are tricky, simpler to assume this SVG scales
                    // But for accurate % rendering in SVG, we normally use 0-100 coordinates with viewBox="0 0 100 100" preserveAspectRatio="none"
                    />
                    {/* Re-rendering path with correct viewBox for percentage coordinates */}
                    <path
                        d={pathType === 'curved'
                            ? `M ${startPos.x} ${startPos.y} Q ${startPos.x} ${endPos.y} ${endPos.x} ${endPos.y}`
                            : `M ${startPos.x} ${startPos.y} L ${endPos.x} ${endPos.y}`
                        }
                        fill="none"
                        stroke={pathColor}
                        strokeWidth="0.2" // thinner stroke relative to 100x100 viewbox
                        strokeDasharray="1 1"
                        strokeOpacity={0.4}
                        transform="scale(1, 1)"
                    />
                </svg>
            )}

            {/* Path SVG Fixed for Percentages */}
            {showPath && (
                <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <motion.path
                        d={pathType === 'curved'
                            ? `M ${startPos.x} ${startPos.y} Q ${Math.min(startPos.x, endPos.x) + Math.abs(endPos.x - startPos.x) * 0.2} ${Math.max(startPos.y, endPos.y)} ${endPos.x} ${endPos.y}`
                            : `M ${startPos.x} ${startPos.y} L ${endPos.x} ${endPos.y}`
                        }
                        fill="none"
                        stroke={pathColor}
                        strokeWidth="0.3"
                        strokeDasharray="1 1"
                        strokeOpacity={0.6 * progress} // Fade in trail
                    />
                </svg>
            )}


            {/* 3. Ripple Effect at destination or during click */}
            {clickEffect && progress >= 0.95 && (
                <div
                    className="absolute z-10"
                    style={{
                        left: `${endPos.x}%`,
                        top: `${endPos.y}%`,
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <motion.div
                        initial={{ width: 0, height: 0, opacity: 0.8 }}
                        animate={{ width: 100, height: 100, opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="rounded-full border-2"
                        style={{ borderColor: rippleColor }}
                    />
                    <motion.div
                        initial={{ width: 0, height: 0, opacity: 0.6 }}
                        animate={{ width: 60, height: 60, opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
                        style={{ backgroundColor: rippleColor }}
                    />
                </div>
            )}

            {/* 4. The Cursor Itself */}
            <div
                className="absolute z-20 flex flex-col items-start"
                style={{
                    left: `${currentX}%`,
                    top: `${currentY}%`,
                    transform: `scale(${scale}) translate(-10%, -10%)`, // Offset typical cursor hotspot
                }}
            >
                {/* Render selected cursor type */}
                {cursorType === 'macos' && <MacCursor />}
                {cursorType === 'windows' && <WinCursor />}
                {cursorType === 'neon' && <NeonCursor />}
                {cursorType === 'circle-focus' && <CircleFocus />}
                {cursorType === 'avatar' && <CustomAvatar src={customImage} />}

                {/* Click animation (scale down) */}
                {clickEffect && progress > 0.9 && (
                    <motion.div
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -inset-2 bg-white/30 rounded-full blur-md -z-10"
                    />
                )}
            </div>

        </div>
    )
}
