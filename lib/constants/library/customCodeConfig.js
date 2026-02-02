import { Code2 } from 'lucide-react'

export const customCodeConfig = {
    id: 'custom-code',
    name: 'Custom Code',
    description: 'Build your own component using HTML & CSS',
    type: 'custom-code',
    icon: Code2,
    defaultProps: {
        html: '<div class="my-badge">\n  <span class="dot"></span>\n  <span>Live Update</span>\n</div>',
        css: '.my-badge {\n  background: rgba(0, 0, 0, 0.8);\n  color: white;\n  padding: 8px 16px;\n  border-radius: 99px;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-family: sans-serif;\n  border: 1px solid rgba(255,255,255,0.2);\n}\n\n.dot {\n  width: 8px;\n  height: 8px;\n  background: #ef4444;\n  border-radius: 50%;\n  animation: pulse 1.5s infinite;\n}\n\n@keyframes pulse {\n  0% { opacity: 1; }\n  50% { opacity: 0.5; }\n  100% { opacity: 1; }\n}',
        position: 'center', // top-left, top-right, bottom-left, bottom-right, center, custom
        x: 50,
        y: 50,
        width: 300,
        height: 200,
        scale: 1,
        opacity: 1
    }
}
