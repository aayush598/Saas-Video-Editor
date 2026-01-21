# 🎬 SaaS Video Editor Platform

A professional video editing platform specifically designed for SaaS founders and developers who want to create stunning product launch and demo videos **without any video editing experience**.

## 🌟 Key Features

### 📦 Pre-built Component Library
- **Floating Punch Text** - Animated floating text with customizable effects
- **Browser Frame** - Professional browser mockup overlay
- **Device Mockup** - Mobile/Tablet device frames
- **Feature Callout Bubbles** - Animated highlight bubbles
- **Terminal Window** - Typewriter terminal effect for code demos
- **Text Highlight** - Animated text highlighting

### 🎯 Core Functionality
- ✅ **Video Upload** - Support for all common video formats
- ✅ **Drag & Drop Timeline** - Easy component placement and timing
- ✅ **Real-time Preview** - See your edits instantly
- ✅ **Component Properties** - Customize every aspect of each component
- ✅ **Timeline Editor** - Precise control over component timing
- ✅ **Export High-Quality Video** - Professional MP4 output

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Yarn package manager
- 8GB RAM (optimized for low resource usage)

### Installation

1. **Install dependencies:**
```bash
cd /app
yarn install
```

2. **Start the development server:**
```bash
yarn dev
```

3. **Open your browser:**
Navigate to `http://localhost:3000`

## 💻 How to Use

### Step 1: Upload Your Video
1. Click the "Choose Video File" button
2. Select your product demo or launch video
3. Video will load in the preview area

### Step 2: Add Components
1. Browse the Component Library (left sidebar)
2. Click on any component to add it to your timeline
3. Component appears at the current playback position

### Step 3: Customize Components
1. Click on a component in the timeline to select it
2. Properties panel opens on the right
3. Adjust text, colors, timing, position, and effects
4. Changes appear in real-time preview

### Step 4: Fine-tune Timeline
- Drag components to adjust timing
- Set precise start/end times in properties
- Remove unwanted components with the trash icon
- Preview your video at any time

### Step 5: Export
1. Click "Export Video" in the top-right
2. Video renders with all components
3. Download high-quality MP4 file

## 🎨 Component Details

### Floating Punch Text
Perfect for emphasizing key messages or product names.
- **Customizable:** Text, font size (24-120px), color, animation style
- **Animation:** Floating effect with smooth easing
- **Best for:** Headlines, CTAs, key features

### Browser Frame
Show your product in a professional browser mockup.
- **Customizable:** URL, title, width (400-1200px), shadow
- **Style:** Chrome-style browser window
- **Best for:** Web app demos, landing page showcases

### Device Mockup
Display mobile or tablet views of your product.
- **Customizable:** Device type (iPhone/iPad), orientation, scale
- **Style:** Realistic device frames
- **Best for:** Mobile app demos, responsive design showcases

### Feature Callout Bubble
Highlight specific features with animated bubbles.
- **Customizable:** Text, position (4 corners), color, size
- **Animation:** Pop-in effect
- **Best for:** Feature highlights, UI annotations

### Terminal Window
Perfect for developer-focused products.
- **Customizable:** Command text, theme, typing speed
- **Animation:** Typewriter effect
- **Best for:** CLI tools, installation demos, code examples

### Text Highlight
Draw attention to important text or UI elements.
- **Customizable:** Text, highlight color, animation style
- **Animation:** Sweep or fade-in
- **Best for:** Emphasizing key features, pricing, USPs

## 🏗️ Architecture

### Technology Stack
- **Framework:** Next.js 14 (React 18)
- **Animations:** Framer Motion
- **UI Components:** shadcn/ui + Radix UI
- **Styling:** Tailwind CSS
- **Video Processing:** HTML5 Video API + Canvas

### Why This Stack?
- **Lightweight:** No heavy video processing libraries
- **Fast Preview:** React-based rendering for instant feedback
- **Low CPU Usage:** Optimized for 8GB RAM systems
- **Code-based Components:** Everything is React components (future-proof for programmatic generation)

### Performance Optimizations
- Hot reload enabled for instant development feedback
- Component lazy loading
- Optimized preview rendering
- Memory-efficient video handling
- No server-side processing during editing

## 📁 Project Structure

```
/app
├── app/
│   ├── page.js              # Main editor application
│   ├── layout.js            # Root layout
│   └── globals.css          # Global styles
├── components/
│   └── ui/                  # shadcn UI components
├── lib/
│   └── utils.js             # Utility functions
└── package.json             # Dependencies
```

## 🎯 Use Cases

### Perfect For:
- 🚀 **SaaS Product Launches** - Create engaging launch videos
- 📱 **Product Demos** - Showcase features professionally
- 🎓 **Technical Tutorials** - Explain complex concepts visually
- 💼 **Marketing Videos** - Professional-quality marketing content
- 🛠️ **Developer Tools** - Demo CLIs, APIs, and frameworks

### Who It's For:
- SaaS Founders who don't know video editing
- Developers creating product documentation
- Startup teams on a budget
- Technical content creators
- Product managers creating demos

## 🔧 Configuration

### Hot Reload
- Frontend hot reload is enabled by default
- Only restart server when installing new dependencies

### Memory Optimization
- Default Node memory limit: 512MB
- Adjust in `package.json` if needed:
```json
"dev": "NODE_OPTIONS='--max-old-space-size=512' next dev"
```

## 🚦 Development

### Running the Application
```bash
# Development mode (hot reload enabled)
yarn dev

# Production build
yarn build

# Start production server
yarn start
```

### Server Management
```bash
# Restart Next.js server
sudo supervisorctl restart nextjs

# Restart all services
sudo supervisorctl restart all

# Check logs
tail -f /var/log/supervisor/nextjs.out.log
```

## 🎓 Future Enhancements

### Planned Features:
- [ ] More component types (charts, graphs, annotations)
- [ ] Component animation presets
- [ ] Audio track support
- [ ] Video filters and effects
- [ ] Batch processing
- [ ] Template library
- [ ] Collaboration features
- [ ] Cloud rendering
- [ ] API for programmatic video generation

### Extensibility:
Since all components are React-based, you can easily:
- Create custom components
- Add new animation styles
- Integrate with APIs for dynamic content
- Build programmatic video generation pipelines

## 🐛 Troubleshooting

### Video Won't Upload
- Check file format (MP4, WebM, MOV supported)
- Ensure file size is reasonable (<500MB recommended)
- Check browser console for errors

### Components Not Appearing
- Verify component is within video duration
- Check start/end times in properties panel
- Ensure video is playing in the correct time range

### Performance Issues
- Close other applications
- Reduce video resolution if needed
- Limit number of components on timeline
- Clear browser cache

### Server Won't Start
```bash
# Check logs
tail -n 100 /var/log/supervisor/nextjs.out.log

# Restart server
sudo supervisorctl restart nextjs
```

## 📝 Technical Notes

### Video Processing
- All processing happens in-browser during editing
- No server-side processing required for preview
- Export uses canvas-based rendering
- Supports all HTML5 video formats

### Component System
- Each component is a React component
- Props-based configuration
- Framer Motion for animations
- Timeline-based activation

### Resource Usage
- **Memory:** ~200-400MB during editing
- **CPU:** Minimal during preview (<20%)
- **Storage:** Only uploaded video stored in memory
- **Network:** No external API calls during editing

## 🤝 Contributing

This is a foundational MVP focused on core video editing functionality. Future contributions can include:
- Additional component types
- Advanced animation effects
- Export quality improvements
- Performance optimizations

## 📄 License

This project is built for SaaS founders and developers. Feel free to extend and customize for your needs.

## 🎉 Credits

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide Icons](https://lucide.dev/) - Icons

---

**Ready to create professional product videos?** 🚀

Upload your video and start adding components now!
