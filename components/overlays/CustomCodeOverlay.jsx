import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

export function CustomCodeOverlay({ component }) {
    const containerRef = useRef(null)
    const styleRef = useRef(null)
    const { html, css, position, x, y, width, height, scale, opacity } = component.props || {}

    // Unique ID for scoping CSS (partially)
    const uniqueId = `custom-component-${component.id}`

    // Inject CSS
    useEffect(() => {
        if (!styleRef.current) {
            styleRef.current = document.createElement('style')
            document.head.appendChild(styleRef.current)
        }

        styleRef.current.textContent = css

        return () => {
            if (styleRef.current) {
                styleRef.current.remove()
                styleRef.current = null
            }
        }
    }, [css, uniqueId])

    // Position styles
    const getPositionStyles = () => {
        const styles = {
            width: width ? `${width}px` : 'auto',
            height: 'auto',
            // Opacity is handled by animate prop
        }

        switch (position) {
            case 'top-left':
                return { ...styles, top: '10%', left: '10%' }
            case 'top-right':
                return { ...styles, top: '10%', right: '10%' }
            case 'bottom-left':
                return { ...styles, bottom: '10%', left: '10%' }
            case 'bottom-right':
                return { ...styles, bottom: '10%', right: '10%' }
            case 'center':
                return { ...styles, top: '50%', left: '50%', x: '-50%', y: '-50%' }
            case 'custom':
                return { ...styles, top: `${y || 50}%`, left: `${x || 50}%`, x: '-50%', y: '-50%' }
            default:
                return { ...styles, top: '50%', left: '50%', x: '-50%', y: '-50%' }
        }
    }

    // Motion props need to separate x/y from style if used in animate
    const initialStyles = getPositionStyles()
    const { x: motionX, y: motionY, ...cssStyles } = initialStyles

    // Ensure numeric values and defaults
    const safeScale = (scale !== undefined && scale !== null) ? Number(scale) : 1
    const safeOpacity = (opacity !== undefined && opacity !== null) ? Number(opacity) : 1

    // Safety check for width - if 0 or null, use auto
    if (width === 0 || width === '0') cssStyles.width = 'auto'

    return (
        <motion.div
            id={uniqueId}
            initial={{ opacity: 0, scale: 0.8, x: motionX, y: motionY }}
            animate={{ opacity: safeOpacity, scale: safeScale, x: motionX, y: motionY }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute z-30 pointer-events-auto"
            style={cssStyles}
        >
            <div
                className="w-full h-full relative"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </motion.div>
    )
}
