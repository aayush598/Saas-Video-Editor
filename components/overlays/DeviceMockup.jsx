import { motion } from 'framer-motion'
import { Smartphone } from 'lucide-react'

export function DeviceMockup({ component }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute top-1/2 right-20 -translate-y-1/2 pointer-events-none"
        >
            <div className="bg-gray-900 rounded-3xl p-3 shadow-2xl" style={{ width: '200px' }}>
                <div className="bg-white rounded-2xl aspect-[9/19] flex items-center justify-center">
                    <Smartphone className="w-12 h-12 text-gray-300" />
                </div>
            </div>
        </motion.div>
    )
}
