/**
 * Spam verdict values
 */
export type SpamVerdict = "PASS" | "FAIL" | "GRAY" | null;

/**
 * Security verdict values (AWS SES)
 */
export type SecurityVerdict = "PASS" | "FAIL" | "GRAY" | "PROCESSING_FAILED" | null;

/**
 * Client initialization options
 */
export interface SigninIDOptions {
  /** Secret key (reads from SIGNINID_SECRET_KEY env var if not provided) */
  secretKey?: string;
  /** Custom base URL */
  baseUrl?: string;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
}

/**
 * Query parameters for latest endpoint
 */
export interface LatestEmailParams {
  /** Filter by recipient email address (partial match) */
  to?: string;
  /** Only return emails received after this timestamp (ISO 8601 or Date) */
  after?: Date | string;
}

/**
 * Query parameters for waitForNew
 */
export interface WaitForNewParams {
  /** Filter by recipient email address (partial match) */
  to?: string;
  /** Maximum wait time in milliseconds (default: 30000) */
  timeout?: number;
}

/**
 * Query parameters for list endpoints (page-based pagination)
 */
export interface ListEmailsParams {
  /** Page number (1, 2, 3..., default: 1) */
  page?: number;
  /** Results per page (1-100, default: 10) */
  per_page?: number;
  /** Filter by sender email address (partial match) */
  from?: string;
  /** Filter by recipient email address (partial match) */
  to?: string;
  /** Filter by subject (partial match) */
  subject?: string;
  /** Return emails before this date */
  before?: Date | string;
  /** Return emails after this date */
  after?: Date | string;
}

/**
 * Spam rule details
 */
export interface SpamRule {
  name: string;
  score: number;
  description?: string;
}

/**
 * Spam rules analysis
 */
export interface SpamRules {
  simple: SpamRule[];
  rspamd: SpamRule[];
}

/**
 * Single inbox email response (without server_id)
 * Returned by latest() and get() methods
 */
export interface InboxEmail {
  email_id: string;
  from_address: string;
  from_name: string | null;
  to_addresses: string[];
  cc_addresses: string[] | null;
  subject: string | null;
  received_at: string;
  message_id: string | null;
  has_attachments: boolean;
  attachment_count: number;
  // Spam analysis
  spam_score: number | null;
  spam_verdict: SpamVerdict;
  spam_rules: SpamRules | null;
  // AWS SES verdicts
  virus_verdict: SecurityVerdict;
  spf_verdict: SecurityVerdict;
  dkim_verdict: SecurityVerdict;
  dmarc_verdict: SecurityVerdict;
  // Content
  detected_otp: string | null;
  html_body: string | null;
  text_body: string | null;
}

/**
 * Single sent email response (without server_id)
 * Returned by latest() and get() methods
 */
export interface SentEmail {
  email_id: string;
  from_address: string;
  from_name: string | null;
  to_addresses: string[];
  cc_addresses: string[] | null;
  bcc_addresses: string[] | null;
  subject: string | null;
  sent_at: string;
  message_id: string | null;
  has_attachments: boolean;
  attachment_count: number;
  // Spam analysis
  spam_score: number | null;
  spam_verdict: SpamVerdict;
  // Content
  detected_otp: string | null;
  html_body: string | null;
  text_body: string | null;
}

/**
 * Page-based pagination metadata
 */
export interface Pagination {
  page: number;
  per_page: number;
  returned: number;
  has_more: boolean;
}

/**
 * List response returning only email IDs
 */
export interface ListIdsResponse {
  data: string[];
  pagination: Pagination;
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
