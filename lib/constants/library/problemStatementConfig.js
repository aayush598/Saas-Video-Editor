import { AlertTriangle } from 'lucide-react'

export const problemStatementConfig = {
    id: 'problem-statement',
    name: 'Zoom Reveal Intro',
    icon: AlertTriangle,
    description: 'Cinematic typing with zoom-out visual reveal',
    defaultProps: {
        firstWords: 'THE PROBLEM',
        restOfSentence: 'IS DISCONNECTED DATA',
        textGradient: 'from-white via-gray-200 to-gray-400',
        imgTopSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600',
        imgTopConfig: { w: 300, h: 200, x: 200, y: -200, opacity: 0.9, blur: 0, border: '#ffffff', radius: 12, rotate: 6 },
        imgBottomSrc: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600',
        imgBottomConfig: { w: 320, h: 220, x: -200, y: 150, opacity: 0.9, blur: 2, border: '#ff0000', radius: 12, rotate: -3 },
    }
}
