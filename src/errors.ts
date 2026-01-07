/**
 * Base error class for SigninID SDK
 */
export class SigninIDError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "SigninIDError";
  }
}

/**
 * Thrown when API key is missing or invalid
 */
export class AuthenticationError extends SigninIDError {
  constructor(message = "Invalid API key") {
    super("UNAUTHORIZED", message, 401);
    this.name = "AuthenticationError";
  }
}

/**
 * Thrown when request parameters are invalid
 */
export class ValidationError extends SigninIDError {
  constructor(
    message: string,
    public readonly details?: unknown
  ) {
    super("INVALID_REQUEST", message, 400);
    this.name = "ValidationError";
  }
}

/**
 * Thrown when a network error occurs
 */
export class NetworkError extends SigninIDError {
  constructor(message = "Network error occurred") {
    super("NETWORK_ERROR", message, 0);
    this.name = "NetworkError";
  }
}

/**
 * Thrown when request times out
 */
export class TimeoutError extends SigninIDError {
  constructor(message = "Request timed out") {
    super("TIMEOUT", message, 0);
    this.name = "TimeoutError";
  }
}

/**
 * Thrown when rate limit is exceeded
 */
export class RateLimitError extends SigninIDError {
  constructor(
    message = "Rate limit exceeded",
    public readonly retryAfter: number | null = null
  ) {
    super("RATE_LIMITED", message, 429);
    this.name = "RateLimitError";
  }
}
