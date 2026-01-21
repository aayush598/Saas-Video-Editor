import { motion } from 'framer-motion'

export function TerminalOverlay({ component, progress }) {
    const displayedText = component.props.code.substring(
        0,
        Math.floor(progress * component.props.code.length)
    )

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ width: '600px' }}
        >
            <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl border border-gray-700">
                <div className="h-8 bg-gray-800 flex items-center px-3 gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-xs text-gray-400">Terminal</span>
                </div>
                <div className="p-4 font-mono text-sm text-green-400">
                    <span>$ </span>
                    <span>{displayedText}</span>
                    <span className="animate-pulse">_</span>
                </div>
            </div>
        </motion.div>
    )
}
