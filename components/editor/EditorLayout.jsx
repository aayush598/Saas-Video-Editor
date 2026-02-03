import { Toaster } from '@/components/ui/sonner'
import { Header } from './Header'

import { ComponentLibrary } from './Sidebar/ComponentLibrary'
import { PropertiesPanel } from './Sidebar/PropertiesPanel'
import { VideoPreview } from './Preview/VideoPreview'
import { Timeline } from './Timeline/Timeline'
import { ExportDialog } from './Export/ExportDialog'

export function EditorLayout({
    // Global State
    uploadedVideo,
    videoUrl,
    videoRef,
    handleVideoUpload,

    // Playback State
    isPlaying,
    togglePlayback,
    currentTime,
    setCurrentTime,
    skipBackward,
    skipForward,

    // Timeline State & Actions
    timelineComponents,
    videoClips,
    selectedComponent,
    setSelectedComponent,
    selectedClipIds,
    selectedComponentIds,
    setSelectedClip,
    projectDuration,
    zoom,
    setZoom,
    addComponentToTimeline,
    removeComponent,
    updateComponentProps,
    updateComponentTiming,
    handleSplit,
    handleClipMove,
    handleClipResize,
    deleteClip,
    copyItem,
    pasteItem,
    clipboard,

    // Export State
    isExporting,
    handleExportClick,
    isExportDialogOpen,
    setIsExportDialogOpen,
    exportFileName,
    setExportFileName,
    handleExportConfirm,

    // Custom Library Props
    customLibrary,

    // Derived
    activeComponents,
    overlayRef,
    handleRecordingComplete,
    recorder
}) {
    return (
        <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
            <Toaster position="top-right" />

            <Header
                handleExportClick={handleExportClick}
                isExporting={isExporting}
                videoUrl={videoUrl}
                recorder={recorder}
            />



            <div className="flex-1 flex overflow-hidden">
                <ComponentLibrary
                    addComponentToTimeline={addComponentToTimeline}
                    customTemplates={customLibrary?.customTemplates}
                    customLibrary={customLibrary}
                />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <VideoPreview
                        videoUrl={videoUrl}
                        videoRef={videoRef}
                        handleVideoUpload={handleVideoUpload}
                        activeComponents={activeComponents}
                        currentTime={currentTime}
                        overlayRef={overlayRef}
                        videoClips={videoClips}
                        isPlaying={isPlaying}
                        addComponentToTimeline={addComponentToTimeline}
                        togglePlayback={togglePlayback}
                        skipBackward={skipBackward}
                        skipForward={skipForward}
                    />

                    {videoUrl && videoClips.length > 0 && (
                        <Timeline
                            videoClips={videoClips}
                            timelineComponents={timelineComponents}
                            currentTime={currentTime}
                            projectDuration={projectDuration}
                            zoom={zoom}
                            setZoom={setZoom}
                            setCurrentTime={setCurrentTime}
                            handleClipMove={handleClipMove}
                            handleClipResize={handleClipResize}
                            deleteClip={deleteClip}
                            selectedClipIds={selectedClipIds}
                            setSelectedClip={setSelectedClip}
                            selectedComponent={selectedComponent}
                            selectedComponentIds={selectedComponentIds}
                            setSelectedComponent={setSelectedComponent}
                            removeComponent={removeComponent}
                            copyItem={copyItem}
                            pasteItem={pasteItem}
                            clipboard={clipboard}
                            handleSplit={handleSplit}
                            updateComponentTiming={updateComponentTiming}
                        />
                    )}
                </div>

                <PropertiesPanel
                    selectedComponent={selectedComponent}
                    selectedClip={selectedClipIds?.[0]}
                    removeComponent={removeComponent}
                    updateComponentProps={updateComponentProps}
                    updateComponentTiming={updateComponentTiming}
                    projectDuration={projectDuration}
                    videoClips={videoClips}
                />
            </div>

            <ExportDialog
                isOpen={isExportDialogOpen}
                setIsOpen={setIsExportDialogOpen}
                exportFileName={exportFileName}
                setExportFileName={setExportFileName}
                handleExportConfirm={handleExportConfirm}
            />
        </div>
    )
}
