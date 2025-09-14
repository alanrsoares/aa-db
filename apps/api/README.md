# Road Code Tests API

A minimalist Hono.js-based web API focused on retrieving driving test questions.

## Getting Started

```bash
# Install dependencies
bun install

# Start the development server
bun run dev

# Or start the production server
bun run start
```

The API will be available at `http://localhost:3000` by default.

## API Endpoints

### Health Check

- `GET /` - Health check endpoint

### Questions

- `GET /questions/random` - Get a random question
- `GET /questions/:id` - Get a question by ID
- `GET /questions/category/:category` - Get questions by category
- `GET /questions/subcategory/:subcategory` - Get questions by subcategory
- `GET /questions/category/:category/subcategory/:subcategory` - Get questions by category and subcategory
- `GET /questions/random/category/:category` - Get a random question by category
- `GET /questions/random/subcategory/:subcategory` - Get a random question by subcategory
- `GET /questions/random/category/:category/subcategory/:subcategory` - Get a random question by category and subcategory

### Categories & Subcategories

- `GET /categories` - Get all available categories
- `GET /subcategories` - Get all available subcategories
- `GET /categories/:category/subcategories` - Get subcategories for a specific category

## Response Format

All responses follow this format:

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "type": "ERROR_TYPE",
    "message": "Error description"
  }
}
```

## Available Categories

- `car` - Car driving test questions
- `motorbike` - Motorbike driving test questions
- `heavy_vehicle` - Heavy vehicle driving test questions

## Environment Variables

- `PORT` - Server port (default: 3000)
