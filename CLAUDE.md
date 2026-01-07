# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

- `npm run build` - Build the SDK using tsup (outputs ESM, CJS, and type declarations to `dist/`)
- `npm run dev` - Watch mode for development
- `npm run typecheck` - Run TypeScript type checking without emitting files

## Architecture

This is a Node.js SDK for the SigninID email testing API. The SDK provides two main resources for querying emails: inbox (received) and sent.

### Project Structure

```
src/
├── index.ts          # Public exports
├── client.ts         # SigninID main class with HTTP request handling
├── types.ts          # TypeScript interfaces for API responses and params
├── errors.ts         # Error class hierarchy
└── resources/
    ├── inbox.ts      # InboxResource - received email operations
    └── sent.ts       # SentResource - sent email operations
```

### Key Patterns

**Client Pattern**: The `SigninID` class is the main entry point. It initializes resource classes (`inbox`, `sent`) and provides a shared `request()` method for HTTP calls using the native `fetch` API.

**Resource Pattern**: Each resource class (`InboxResource`, `SentResource`) receives the client instance and delegates HTTP calls through `client.request()`. Resources handle parameter serialization (e.g., Date to ISO string).

**Error Hierarchy**: All SDK errors extend `SigninIDError`. Specific error types (`AuthenticationError`, `ValidationError`, `RateLimitError`, `NetworkError`, `TimeoutError`) map to HTTP status codes or network conditions.

### API Endpoints Used

- `GET /api/v1/inbox/latest` - Most recent inbox email
- `GET /api/v1/inbox/:id` - Single inbox email by ID
- `GET /api/v1/inbox` - List inbox email IDs (paginated)
- `GET /api/v1/sent/latest` - Most recent sent email
- `GET /api/v1/sent/:id` - Single sent email by ID
- `GET /api/v1/sent` - List sent email IDs (paginated)

### Configuration

- `SIGNINID_SECRET_KEY` - API key (must start with `sk_live_`)
- `SIGNINID_BASE_URL` - Override API base URL (default: `https://api.signinid.com`)
