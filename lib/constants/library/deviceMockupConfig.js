import { Smartphone } from 'lucide-react'

export const deviceMockupConfig = {
    id: 'device-mockup',
    name: 'Device Mockup',
    icon: Smartphone,
    description: 'Mobile or tablet device mockup',
    defaultProps: {
        device: 'iphone',
        orientation: 'portrait',
        scale: 1
    }
}
