# NZ Roadcode Questions Database

This project is a system for scraping, storing, and serving New Zealand road code test questions.

## Packages

-   `apps/cli`: A web crawler to extract and cache driving test questions.
-   `apps/api`: An API to serve the scraped questions.
-   `apps/native`: A React Native app to practice the test questions.
-   `packages/core`: Shared code used across the different applications.

## Getting Started

To get started, install the dependencies:

```bash
bun install
```

Then, you can run the different applications:

-   **Crawler**: `cd apps/cli && bun run sync`
-   **API**: `cd apps/api && bun run dev`
-   **Native App**: `cd apps/native && bun start`
