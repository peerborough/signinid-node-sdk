/**
 * Example: Wait for a new email (polling)
 *
 * This is useful for E2E testing when you need to wait for
 * a verification email after triggering a signup or login flow.
 *
 * Usage:
 *   npm run build
 *   npm run inbox:wait <email>
 *
 * Example:
 *   npm run inbox:wait test@your-server.signinid.com
 */

import dotenv from "dotenv";
import { SigninID } from "signinid";

dotenv.config({ path: ".env", quiet: true });
dotenv.config({ path: ".env.local", override: true, quiet: true });

async function main() {
  const testEmail = process.argv[2];

  if (!testEmail) {
    console.error("Error: Email address is required.");
    console.error("");
    console.error("Usage: npm run inbox:wait <email>");
    console.error("Example: npm run inbox:wait test@your-server.signinid.com");
    process.exit(1);
  }

  const client = new SigninID();

  console.log(`Waiting for new email to: ${testEmail}`);
  console.log("Timeout: 30 seconds");
  console.log("Polling...");

  // Wait for a new email (polls every 1 second)
  const email = await client.inbox.waitForNew({
    to: testEmail,
    timeout: 30000, // 30 seconds
  });

  if (email) {
    console.log("");
    console.log("=== New Email Received! ===");
    console.log("Email ID:", email.email_id);
    console.log("From:", email.from_address);
    console.log("Subject:", email.subject);
    console.log("Received:", email.received_at);

    if (email.detected_otp) {
      console.log("");
      console.log("Detected OTP:", email.detected_otp);
      console.log("Use this OTP to complete verification in your test.");
    }
  } else {
    console.log("");
    console.log("Timeout: No new email received within 30 seconds.");
  }
}

main().catch(console.error);
