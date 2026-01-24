import { Music } from 'lucide-react'

export const audioConfig = {
    id: 'audio',
    name: 'Audio Track',
    icon: Music,
    description: 'Background music or sound effects',
    defaultProps: {
        audioSrc: '', // Empty by default
        volume: 50,
        loop: false,
    }
}
