/**
 * Example: Wait for a new email (polling)
 *
 * This is useful for E2E testing when you need to wait for
 * a verification email after triggering a signup or login flow.
 *
 * Usage:
 *   npm run build
 *   npm run inbox:wait
 */

import { SigninID } from "signinid";

async function main() {
  const client = new SigninID();

  // The recipient email to filter by
  // Replace with your test email address
  const testEmail = process.argv[2] || "test@your-server.signinid.com";

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
