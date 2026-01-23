import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

export function ProblemStatement({ component, currentTime }) {
    const {
        firstWords = "THE PROBLEM", // The first 2 big words
        restOfSentence = "IS EXTENSIVE DATA LOSS", // The rest of the sentence
        textGradient = "from-white via-gray-200 to-gray-400",

        // Image Top Props
        imgTopSrc = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop",
        imgTopConfig = { w: 300, h: 200, x: 0, y: -150, opacity: 0.8, blur: 0, border: '#ffffff', radius: 10, rotate: -5 },

        // Image Bottom Props
        imgBottomSrc = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
        imgBottomConfig = { w: 300, h: 200, x: 0, y: 150, opacity: 0.8, blur: 0, border: '#ffffff', radius: 10, rotate: 5 },

    } = component.props || {}

    // Timing Logic
    const duration = component.endTime - component.startTime
    const progress = Math.min(Math.max((currentTime - component.startTime) / duration, 0), 1)

    // Animation Phases
    // 0.0 - 0.3: Type first words (Zoom 1.2)
    // 0.3 - 0.6: Zoom out to 0.8, Words resize effectively, Images enter from boundary
    // 0.6 - 0.9: Type rest of sentence
    // 0.9 - 1.0: Hard Zoom In to transition

    // Helper to render typing text
    const TypingText = ({ text, startDelay, speed = 0.05 }) => {
        return (
            <span className="inline-flex whitespace-pre">
                {text.split('').map((char, i) => {
                    const step = startDelay + (i * speed)
                    const charVisible = progress > step
                    return (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: charVisible ? 1 : 0, y: charVisible ? 0 : 20 }}
                            transition={{ duration: 0.1 }}
                        >
                            {char}
                        </motion.span>
                    )
                })}
            </span>
        )
    }

    // Container Scale Logic
    let containerScale = 1.5
    if (progress > 0.3) {
        // Zoom out smoothly
        const zoomProgress = Math.min((progress - 0.3) / 0.3, 1) // 0 to 1 over 0.3s
        containerScale = 1.5 - (zoomProgress * 0.7) // Goes to 0.8
    }
    if (progress > 0.9) {
        // Zoom in hard at end
        const exitProgress = (progress - 0.9) / 0.1
        containerScale = 0.8 + (exitProgress * 5) // Zooms way in
    }

    // Image Entrance Logic (Parallax from outer bounds)
    // They are 'out' until 0.3, then they move to their defined X/Y
    const imgEntranceProgress = Math.max(0, Math.min((progress - 0.3) / 0.3, 1))
    const easeOutBack = (x) => 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2);
    const easedImgEnter = easeOutBack(imgEntranceProgress)

    // Calculate image offsets based on entrance
    // Top image comes from top (-Y), Bottom from bottom (+Y)
    const getStyles = (cfg, direction) => {
        const startY = direction === 'top' ? -500 : 500
        const currentY = startY + (cfg.y - startY) * easedImgEnter

        return {
            width: `${cfg.w}px`,
            height: `${cfg.h}px`,
            opacity: Math.min(imgEntranceProgress * 2, cfg.opacity), // Fade in
            transform: `translate(${cfg.x}px, ${currentY}px) rotate(${cfg.rotate}deg)`,
            filter: `blur(${cfg.blur}px)`,
            borderColor: cfg.border,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: `${cfg.radius}px`,
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: `-${cfg.h / 2}px`,
            marginLeft: `-${cfg.w / 2}px`,
            zIndex: 10,
            backgroundImage: `url(${direction === 'top' ? imgTopSrc : imgBottomSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }
    }

    return (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-black font-sans perspective-1000">
            {/* Vignette & Noise */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent to-black pointer-events-none z-0" />

            {/* Main Scaling Container */}
            <motion.div
                className="relative flex items-center justify-center w-full h-full"
                animate={{ scale: containerScale }}
                transition={{ duration: 0.5, ease: "easeInOut" }} // Note: Framer Motion animates state changes, but we are using calculated vars based on progress prop for strict timeline sync. 
                // Actually, since we are calculating based on 'progress' prop which updates every frame (ideally), we can just set style transform.
                style={{ transform: `scale(${containerScale})` }}
            >

                {/* Image Components */}
                {/* Render only when phase starts to save resources? Or just opacity/offscreen */}
                <div style={getStyles(imgTopConfig, 'top')} />
                <div style={getStyles(imgBottomConfig, 'bottom')} />

                {/* Text Layer */}
                <div className="z-20 flex flex-nowrap items-baseline gap-4 text-center select-none drop-shadow-2xl">
                    <h1 className={`text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br ${textGradient}`}>
                        <TypingText text={firstWords} startDelay={0} speed={0.03} />
                    </h1>
                    <h2 className="text-4xl font-bold text-gray-400">
                        <TypingText text={restOfSentence} startDelay={0.3} speed={0.02} />
                    </h2>
                </div>

            </motion.div>
        </div>
    )
}
