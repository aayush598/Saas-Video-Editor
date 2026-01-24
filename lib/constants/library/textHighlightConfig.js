import { Sparkles } from 'lucide-react'

export const textHighlightConfig = {
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
