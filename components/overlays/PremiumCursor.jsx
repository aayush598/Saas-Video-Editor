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

    // --- Path Logic ---
    const getPathData = () => {
        const dx = endPos.x - startPos.x
        const dy = endPos.y - startPos.y

        if (pathType === 'linear') {
            return `M ${startPos.x} ${startPos.y} L ${endPos.x} ${endPos.y}`
        }

        if (pathType === 'natural-arc') {
            // A subtle, natural looking arc (hand movement usually arcs slightly)
            // Control point: perpendicular to midpoint
            const midX = (startPos.x + endPos.x) / 2
            const midY = (startPos.y + endPos.y) / 2
            // Offset control point to create arc. Direction depends on movement.
            // Simple heuristic: arc upwards if moving roughly horizontal, sidewards if vertical
            const isHorizontal = Math.abs(dx) > Math.abs(dy)
            const controlX = midX + (isHorizontal ? 0 : dx * 0.2)
            const controlY = midY - (isHorizontal ? Math.abs(dx) * 0.2 : 0)

            return `M ${startPos.x} ${startPos.y} Q ${controlX} ${controlY} ${endPos.x} ${endPos.y}`
        }

        if (pathType === 's-curve') {
            // Beautiful S-curve for long diagonal movements
            const c1x = startPos.x + dx * 0.5
            const c1y = startPos.y
            const c2x = startPos.x + dx * 0.5
            const c2y = endPos.y
            return `M ${startPos.x} ${startPos.y} C ${c1x} ${c1y} ${c2x} ${c2y} ${endPos.x} ${endPos.y}`
        }

        // Default 'curved' (legacy support)
        return `M ${startPos.x} ${startPos.y} Q ${startPos.x} ${endPos.y} ${endPos.x} ${endPos.y}`
    }

    const pathD = getPathData()

    // Position Calculation based on Path
    // For true path following, we calculate the point on the specific curve type at 'easedProgress'
    const getPositionOnPath = (t) => {
        const p0 = startPos
        const p3 = endPos

        if (pathType === 'linear') {
            return {
                x: p0.x + (p3.x - p0.x) * t,
                y: p0.y + (p3.y - p0.y) * t
            }
        }

        if (pathType === 'natural-arc' || pathType === 'curved') {
            // Quadratic Bezier interpolation
            // B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
            const dx = endPos.x - startPos.x
            const dy = endPos.y - startPos.y
            let p1 = { x: startPos.x, y: endPos.y } // Default curved control point

            if (pathType === 'natural-arc') {
                const midX = (startPos.x + endPos.x) / 2
                const midY = (startPos.y + endPos.y) / 2
                const isHorizontal = Math.abs(dx) > Math.abs(dy)
                p1 = {
                    x: midX + (isHorizontal ? 0 : dx * 0.2),
                    y: midY - (isHorizontal ? Math.abs(dx) * 0.2 : 0)
                }
            }

            return {
                x: Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + Math.pow(t, 2) * p3.x,
                y: Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + Math.pow(t, 2) * p3.y
            }
        }

        if (pathType === 's-curve') {
            // Cubic Bezier interpolation
            // B(t) = (1-t)^3*P0 + 3(1-t)^2*t*P1 + 3(1-t)t^2*P2 + t^3*P3
            const dx = endPos.x - startPos.x
            const p1 = { x: startPos.x + dx * 0.5, y: startPos.y }
            const p2 = { x: startPos.x + dx * 0.5, y: endPos.y }

            return {
                x: Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * p1.x + 3 * (1 - t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x,
                y: Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y
            }
        }

        return { x: 0, y: 0 }
    }

    const { x: currentX, y: currentY } = getPositionOnPath(easedProgress)

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">

            {/* 1. Zoom Spotlight Effect */}
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
                <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Path Trail */}
                    <motion.path
                        d={pathD}
                        fill="none"
                        stroke={pathColor}
                        strokeWidth="0.3"
                        strokeDasharray="1 1"
                        strokeOpacity={0.6 * progress}
                    />
                    {/* Preview ghost path usually visible in editing tools, maybe optional */}
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
