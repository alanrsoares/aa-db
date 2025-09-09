# Driving Test Question Crawler - Web UI

A modern web interface for the driving test question crawler, built with React, TypeScript, and shadcn/ui components.

## Features

### 🚗 **Question Crawler Interface**

- **Configuration Panel**: Set category, subcategory, and crawling parameters
- **Real-time Status**: Live updates of crawling progress and statistics
- **Control Panel**: Start, stop, and manage the crawling process
- **Question Browser**: View and search through cached questions

### 🎨 **Modern UI Components**

- Built with **shadcn/ui** components for consistent design
- **Tailwind CSS** for responsive styling
- **Lucide React** icons for intuitive interface
- **Radix UI** primitives for accessibility

### 📊 **Real-time Monitoring**

- Live progress bars and statistics
- Error handling and display
- Current URL tracking
- Question count and category breakdown

### 🔧 **Advanced Configuration**

- Category selection (Car, Motorbike, Heavy Vehicle)
- Subcategory filtering
- Adjustable timeouts and retry limits
- Headless mode toggle

## Architecture

### **Core Components**

1. **CrawlerProvider** - Context provider for crawler state management
2. **CrawlerConfig** - Configuration panel with form controls
3. **CrawlerStatus** - Real-time status display and statistics
4. **CrawlerControls** - Start/stop controls and cache management
5. **QuestionsList** - Browse and search cached questions

### **State Management**

- **WebCrawler** class for browser-compatible crawling simulation
- Real-time state updates via event listeners
- React Context for component communication

### **Data Flow**

```
User Input → CrawlerConfig → WebCrawler → State Updates → UI Components
```

## Getting Started

### Prerequisites

- Node.js 18+
- Bun (recommended) or npm

### Installation

```bash
# Install dependencies
bun install

# Start development server
bun run dev
```

### Available Scripts

- `bun run dev` - Start development server on port 3000
- `bun run build` - Build for production
- `bun run serve` - Preview production build
- `bun run lint` - Run ESLint
- `bun run format` - Format code with Prettier

## Usage

### 1. **Configure Crawler**

- Select category (Car, Motorbike, Heavy Vehicle)
- Choose subcategory or "All Subcategories"
- Adjust advanced settings (timeouts, retry limits)

### 2. **Start Crawling**

- Click "Start Crawling" to begin the process
- Monitor real-time progress in the Status tab
- View current URL and statistics

### 3. **Browse Questions**

- Switch to Questions tab to view cached questions
- Search and filter questions by content
- Expand questions to see full details, options, and explanations

### 4. **Export Data**

- Use "Export Questions" to download JSON file
- Clear cache when needed

## Technical Details

### **Dependencies**

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Radix UI** - Accessible primitives
- **Lucide React** - Icons
- **MobX State Tree** - State management (for core integration)

### **Browser Compatibility**

- Modern browsers with ES2020+ support
- Chrome, Firefox, Safari, Edge

### **Performance**

- Optimized for real-time updates
- Efficient state management
- Responsive design for all screen sizes

## Integration with Core Package

The web UI integrates with the `@roadcodetests/core` package through:

1. **Type Definitions** - Shared TypeScript interfaces
2. **WebCrawler Class** - Browser-compatible crawler implementation
3. **State Management** - Reactive state updates
4. **Data Export** - JSON format compatible with core package

## Future Enhancements

- [ ] Real Puppeteer integration for actual web scraping
- [ ] Question validation and quality checks
- [ ] Batch processing and scheduling
- [ ] Advanced filtering and search
- [ ] Question analytics and insights
- [ ] Multi-language support
- [ ] Dark mode theme

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the driving test question crawler system.
