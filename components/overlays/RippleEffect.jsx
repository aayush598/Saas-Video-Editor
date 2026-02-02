
import { motion } from 'framer-motion'

export function RippleEffect({ component }) {
    const { x, y, size, color } = component.props

    return (
        <div
            className="absolute pointer-events-none"
            style={{
                left: `${x}%`,
                top: `${y}%`,
                width: 0,
                height: 0,
                transform: 'translate(-50%, -50%)', // Center on x/y
                zIndex: 50 // Ensure it's on top
            }}
        >
            {/* Main Ripple */}
            <motion.div
                initial={{ width: 0, height: 0, opacity: 0.8 }}
                animate={{
                    width: size * 2.5,
                    height: size * 2.5,
                    opacity: 0
                }}
                transition={{
                    duration: component.props.duration || 0.6,
                    ease: "easeOut"
                }}
                style={{
                    border: `3px solid ${component.props.color}`,
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            />

            {/* Secondary Ripple */}
            <motion.div
                initial={{ width: 0, height: 0, opacity: 0.6 }}
                animate={{
                    width: size * 2,
                    height: size * 2,
                    opacity: 0
                }}
                transition={{
                    duration: (component.props.duration || 0.6) * 0.8,
                    delay: 0.1,
                    ease: "easeOut"
                }}
                style={{
                    border: `1.5px solid ${component.props.color}`,
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            />

            {/* Center Dot (Remains visible longer) */}
            <motion.div
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 0, opacity: 0 }}
                transition={{
                    duration: 0.3,
                    delay: (component.props.duration || 0.6) * 0.5
                }}
                style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: component.props.color,
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            />
        </div>
    )
}
