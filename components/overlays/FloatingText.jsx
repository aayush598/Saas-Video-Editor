import { motion } from 'framer-motion'

export function FloatingText({ component }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{
                opacity: 1,
                y: component.props.animation === 'float' ? [0, -20, 0] : 0
            }}
            exit={{ opacity: 0, y: -50 }}
            transition={{
                duration: component.props.duration || 2,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
            <div
                className="font-bold text-center drop-shadow-2xl"
                style={{
                    fontSize: `${component.props.fontSize}px`,
                    color: component.props.color,
                    textShadow: '0 0 20px rgba(0,0,0,0.5)'
                }}
            >
                {component.props.text}
            </div>
        </motion.div>
    )
}
