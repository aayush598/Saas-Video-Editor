import {
    Type,
    Monitor,
    Smartphone,
    MessageSquare,
    Terminal,
    Sparkles,
    MousePointer2,
    AlertTriangle,
    Focus,
    Music
} from 'lucide-react'

export const COMPONENT_LIBRARY = [
    {
        id: 'audio',
        name: 'Audio Track',
        icon: Music,
        description: 'Background music or sound effects',
        defaultProps: {
            audioSrc: '', // Empty by default
            volume: 50,
            loop: false,
            // Visual placeholder props if needed, but it's invisible on canvas usually?
            // Maybe we want a "Now Playing" visible indicator optionally?
            // For now, simple audio.
        }
    },
    {
        id: 'problem-statement',
        name: 'Zoom Reveal Intro',
        icon: AlertTriangle,
        description: 'Cinematic typing with zoom-out visual reveal',
        defaultProps: {
            firstWords: 'THE PROBLEM',
            restOfSentence: 'IS DISCONNECTED DATA',
            textGradient: 'from-white via-gray-200 to-gray-400',
            // Default images
            imgTopSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600',
            imgTopConfig: { w: 300, h: 200, x: 200, y: -200, opacity: 0.9, blur: 0, border: '#ffffff', radius: 12, rotate: 6 },
            imgBottomSrc: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600',
            imgBottomConfig: { w: 320, h: 220, x: -200, y: 150, opacity: 0.9, blur: 2, border: '#ff0000', radius: 12, rotate: -3 },
        }
    },
    {
        id: 'premium-cursor',
        name: 'Pro Cursor Motion',
        icon: MousePointer2,
        description: 'Advanced cursor animation with paths, clicks, and zooms',
        defaultProps: {
            cursorType: 'macos',
            startPos: { x: 10, y: 50 },
            endPos: { x: 80, y: 50 },
            size: 'medium',
            showPath: true,
            pathType: 'curved',
            pathColor: '#3b82f6',
            clickEffect: true,
            zoomOnAction: false,
            easing: 'easeInOut'
        }
    },
    {
        id: 'floating-text',
        name: 'Floating Punch Text',
        icon: Type,
        description: 'Animated floating text with customizable effects',
        defaultProps: {
            text: 'Your Text Here',
            fontSize: 48,
            color: '#ffffff',
            animation: 'float',
            duration: 2
        }
    },
    {
        id: 'browser-frame',
        name: 'Browser Frame',
        icon: Monitor,
        description: 'Floating browser mockup frame',
        defaultProps: {
            url: 'yoursite.com',
            title: 'Your Product',
            width: 800,
            shadow: true
        }
    },
    {
        id: 'device-mockup',
        name: 'Device Mockup',
        icon: Smartphone,
        description: 'Mobile or tablet device mockup',
        defaultProps: {
            device: 'iphone',
            orientation: 'portrait',
            scale: 1
        }
    },
    {
        id: 'callout-bubble',
        name: 'Feature Callout',
        icon: MessageSquare,
        description: 'Animated callout bubble',
        defaultProps: {
            text: 'Key Feature',
            position: 'top-right',
            color: '#3b82f6',
            size: 'medium'
        }
    },
    {
        id: 'terminal',
        name: 'Terminal Window',
        icon: Terminal,
        description: 'Typewriter terminal effect',
        defaultProps: {
            code: 'npm install your-package',
            theme: 'dark',
            speed: 50
        }
    },
    {
        id: 'text-highlight',
        name: 'Text Highlight',
        icon: Sparkles,
        description: 'Highlighted text animation',
        defaultProps: {
            text: 'Important Feature',
            highlightColor: '#fbbf24',
            animationStyle: 'sweep'
        }
    },
    {
        id: 'freeze-frame',
        name: 'Freeze Frame Highlight',
        icon: Focus,
        description: 'Freeze video and highlight specific sections',
        defaultProps: {
            dimOpacity: 0.7,
            highlights: [
                {
                    id: '1',
                    name: 'Highlight 1',
                    x: 20,
                    y: 20,
                    width: 30,
                    height: 30,
                    startTime: 0,
                    duration: 3,
                    color: '#3b82f6' // Blue-500
                }
            ],
            duration: 5
        }
    }
]
