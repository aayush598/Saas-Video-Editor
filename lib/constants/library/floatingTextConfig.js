import { Type } from 'lucide-react'

export const floatingTextConfig = {
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
}
