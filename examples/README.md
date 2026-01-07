# SigninID SDK Examples

Example projects demonstrating how to use the SigninID Node.js SDK.

## Prerequisites

1. Node.js 18 or higher
2. A SigninID account with an API key

## Setup

```bash
# Navigate to the basic example
cd examples/basic

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env and add your API key
# SIGNINID_SECRET_KEY=sk_live_your_key_here

# Build the examples
npm run build
```

## Running Examples

### Get Latest Inbox Email

Basic usage showing how to retrieve the most recent email.

```bash
npm run inbox:latest
```

### Wait for New Email (Polling)

Useful for E2E testing - waits for a new email to arrive.

```bash
npm run inbox:wait

# Or with a specific recipient filter:
npm run inbox:wait -- test@your-server.signinid.com
```

### List Inbox Emails

Shows pagination and fetching multiple emails.

```bash
npm run inbox:list
```

### Get Latest Sent Email

View emails sent through your SMTP server.

```bash
npm run sent:latest
```

### Error Handling

Demonstrates handling different error types.

```bash
npm run error
```

## Example Files

| File | Description |
|------|-------------|
| `src/inbox-latest.ts` | Get the most recent inbox email |
| `src/inbox-wait.ts` | Poll for new emails (E2E testing) |
| `src/inbox-list.ts` | List and paginate through emails |
| `src/sent-latest.ts` | Get the most recent sent email |
| `src/error-handling.ts` | Handle SDK errors properly |

## Common Patterns

### E2E Test Flow

```typescript
import { SigninID } from 'signinid';

const client = new SigninID();

// 1. Trigger signup in your app (sends verification email)
await page.fill('[name="email"]', 'test@your-server.signinid.com');
await page.click('button[type="submit"]');

// 2. Wait for the verification email
const email = await client.inbox.waitForNew({
  to: 'test@your-server.signinid.com',
  timeout: 30000
});

// 3. Use the OTP to complete verification
if (email?.detected_otp) {
  await page.fill('[name="otp"]', email.detected_otp);
  await page.click('button[type="submit"]');
}
```

### Filtering Emails

```typescript
// Filter by sender
const emails = await client.inbox.list({ from: 'noreply@myapp.com' });

// Filter by subject
const emails = await client.inbox.list({ subject: 'verification' });

// Filter by date range
const emails = await client.inbox.list({
  after: new Date('2024-01-01'),
  before: new Date('2024-12-31')
});
```
