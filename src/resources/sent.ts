import type { SigninID } from "../client";
import type {
  LatestEmailParams,
  ListEmailsParams,
  ListIdsResponse,
  SentEmail,
} from "../types";

/**
 * Sent email operations
 */
export class SentResource {
  constructor(private readonly client: SigninID) {}

  /**
   * Get the most recent sent email
   *
   * @param params - Optional filter by recipient
   * @returns The latest sent email, or null if none exists
   *
   * @example
   * ```typescript
   * // Get the latest sent email
   * const email = await client.sent.latest();
   * if (email) {
   *   console.log(email.detected_otp);
   * }
   *
   * // Get the latest sent email for a specific recipient
   * const email = await client.sent.latest({ to: 'user@test.com' });
   * ```
   */
  async latest(params?: LatestEmailParams): Promise<SentEmail | null> {
    return this.client.request<SentEmail | null>(
      "/v1/sent/latest",
      params ? { to: params.to } : undefined
    );
  }

  /**
   * Get a single sent email by ID
   *
   * @param emailId - The email ID to retrieve
   * @returns The sent email
   * @throws NotFoundError if email not found
   *
   * @example
   * ```typescript
   * const email = await client.sent.get('550e8400-e29b-41d4-a716-446655440000');
   * console.log(email.subject);
   * ```
   */
  async get(emailId: string): Promise<SentEmail> {
    return this.client.request<SentEmail>(
      `/v1/sent/${encodeURIComponent(emailId)}`
    );
  }

  /**
   * List sent email IDs with pagination
   *
   * @param params - Query parameters for filtering and pagination
   * @returns List of email IDs with pagination info
   *
   * @example
   * ```typescript
   * // Get first page of email IDs
   * const { data: emailIds } = await client.sent.list();
   *
   * // Get sent emails with filters and pagination
   * const response = await client.sent.list({
   *   to: 'recipient@example.com',
   *   page: 2,
   *   per_page: 20,
   * });
   *
   * // Fetch full email details for each ID
   * for (const id of response.data) {
   *   const email = await client.sent.get(id);
   *   console.log(email.subject);
   * }
   * ```
   */
  async list(params?: ListEmailsParams): Promise<ListIdsResponse> {
    return this.client.request<ListIdsResponse>(
      "/v1/sent",
      this.serializeParams(params)
    );
  }

  /**
   * Serialize query parameters
   */
  private serializeParams(
    params?: ListEmailsParams
  ): Record<string, unknown> | undefined {
    if (!params) return undefined;

    return {
      ...params,
      before:
        params.before instanceof Date
          ? params.before.toISOString()
          : params.before,
      after:
        params.after instanceof Date
          ? params.after.toISOString()
          : params.after,
    };
  }
}
