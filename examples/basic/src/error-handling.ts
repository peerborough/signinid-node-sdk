/**
 * Example: Error handling
 *
 * Shows how to handle different types of errors that
 * the SDK might throw.
 *
 * Usage:
 *   npm run build
 *   npm run error
 */

import dotenv from "dotenv";
import {
  SigninID,
  SigninIDError,
  AuthenticationError,
} from "signinid";

dotenv.config({ path: ".env", quiet: true });
dotenv.config({ path: ".env.local", override: true, quiet: true });

async function demonstrateAuthError() {
  console.log("=== Authentication Error ===");
  try {
    // Using an invalid API key
    const client = new SigninID({ secretKey: "sk_live_invalid_key" });
    await client.inbox.latest();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.log("Caught AuthenticationError:");
      console.log("  Code:", error.code);
      console.log("  Message:", error.message);
      console.log("  Status:", error.status);
    }
  }
  console.log("");
}

async function demonstrateNotFoundError() {
  console.log("=== Not Found Error ===");
  try {
    const client = new SigninID();
    // Try to get a non-existent email
    await client.inbox.get("00000000-0000-0000-0000-000000000000");
  } catch (error) {
    if (error instanceof SigninIDError) {
      console.log("Caught SigninIDError:");
      console.log("  Code:", error.code);
      console.log("  Message:", error.message);
      console.log("  Status:", error.status);
    }
  }
  console.log("");
}

async function demonstrateErrorTypes() {
  console.log("=== Error Types Summary ===");
  console.log("");
  console.log("SigninIDError     - Base class for all SDK errors");
  console.log("AuthenticationError - Invalid or missing API key (401)");
  console.log("ValidationError   - Invalid request parameters (400)");
  console.log("NetworkError      - Network connectivity issues");
  console.log("TimeoutError      - Request timeout exceeded");
  console.log("RateLimitError    - Too many requests (429)");
  console.log("");
  console.log("All errors have: code, message, status properties");
  console.log("RateLimitError also has: retryAfter (seconds to wait)");
}

async function main() {
  await demonstrateAuthError();
  await demonstrateNotFoundError();
  await demonstrateErrorTypes();
}

main().catch(console.error);
