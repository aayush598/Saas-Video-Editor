import { motion } from 'framer-motion'

export function CalloutBubble({ component }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className={`absolute pointer-events-none ${component.props.position === 'top-right' ? 'top-20 right-20' :
                component.props.position === 'top-left' ? 'top-20 left-20' :
                    component.props.position === 'bottom-right' ? 'bottom-20 right-20' :
                        'bottom-20 left-20'
                }`}
        >
            <div
                className="px-6 py-3 rounded-full text-white font-semibold shadow-lg"
                style={{ backgroundColor: component.props.color }}
            >
                {component.props.text}
            </div>
        </motion.div>
    )
}
