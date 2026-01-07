// Main client
export { SigninID } from "./client";

// Types
export type {
  SigninIDOptions,
  ListEmailsParams,
  InboxEmail,
  SentEmail,
  ListResponse,
  Pagination,
  SpamRule,
  SpamRules,
  SpamVerdict,
  SecurityVerdict,
} from "./types";

// Errors
export {
  SigninIDError,
  AuthenticationError,
  ValidationError,
  NetworkError,
  TimeoutError,
  RateLimitError,
} from "./errors";

// Resources (for advanced usage)
export { InboxResource } from "./resources/inbox";
export { SentResource } from "./resources/sent";
