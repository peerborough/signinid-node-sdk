# SigninID Node.js SDK

Node.js SDK for the SigninID sandbox email testing API. Capture and inspect test emails with automatic OTP detection.

## Installation

```bash
npm install signinid
```

## Quick Start

```typescript
import { SigninID } from 'signinid';

const client = new SigninID('sk_live_...');

// Get the latest inbox email
const { data: [email] } = await client.inbox.list();

if (email) {
  console.log('From:', email.from_address);
  console.log('Subject:', email.subject);
  console.log('OTP:', email.detected_otp);
}
```

## Features

- Full TypeScript support
- Automatic OTP detection
- Filter emails by sender, recipient, subject, and date
- ESM and CommonJS support

## Usage

### Initialize Client

```typescript
import { SigninID } from 'signinid';

// Production (default)
const client = new SigninID('sk_live_...');

// Sandbox environment
const sandbox = new SigninID('sk_live_...', {
  environment: 'sandbox',
});

// Custom configuration
const custom = new SigninID('sk_live_...', {
  baseUrl: 'https://custom.example.com',
  timeout: 60000, // 60 seconds
});
```

### List Inbox Emails

```typescript
// Get the latest email
const { data: [latest] } = await client.inbox.list();

// Get multiple emails with filters
const response = await client.inbox.list({
  limit: 10,
  to: 'test@example.com',
  subject: 'verification',
  after: new Date('2024-01-01'),
});

for (const email of response.data) {
  console.log(email.subject, email.detected_otp);
}

// Check if there are more emails
if (response.pagination.has_more) {
  // Fetch next page...
}
```

### List Sent Emails

```typescript
// Get sent emails
const response = await client.sent.list({
  limit: 5,
  to: 'recipient@example.com',
});
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | number | Results to return (1-100, default: 1) |
| `from` | string | Filter by sender (partial match) |
| `to` | string | Filter by recipient (partial match) |
| `subject` | string | Filter by subject (partial match) |
| `before` | Date \| string | Emails before this date |
| `after` | Date \| string | Emails after this date |

### Error Handling

```typescript
import { SigninID, AuthenticationError, ValidationError } from 'signinid';

try {
  const response = await client.inbox.list();
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API key');
  } else if (error instanceof ValidationError) {
    console.error('Invalid parameters:', error.details);
  } else {
    throw error;
  }
}
```

## Email Response Fields

### Inbox Email

| Field | Type | Description |
|-------|------|-------------|
| `email_id` | string | Unique email ID |
| `from_address` | string | Sender email |
| `from_name` | string \| null | Sender name |
| `to_addresses` | string[] | Recipient emails |
| `subject` | string \| null | Email subject |
| `received_at` | string | ISO timestamp |
| `detected_otp` | string \| null | Auto-detected OTP code |
| `html_body` | string \| null | HTML content |
| `text_body` | string \| null | Plain text content |
| `has_attachments` | boolean | Has attachments |
| `spam_score` | number \| null | Spam score |
| `spam_verdict` | string \| null | PASS, SOFT_FAIL, FAIL |

### Sent Email

Same as inbox, with additional:

| Field | Type | Description |
|-------|------|-------------|
| `bcc_addresses` | string[] \| null | BCC recipients |
| `sent_at` | string | ISO timestamp (instead of received_at) |

## Requirements

- Node.js 18 or later

## License

MIT
