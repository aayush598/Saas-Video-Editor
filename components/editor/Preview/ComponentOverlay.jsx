import { FloatingText } from '@/components/overlays/FloatingText'
import { BrowserFrame } from '@/components/overlays/BrowserFrame'
import { CalloutBubble } from '@/components/overlays/CalloutBubble'
import { TerminalOverlay } from '@/components/overlays/TerminalOverlay'
import { DeviceMockup } from '@/components/overlays/DeviceMockup'
import { TextHighlight } from '@/components/overlays/TextHighlight'

export function ComponentOverlay({ component, currentTime }) {
    const progress = (currentTime - component.startTime) / (component.endTime - component.startTime)

    if (component.type === 'floating-text') {
        return <FloatingText component={component} />
    }

    if (component.type === 'browser-frame') {
        return <BrowserFrame component={component} />
    }

    if (component.type === 'callout-bubble') {
        return <CalloutBubble component={component} />
    }

    if (component.type === 'terminal') {
        return <TerminalOverlay component={component} progress={progress} />
    }

    if (component.type === 'device-mockup') {
        return <DeviceMockup component={component} />
    }

    if (component.type === 'text-highlight') {
        return <TextHighlight component={component} />
    }

    return null
}
