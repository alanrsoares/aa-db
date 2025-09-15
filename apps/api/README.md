# Road Code Tests API

A minimalist Hono.js-based web API focused on retrieving driving test questions.

## Getting Started

```bash
# Install dependencies
bun install

# Start the development server
bun run dev
```

The API will be available at `http://localhost:3000` by default.

## API Endpoints

- `GET /` - Health check endpoint
- `GET /questions/random` - Get a random question
- `GET /questions/:id` - Get a question by ID
- `GET /questions/category/:category` - Get questions by category
- `GET /questions/subcategory/:subcategory` - Get questions by subcategory
- `GET /categories` - Get all available categories
- `GET /subcategories` - Get all available subcategories
- `GET /categories/:category/subcategories` - Get subcategories for a specific category
