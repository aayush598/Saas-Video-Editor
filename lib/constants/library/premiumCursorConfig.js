import { MousePointer2 } from 'lucide-react'

export const premiumCursorConfig = {
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
}
