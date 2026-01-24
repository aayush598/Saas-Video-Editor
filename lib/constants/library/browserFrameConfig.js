import { Monitor } from 'lucide-react'

export const browserFrameConfig = {
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
}
