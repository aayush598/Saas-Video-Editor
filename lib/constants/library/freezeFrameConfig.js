import { Focus } from 'lucide-react'

export const freezeFrameConfig = {
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
