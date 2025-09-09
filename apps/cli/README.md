# NZ Roadcode Questions Database Crawler

A TypeScript-based web crawler designed to extract and cache driving test questions from New Zealand roadcode websites. This tool uses Puppeteer to scrape questions from various driving test sources and stores them in a local JSON database with intelligent caching.

## 🚀 Features

- **Multi-category Support**: Crawls questions for different vehicle types and roadcode categories:
  - **Car**: Core driving theory, behavior, parking, emergencies, road position, intersections, theory, and signs
  - **Motorbike**: All car categories plus motorbike-specific questions
  - **Heavy Vehicle**: All car categories plus Class 2, 3, and 5 specific questions

- **Intelligent Caching**:
  - Persistent storage using lowdb with JSON backend
  - Configurable TTL (Time To Live) for cache entries
  - Automatic deduplication using question hash keys
  - Prevents re-scraping of already cached questions

- **Robust Scraping**:
  - Headless browser automation with Puppeteer
  - Configurable retry mechanisms and timeouts
  - Rate limiting to be respectful to target websites
  - Error handling and recovery

- **Interactive CLI**:
  - Command-line interface with category/subcategory selection
  - Progress indicators and colored output
  - Configurable options for headless mode and other parameters

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Bun** (v1.1.25 or higher) - Used as package manager
- **TypeScript** knowledge (for development)

## 🛠️ Installation

1. **Clone the repository**:

   ```bash
   git clone git@github.com:alanrsoares/aa-db.git
   cd aa-db
   ```

2. **Install dependencies**:

   ```bash
   bun install
   ```

3. **Build the project**:
   ```bash
   bun run build
   ```

## 🚗 Usage

### Basic Usage

Run the sync command to start crawling questions:

```bash
bun run sync
```

This will prompt you to select:

1. **Category**: Choose from `car`, `motorbike`, or `heavy_vehicle`
2. **Subcategory**: Select from available subcategories for your chosen category

### Advanced Usage

You can also specify options directly:

```bash
bun run sync --category car --subcategory core --headless
```

**Available Options**:

- `-c, --category <category>`: The category of driving test questions
- `-s, --subcategory <subcategory>`: The subcategory of driving test questions
- `-h, --headless`: Run the browser in headless mode (default: false)

### Available Categories and Subcategories

The crawler supports various roadcode categories for different vehicle types:

#### Car

- `core` - Core driving theory
- `behaviour` - Driver behavior
- `parking` - Parking techniques
- `emergencies` - Emergency procedures
- `road-position` - Road positioning
- `intersection` - Intersection rules
- `theory` - General theory
- `signs` - Road signs

#### Motorbike

- All car subcategories plus:
- `motorbike-specific-questions` - Motorbike-specific content

#### Heavy Vehicle

- All car subcategories plus:
- `heavy-vehicle-specific-questions-class-2` - Class 2 specific
- `heavy-vehicle-specific-questions-class-3-5` - Class 3-5 specific

## 📁 Project Structure

```
aa-db/
├── src/
│   ├── Cache.ts                 # Caching system with TTL support
│   ├── config.ts                # Configuration constants and types
│   ├── utils.ts                 # General utility functions
│   └── drivingtests/
│       ├── DrivingTestsQuestions.ts  # Main scraping logic
│       ├── sync.ts              # CLI interface
│       ├── types.ts             # TypeScript type definitions
│       └── utils.ts             # Scraping-specific utilities
├── db/
│   └── db.json                 # Cached questions database
├── dist/                       # Compiled JavaScript output
└── package.json
```

## 🔧 Configuration

The crawler uses several configurable parameters in `src/config.ts`:

- **Timeouts**: `TIMEOUT` (10 seconds), `MAX_ATTEMPTS` (20), `WAIT_TIME` (1 second)
- **Browser Settings**: Viewport size, user agent, HTTP headers
- **Endpoint Configuration**: Base URL and category mappings
- **Cache Settings**: Default TTL (10 minutes), collection ID
- **Scraping Limits**: `MAX_EMPTY_ATTEMPTS` (25 consecutive empty attempts)

## 💾 Data Storage

Questions are stored in `db/db.json` with the following structure:

```json
{
  "cache": [
    {
      "created": 1703123456789,
      "key": "abc123def4",
      "value": {
        "question": "What does this road sign mean?",
        "options": [
          { "letter": "A", "text": "Stop", "id": "1" },
          { "letter": "B", "text": "Give way", "id": "2" }
        ],
        "answer": "A",
        "explanation": "This is a stop sign...",
        "imageUrl": "https://...",
        "key": "abc123def4"
      }
    }
  ]
}
```

## 🛠️ Development

### Available Scripts

- `bun run build` - Compile TypeScript to JavaScript
- `bun run clean` - Remove compiled output
- `bun run sync` - Run the crawler
- `bun run format` - Format code with Prettier

### Key Dependencies

- **Puppeteer**: Browser automation for web scraping
- **lowdb**: Lightweight JSON database
- **commander**: CLI argument parsing
- **@inquirer/prompts**: Interactive command-line prompts
- **chalk**: Colored terminal output

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `bun run build` to ensure compilation
5. Run `bun run format` to format code
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This tool is for educational and research purposes. Please respect the target websites' terms of service and robots.txt files. The crawler includes rate limiting and respectful scraping practices, but use responsibly.

## 👨‍💻 Author

**Alan Soares** - [github.com/alanrsoares](https://github.com/alanrsoares)

---

_Built with TypeScript, Puppeteer, and Bun_
