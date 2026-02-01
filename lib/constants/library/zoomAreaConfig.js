import { ZoomIn } from 'lucide-react'

export const zoomAreaConfig = {
    id: 'zoom-area',
    name: 'Zoom Area',
    icon: ZoomIn,
    description: 'Smoothly zoom into a specific area',
    defaultProps: {
        x: 50, // Percentage X center
        y: 50, // Percentage Y center
        scale: 1.5, // Zoom level
        ease: 'easeInOut'
    }
}
