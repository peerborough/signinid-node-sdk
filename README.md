# SigninID Node.js SDK

Node.js SDK for the SigninID sandbox email testing API. Capture and inspect test emails with automatic OTP detection.

## Installation

```bash
npm install signinid
```

## Quick Start

```typescript
import { SigninID } from 'signinid';

// Set SIGNINID_SECRET_KEY environment variable
const client = new SigninID();

// Wait for a new verification email to arrive
const email = await client.inbox.waitForNew({ to: 'user@test.com' });

// Extract the OTP
if (email) {
  console.log('Verification code:', email.detected_otp);
}
```

## Features

- Full TypeScript support
- Automatic OTP detection
- Polling support for E2E tests (`waitForNew`)
- Filter emails by sender, recipient, subject, and date
- Page-based pagination
- ESM and CommonJS support

## API Reference

### Constructor

```typescript
import { SigninID } from 'signinid';

const client = new SigninID(options?: SigninIDOptions);
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `secretKey` | string | `process.env.SIGNINID_SECRET_KEY` | API secret key (must start with `sk_live_`) |
| `timeout` | number | `30000` | Request timeout in milliseconds |

### Inbox Methods

#### `inbox.waitForNew(params?)`

Wait for a new email to arrive. Polls until a new email arrives or timeout is reached.

```typescript
const email = await client.inbox.waitForNew({
  to: 'user@test.com',
  timeout: 30000  // 30 seconds (default)
});

if (email) {
  console.log('OTP:', email.detected_otp);
}
```

#### `inbox.latest(params?)`

Get the most recent inbox email.

```typescript
const email = await client.inbox.latest();

// With filters
const email = await client.inbox.latest({
  to: 'user@test.com',
  after: new Date('2024-01-01')
});
```

#### `inbox.get(emailId)`

Get a single email by ID.

```typescript
const email = await client.inbox.get('550e8400-e29b-41d4-a716-446655440000');
```

#### `inbox.list(params?)`

List inbox email IDs with pagination.

```typescript
const { data: ids, pagination } = await client.inbox.list({
  page: 1,
  per_page: 10,
  to: 'user@test.com',
  from: 'noreply@app.com',
  subject: 'verification',
  after: new Date('2024-01-01'),
  before: new Date('2024-12-31')
});

// Fetch full details for each email
for (const id of ids) {
  const email = await client.inbox.get(id);
  console.log(email.subject);
}

// Check pagination
console.log('Has more:', pagination.has_more);
```

### Sent Methods

#### `sent.latest(params?)`

Get the most recent sent email.

```typescript
const email = await client.sent.latest();
```

#### `sent.get(emailId)`

Get a single sent email by ID.

```typescript
const email = await client.sent.get('550e8400-e29b-41d4-a716-446655440000');
```

#### `sent.list(params?)`

List sent email IDs with pagination.

```typescript
const { data: ids, pagination } = await client.sent.list({
  page: 1,
  per_page: 10,
  to: 'user@example.com'
});
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `per_page` | number | Results per page (1-100, default: 10) |
| `from` | string | Filter by sender (partial match) |
| `to` | string | Filter by recipient (partial match) |
| `subject` | string | Filter by subject (partial match) |
| `before` | Date \| string | Emails before this date |
| `after` | Date \| string | Emails after this date |

## Types

### InboxEmail

```typescript
interface InboxEmail {
  email_id: string;
  from_address: string;
  from_name: string | null;
  to_addresses: string[];
  cc_addresses: string[] | null;
  subject: string | null;
  received_at: string;
  message_id: string | null;
  has_attachments: boolean;
  attachment_count: number;
  spam_score: number | null;
  spam_verdict: 'PASS' | 'FAIL' | 'GRAY' | null;
  virus_verdict: string | null;
  spf_verdict: string | null;
  dkim_verdict: string | null;
  dmarc_verdict: string | null;
  detected_otp: string | null;
  html_body: string | null;
  text_body: string | null;
}
```

### SentEmail

```typescript
interface SentEmail {
  email_id: string;
  from_address: string;
  from_name: string | null;
  to_addresses: string[];
  cc_addresses: string[] | null;
  bcc_addresses: string[] | null;
  subject: string | null;
  sent_at: string;
  message_id: string | null;
  has_attachments: boolean;
  attachment_count: number;
  spam_score: number | null;
  spam_verdict: 'PASS' | 'FAIL' | 'GRAY' | null;
  detected_otp: string | null;
  html_body: string | null;
  text_body: string | null;
}
```

## Error Handling

```typescript
import {
  SigninID,
  SigninIDError,
  AuthenticationError,
  ValidationError,
  NetworkError,
  TimeoutError,
  RateLimitError
} from 'signinid';

try {
  const email = await client.inbox.latest();
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API key');
  } else if (error instanceof ValidationError) {
    console.error('Invalid parameters:', error.details);
  } else if (error instanceof RateLimitError) {
    console.error('Rate limited. Retry after:', error.retryAfter, 'seconds');
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  } else if (error instanceof TimeoutError) {
    console.error('Request timed out');
  } else {
    throw error;
  }
}
```

### Error Types

| Error | Status | Description |
|-------|--------|-------------|
| `AuthenticationError` | 401 | Invalid or missing API key |
| `ValidationError` | 400 | Invalid request parameters |
| `RateLimitError` | 429 | Too many requests |
| `NetworkError` | - | Network connectivity issue |
| `TimeoutError` | - | Request timeout exceeded |

## Examples

See the [examples](./examples) directory for runnable examples:

```bash
cd examples/basic
npm install
npm run build

# Run examples
npm run inbox:latest
npm run inbox:wait
npm run inbox:list
npm run sent:latest
npm run error
```

## E2E Testing Example

```typescript
import { test, expect } from '@playwright/test';
import { SigninID } from 'signinid';

test('signup with email verification', async ({ page }) => {
  const client = new SigninID();
  const testEmail = `test-${Date.now()}@your-server.signinid.com`;

  // Fill signup form
  await page.goto('/signup');
  await page.fill('[name="email"]', testEmail);
  await page.click('button[type="submit"]');

  // Wait for verification email
  const email = await client.inbox.waitForNew({
    to: testEmail,
    timeout: 30000
  });

  expect(email).not.toBeNull();
  expect(email!.detected_otp).toBeDefined();

  // Enter OTP
  await page.fill('[name="otp"]', email!.detected_otp!);
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/dashboard');
});
```

## Requirements

- Node.js 18 or later

## License

MIT
