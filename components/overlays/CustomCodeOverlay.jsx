import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

export function CustomCodeOverlay({ component }) {
    const containerRef = useRef(null)
    const styleRef = useRef(null)
    const { html, css, position, x, y, width, height, scale, opacity } = component.props

    // Unique ID for scoping CSS (partially)
    const uniqueId = `custom-component-${component.id}`

    // Inject CSS
    useEffect(() => {
        if (!styleRef.current) {
            styleRef.current = document.createElement('style')
            document.head.appendChild(styleRef.current)
        }

        // Scope CSS to this component ID to prevent global pollution
        // This is a basic scoping strategy: wrap user CSS with the container ID selector
        // Note: This requires users to write CSS that matches the structure, 
        // OR we can just inject it raw and let them handle it. 
        // Better UX: Inject raw but advise on scoping.
        // Even Better: auto-prefix selectors. implementing a full CSS parser is too much.
        // We will just inject raw CSS for maximum power, but wrapped in a @layer or just simple injection.

        // Let's try to prefix strictly: `#id selector`
        // We'll leave it raw for flexibility but user needs to be careful.
        // Actually, let's wrap it in a Shadow DOM? That would be safest style encapsulation.
        // But Frame Motion is outside. 
        // Let's stick to standard injection.

        styleRef.current.textContent = css

        return () => {
            if (styleRef.current) {
                // Don't remove style immediately on unmount if we want to preserve animations during exit?
                // Actually we should remove it to avoid clutter.
                styleRef.current.remove()
                styleRef.current = null
            }
        }
    }, [css, uniqueId])

    // Position styles
    const getPositionStyles = () => {
        const styles = {
            width: `${width}px`,
            height: 'auto', // Allow auto height
            opacity: opacity !== undefined ? opacity : 1,
            transform: `scale(${scale || 1})`
        }

        switch (position) {
            case 'top-left':
                return { ...styles, top: 40, left: 40 }
            case 'top-right':
                return { ...styles, top: 40, right: 40 }
            case 'bottom-left':
                return { ...styles, bottom: 40, left: 40 }
            case 'bottom-right':
                return { ...styles, bottom: 40, right: 40 }
            case 'center':
                return { ...styles, top: '50%', left: '50%', x: '-50%', y: '-50%' } // Motion handles x/y
            case 'custom':
                return { ...styles, top: `${y}%`, left: `${x}%`, x: '-50%', y: '-50%' }
            default:
                return { ...styles, top: '50%', left: '50%', x: '-50%', y: '-50%' }
        }
    }

    // Motion props need to separate x/y from style if used in animate
    const initialStyles = getPositionStyles()
    const { x: motionX, y: motionY, ...cssStyles } = initialStyles

    return (
        <motion.div
            id={uniqueId}
            initial={{ opacity: 0, scale: 0.8, x: motionX, y: motionY }}
            animate={{ opacity: opacity, scale: scale, x: motionX, y: motionY }}
            exit={{ opacity: 0, scale: 0.8, x: motionX, y: motionY }}
            className={`absolute z-30 ${position === 'custom' ? '' : 'pointer-events-none'}`}
            style={cssStyles}
        >
            <div
                className="w-full h-full relative"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </motion.div>
    )
}
