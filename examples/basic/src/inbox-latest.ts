/**
 * Example: Get the latest inbox email
 *
 * This is the simplest way to retrieve the most recent email
 * received in your SigninID inbox.
 *
 * Usage:
 *   npm run build
 *   npm run inbox:latest
 */

import dotenv from "dotenv";
import { SigninID } from "signinid";

dotenv.config({ path: ".env", quiet: true });
dotenv.config({ path: ".env.local", override: true, quiet: true });

async function main() {
  // Create client (reads SIGNINID_SECRET_KEY from environment)
  const client = new SigninID();

  // Get the latest inbox email
  const email = await client.inbox.latest();

  if (email) {
    console.log("=== Latest Inbox Email ===");
    console.log("Email ID:", email.email_id);
    console.log("From:", email.from_name ?? email.from_address);
    console.log("To:", email.to_addresses.join(", "));
    console.log("Subject:", email.subject);
    console.log("Received:", email.received_at);
    console.log("");

    // OTP detection - useful for verification emails
    if (email.detected_otp) {
      console.log("Detected OTP:", email.detected_otp);
    }

    // Spam analysis
    console.log("Spam Score:", email.spam_score);
    console.log("Spam Verdict:", email.spam_verdict);

    // Email body preview
    if (email.text_body) {
      console.log("");
      console.log("=== Body Preview ===");
      console.log(email.text_body.slice(0, 200) + "...");
    }
  } else {
    console.log("No emails found in inbox.");
  }
}

main().catch(console.error);
