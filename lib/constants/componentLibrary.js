import {
    Type,
    Monitor,
    Smartphone,
    MessageSquare,
    Terminal,
    Sparkles
} from 'lucide-react'

export const COMPONENT_LIBRARY = [
    {
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
    },
    {
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
    },
    {
        id: 'device-mockup',
        name: 'Device Mockup',
        icon: Smartphone,
        description: 'Mobile or tablet device mockup',
        defaultProps: {
            device: 'iphone',
            orientation: 'portrait',
            scale: 1
        }
    },
    {
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
    },
    {
        id: 'terminal',
        name: 'Terminal Window',
        icon: Terminal,
        description: 'Typewriter terminal effect',
        defaultProps: {
            code: 'npm install your-package',
            theme: 'dark',
            speed: 50
        }
    },
    {
        id: 'text-highlight',
        name: 'Text Highlight',
        icon: Sparkles,
        description: 'Highlighted text animation',
        defaultProps: {
            text: 'Important Feature',
            highlightColor: '#fbbf24',
            animationStyle: 'sweep'
        }
    }
]
