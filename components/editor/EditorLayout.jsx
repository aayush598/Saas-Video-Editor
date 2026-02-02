import { Toaster } from '@/components/ui/sonner'
import { Header } from './Header'
import { Toolbar } from './Toolbar'
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
    selectedClip,
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

    // Derived
    // Derived
    activeComponents,
    overlayRef,
    handleRecordingComplete
}) {
    return (
        <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
            <Toaster position="top-right" />

            <Header
                handleExportClick={handleExportClick}
                isExporting={isExporting}
                videoUrl={videoUrl}
            />

            <Toolbar
                handleSplit={handleSplit}
                uploadedVideo={uploadedVideo}
                skipBackward={skipBackward}
                skipForward={skipForward}
                togglePlayback={togglePlayback}
                isPlaying={isPlaying}
                handleRecordingComplete={handleRecordingComplete}
            />

            <div className="flex-1 flex overflow-hidden">
                <ComponentLibrary
                    addComponentToTimeline={addComponentToTimeline}
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
                    />

                    {videoUrl && (
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
                            selectedClip={selectedClip}
                            setSelectedClip={setSelectedClip}
                            selectedComponent={selectedComponent}
                            setSelectedComponent={setSelectedComponent}
                            removeComponent={removeComponent}
                            copyItem={copyItem}
                            pasteItem={pasteItem}
                            clipboard={clipboard}
                        />
                    )}
                </div>

                <PropertiesPanel
                    selectedComponent={selectedComponent}
                    selectedClip={selectedClip}
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
