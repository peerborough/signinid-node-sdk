# Changelog

All notable changes to this project will be documented in this file.

## [0.2.1] - 2025-01-07

### Initial Release

Node.js SDK for the SigninID sandbox email testing API.

### Features

- **Inbox Operations**
  - `inbox.waitForNew()` - Poll for new emails with configurable timeout (ideal for E2E tests)
  - `inbox.latest()` - Get the most recent inbox email
  - `inbox.get()` - Retrieve a single email by ID
  - `inbox.list()` - List inbox email IDs with pagination and filters

- **Sent Operations**
  - `sent.latest()` - Get the most recent sent email
  - `sent.get()` - Retrieve a single sent email by ID
  - `sent.list()` - List sent email IDs with pagination and filters

- **Core Features**
  - Automatic OTP detection (`detected_otp` field)
  - Full TypeScript support with exported types
  - ESM and CommonJS dual package support
  - Query filters: `from`, `to`, `subject`, `before`, `after`
  - Page-based pagination

- **Error Handling**
  - `AuthenticationError` - Invalid or missing API key (401)
  - `ValidationError` - Invalid request parameters (400)
  - `RateLimitError` - Too many requests (429)
  - `NetworkError` - Network connectivity issues
  - `TimeoutError` - Request timeout exceeded
