import { Terminal } from 'lucide-react'

export const terminalConfig = {
    id: 'terminal',
    name: 'Terminal Window',
    icon: Terminal,
    description: 'Typewriter terminal effect',
    defaultProps: {
        code: 'npm install your-package',
        theme: 'dark',
        speed: 50
    }
}
