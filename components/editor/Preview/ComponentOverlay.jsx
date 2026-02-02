import { FloatingText } from '@/components/overlays/FloatingText'
import { BrowserFrame } from '@/components/overlays/BrowserFrame'
import { CalloutBubble } from '@/components/overlays/CalloutBubble'
import { TerminalOverlay } from '@/components/overlays/TerminalOverlay'
import { DeviceMockup } from '@/components/overlays/DeviceMockup'
import { TextHighlight } from '@/components/overlays/TextHighlight'
import { PremiumCursor } from '@/components/overlays/PremiumCursor'
import { ProblemStatement } from '@/components/overlays/ProblemStatement'
import { FreezeFrame } from '@/components/overlays/FreezeFrame'
import { ZoomAreaOverlay } from '@/components/overlays/ZoomAreaOverlay'
import { RippleEffect } from '@/components/overlays/RippleEffect'
import { CameraOverlay } from '@/components/overlays/CameraOverlay'
import { VideoOverlay } from '@/components/overlays/VideoOverlay'
import { CustomCodeOverlay } from '@/components/overlays/CustomCodeOverlay'

export function ComponentOverlay({ component, currentTime, isPlaying }) {
    const progress = (currentTime - component.startTime) / (component.endTime - component.startTime)

    if (component.type === 'audio') {
        return <AudioPlayer component={component} currentTime={currentTime} isPlaying={isPlaying} />
    }

    if (component.type === 'zoom-area') {
        return <ZoomAreaOverlay component={component} isPlaying={isPlaying} />
    }

    if (component.type === 'ripple-effect') {
        return <RippleEffect component={component} />
    }

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

    if (component.type === 'premium-cursor') {
        return <PremiumCursor component={component} currentTime={currentTime} />
    }

    if (component.type === 'problem-statement') {
        return <ProblemStatement component={component} currentTime={currentTime} />
    }

    if (component.type === 'freeze-frame') {
        return <FreezeFrame component={component} currentTime={currentTime} />
    }

    if (component.type === 'camera-overlay') {
        return <CameraOverlay component={component} currentTime={currentTime} isPlaying={isPlaying} />
    }

    if (component.type === 'video-overlay') {
        return <VideoOverlay component={component} currentTime={currentTime} isPlaying={isPlaying} />
    }

    if (component.type === 'custom-code') {
        return <CustomCodeOverlay component={component} />
    }

    return null
}
