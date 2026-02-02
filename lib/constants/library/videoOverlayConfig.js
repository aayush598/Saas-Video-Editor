import { Video } from 'lucide-react'

export const videoOverlayConfig = {
    id: 'video-overlay',
    name: 'Video Overlay',
    description: 'Add a picture-in-picture video',
    type: 'video-overlay',
    icon: Video,
    defaultProps: {
        position: 'bottom-right', // top-left, top-right, bottom-left, bottom-right
        shape: 'rectangle', // circle, square, rectangle
        size: 'medium', // small, medium, large
        showBorder: true,
        borderColor: '#ffffff',
        activeShadow: true,
        opacity: 1,
        volume: 1,
        videoSrc: null
    }
}
