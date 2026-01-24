import { MessageSquare } from 'lucide-react'

export const calloutBubbleConfig = {
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
}
