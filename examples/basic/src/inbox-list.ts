/**
 * Example: List inbox emails with pagination
 *
 * Shows how to list email IDs and then fetch full details
 * for each email. Useful for browsing or processing multiple emails.
 *
 * Usage:
 *   npm run build
 *   npm run inbox:list
 */

import { SigninID } from "signinid";

async function main() {
  const client = new SigninID();

  // List first 5 email IDs
  console.log("=== Fetching Inbox Emails ===");
  const { data: ids, pagination } = await client.inbox.list({
    per_page: 5,
  });

  console.log(`Found ${pagination.returned} emails (has_more: ${pagination.has_more})`);
  console.log("");

  // Fetch and display each email
  for (const id of ids) {
    const email = await client.inbox.get(id);

    const from = email.from_name
      ? `${email.from_name} <${email.from_address}>`
      : email.from_address;

    console.log(`[${email.email_id.slice(0, 8)}...] ${email.subject}`);
    console.log(`  From: ${from}`);
    console.log(`  To: ${email.to_addresses.join(", ")}`);
    console.log(`  Received: ${email.received_at}`);
    if (email.detected_otp) {
      console.log(`  OTP: ${email.detected_otp}`);
    }
    console.log("");
  }

  // Show pagination info
  if (pagination.has_more) {
    console.log("---");
    console.log("More emails available. Use page parameter to fetch more:");
    console.log("  client.inbox.list({ page: 2, per_page: 5 })");
  }
}

main().catch(console.error);
