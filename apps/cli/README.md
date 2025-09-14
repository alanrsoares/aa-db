# NZ Roadcode Questions Database Crawler

A TypeScript-based web crawler designed to extract and cache driving test questions from New Zealand roadcode websites.

## Usage

Run the `sync` command to start crawling questions:

```bash
bun run sync
```

This will prompt you to select:

1.  **Category**: Choose from `car`, `motorbike`, or `heavy_vehicle`
2.  **Subcategory**: Select from available subcategories for your chosen category

You can also specify options directly:

```bash
bun run sync --category car --subcategory core --headless
```