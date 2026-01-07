import type { SigninID } from "../client";
import type {
  LatestEmailParams,
  ListEmailsParams,
  ListIdsResponse,
  InboxEmail,
  WaitForNewParams,
} from "../types";

/**
 * Inbox email operations
 */
export class InboxResource {
  constructor(private readonly client: SigninID) {}

  /**
   * Get the most recent inbox email
   *
   * @param params - Optional filter by recipient
   * @returns The latest inbox email, or null if none exists
   *
   * @example
   * ```typescript
   * // Get the latest email
   * const email = await client.inbox.latest();
   * if (email) {
   *   console.log(email.detected_otp);
   * }
   *
   * // Get the latest email for a specific recipient
   * const email = await client.inbox.latest({ to: 'user@test.com' });
   * ```
   */
  async latest(params?: LatestEmailParams): Promise<InboxEmail | null> {
    if (!params) {
      return this.client.request<InboxEmail | null>("/api/v1/inbox/latest");
    }

    const queryParams: Record<string, string> = {};
    if (params.to) {
      queryParams.to = params.to;
    }
    if (params.after) {
      queryParams.after =
        params.after instanceof Date
          ? params.after.toISOString()
          : params.after;
    }

    return this.client.request<InboxEmail | null>(
      "/api/v1/inbox/latest",
      Object.keys(queryParams).length > 0 ? queryParams : undefined
    );
  }

  /**
   * Wait for a new email to arrive
   *
   * Polls the inbox until a new email arrives or timeout is reached.
   * Useful for testing signup/login flows where you need to wait for
   * a verification email.
   *
   * @param params - Optional filter and timeout settings
   * @returns The new inbox email, or null if timeout is reached
   *
   * @example
   * ```typescript
   * // Wait for a new email (default 30s timeout)
   * const email = await client.inbox.waitForNew({
   *   to: 'user@test.com',
   * });
   *
   * if (email) {
   *   console.log('OTP:', email.detected_otp);
   * }
   *
   * // Custom timeout
   * const email = await client.inbox.waitForNew({
   *   to: 'user@test.com',
   *   timeout: 60000, // 60 seconds
   * });
   * ```
   */
  async waitForNew(params?: WaitForNewParams): Promise<InboxEmail | null> {
    const timeout = params?.timeout ?? 30000;
    const startTime = new Date().toISOString();
    const deadline = Date.now() + timeout;

    while (Date.now() < deadline) {
      const email = await this.latest({
        to: params?.to,
        after: startTime,
      });

      if (email) {
        return email;
      }

      // Wait 1 second before next poll
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return null; // Timeout - no new email
  }

  /**
   * Get a single inbox email by ID
   *
   * @param emailId - The email ID to retrieve
   * @returns The inbox email
   * @throws NotFoundError if email not found
   *
   * @example
   * ```typescript
   * const email = await client.inbox.get('550e8400-e29b-41d4-a716-446655440000');
   * console.log(email.subject);
   * ```
   */
  async get(emailId: string): Promise<InboxEmail> {
    return this.client.request<InboxEmail>(
      `/api/v1/inbox/${encodeURIComponent(emailId)}`
    );
  }

  /**
   * List inbox email IDs with pagination
   *
   * @param params - Query parameters for filtering and pagination
   * @returns List of email IDs with pagination info
   *
   * @example
   * ```typescript
   * // Get first page of email IDs
   * const { data: emailIds } = await client.inbox.list();
   *
   * // Get emails with filters and pagination
   * const response = await client.inbox.list({
   *   to: 'test@example.com',
   *   page: 2,
   *   per_page: 20,
   * });
   *
   * // Fetch full email details for each ID
   * for (const id of response.data) {
   *   const email = await client.inbox.get(id);
   *   console.log(email.subject);
   * }
   * ```
   */
  async list(params?: ListEmailsParams): Promise<ListIdsResponse> {
    return this.client.request<ListIdsResponse>(
      "/api/v1/inbox",
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
