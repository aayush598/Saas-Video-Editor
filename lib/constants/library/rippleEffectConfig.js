import { MousePointerClick } from 'lucide-react'

export const rippleEffectConfig = {
    id: 'ripple-effect',
    name: 'Click Ripple',
    icon: MousePointerClick,
    description: 'Ripple animation for clicks',
    defaultProps: {
        x: 50,
        y: 50,
        size: 50,
        color: '#3b82f6', // blue-500
        duration: 1
    }
}
