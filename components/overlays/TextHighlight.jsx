import { motion } from 'framer-motion'

export function TextHighlight({ component }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 pointer-events-none"
        >
            <div className="relative inline-block">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 opacity-30 -z-10"
                    style={{ backgroundColor: component.props.highlightColor }}
                />
                <span className="text-4xl font-bold text-white px-4">
                    {component.props.text}
                </span>
            </div>
        </motion.div>
    )
}
