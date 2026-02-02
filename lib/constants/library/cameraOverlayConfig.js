import { Camera } from 'lucide-react'

export const cameraOverlayConfig = {
    id: 'camera-overlay',
    name: 'Camera Overlay',
    description: 'Record and display camera feed',
    type: 'camera-overlay',
    icon: Camera,
    defaultProps: {
        position: 'bottom-right', // top-left, top-right, bottom-left, bottom-right
        shape: 'circle', // circle, square, manual
        size: 'medium', // small, medium, large
        showBorder: true,
        borderColor: '#3b82f6', // blue-500
        opacity: 1
    }
}
