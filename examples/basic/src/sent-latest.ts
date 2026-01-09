/**
 * Example: Get the latest sent email
 *
 * View emails that were sent through your SMTP server.
 * Useful for verifying that your application is sending
 * emails correctly.
 *
 * Usage:
 *   npm run build
 *   npm run sent:latest
 */

import dotenv from "dotenv";
import { SigninID } from "signinid";

dotenv.config({ path: ".env", quiet: true });
dotenv.config({ path: ".env.local", override: true, quiet: true });

async function main() {
  const client = new SigninID();

  // Get the latest sent email
  const email = await client.sent.latest();

  if (email) {
    console.log("=== Latest Sent Email ===");
    console.log("Email ID:", email.email_id);
    console.log("From:", email.from_name ?? email.from_address);
    console.log("To:", email.to_addresses.join(", "));
    if (email.cc_addresses?.length) {
      console.log("CC:", email.cc_addresses.join(", "));
    }
    if (email.bcc_addresses?.length) {
      console.log("BCC:", email.bcc_addresses.join(", "));
    }
    console.log("Subject:", email.subject);
    console.log("Sent:", email.sent_at);
    console.log("");

    // Spam analysis - check if your emails might be flagged as spam
    console.log("=== Spam Analysis ===");
    console.log("Spam Score:", email.spam_score);
    console.log("Spam Verdict:", email.spam_verdict);

    // OTP detection
    if (email.detected_otp) {
      console.log("");
      console.log("Detected OTP:", email.detected_otp);
    }

    // Email body preview
    if (email.text_body) {
      console.log("");
      console.log("=== Body Preview ===");
      console.log(email.text_body.slice(0, 200) + "...");
    }
  } else {
    console.log("No sent emails found.");
  }
}

main().catch(console.error);
