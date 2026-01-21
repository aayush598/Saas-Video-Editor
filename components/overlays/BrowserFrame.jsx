import { motion } from 'framer-motion'
import { Monitor } from 'lucide-react'

export function BrowserFrame({ component }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-1/4 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ width: `${component.props.width}px` }}
        >
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
                <div className="h-8 bg-gray-700 flex items-center px-3 gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 h-5 bg-gray-600 rounded text-xs flex items-center px-2 text-gray-300">
                        {component.props.url}
                    </div>
                </div>
                <div className="bg-white h-48 flex items-center justify-center text-gray-400">
                    <Monitor className="w-12 h-12" />
                </div>
            </div>
        </motion.div>
    )
}
