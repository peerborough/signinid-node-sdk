import type { SigninIDOptions, ApiErrorResponse } from "./types";
import {
  SigninIDError,
  AuthenticationError,
  ValidationError,
  NetworkError,
  TimeoutError,
  RateLimitError,
} from "./errors";
import { InboxResource } from "./resources/inbox";
import { SentResource } from "./resources/sent";

/**
 * Default API base URL
 */
const DEFAULT_BASE_URL = "https://app.signinid.com";

/**
 * SigninID API client
 *
 * @example
 * ```typescript
 * const client = new SigninID({ secretKey: 'sk_live_...' });
 *
 * // Get latest inbox email
 * const { data: [email] } = await client.inbox.list({ limit: 1 });
 * console.log('OTP:', email?.detected_otp);
 * ```
 */
export class SigninID {
  private readonly secretKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;

  /** Inbox email operations */
  public readonly inbox: InboxResource;
  /** Sent email operations */
  public readonly sent: SentResource;

  /**
   * Create a new SigninID client
   *
   * @param options - Client configuration options
   */
  constructor(options?: SigninIDOptions) {
    const resolvedSecretKey = options?.secretKey ?? process.env.SIGNINID_SECRET_KEY;

    if (!resolvedSecretKey) {
      throw new AuthenticationError(
        "Secret key is required. Provide it in options or set SIGNINID_SECRET_KEY environment variable."
      );
    }

    if (!resolvedSecretKey.startsWith("sk_live_")) {
      throw new AuthenticationError(
        "Invalid secret key format. Secret key must start with 'sk_live_'"
      );
    }

    this.secretKey = resolvedSecretKey;
    this.baseUrl = options?.baseUrl ?? DEFAULT_BASE_URL;
    this.timeout = options?.timeout ?? 30000;

    this.inbox = new InboxResource(this);
    this.sent = new SentResource(this);
  }

  /**
   * Make an API request
   * @internal
   */
  async request<T>(
    path: string,
    params?: Record<string, unknown>
  ): Promise<T> {
    const url = new URL(path, this.baseUrl);

    // Add query params
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          "Content-Type": "application/json",
          "User-Agent": "signinid-node/0.1.0",
        },
        signal: AbortSignal.timeout(this.timeout),
      });

      const body = await response.json();

      if (!response.ok) {
        const errorBody = body as ApiErrorResponse;
        const code = errorBody.error?.code ?? "UNKNOWN_ERROR";
        const message = errorBody.error?.message ?? "An unknown error occurred";

        if (response.status === 401) {
          throw new AuthenticationError(message);
        }

        if (response.status === 400) {
          throw new ValidationError(message, errorBody.error?.details);
        }

        if (response.status === 429) {
          const details = errorBody.error?.details;
          const retryAfter =
            typeof details === "object" && details !== null && "retry_after" in details
              ? (details.retry_after as number)
              : null;
          throw new RateLimitError(message, retryAfter);
        }

        throw new SigninIDError(code, message, response.status);
      }

      return body as T;
    } catch (error) {
      // Re-throw SDK errors
      if (error instanceof SigninIDError) {
        throw error;
      }

      // Handle timeout
      if (error instanceof Error && error.name === "TimeoutError") {
        throw new TimeoutError();
      }

      // Handle network errors
      if (error instanceof TypeError) {
        throw new NetworkError(error.message);
      }

      // Unknown error
      throw new NetworkError(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
}
