export const ErrorCodeEnum = {
    // Auth Errors
    AUTH_EMAIL_ALREADY_EXISTS: "AUTH_EMAIL_ALREADY_EXISTS",
    AUTH_EMAIL_NOT_EXISTS:"AUTH_EMAIL_NOT_EXISTS",
    INCORRECT_PASSWORD:"INCORRECT_PASSWORD",
    AUTH_INVALID_TOKEN: "AUTH_INVALID_TOKEN",
    AUTH_USER_NOT_FOUND: "AUTH_USER_NOT_FOUND",
    AUTH_NOT_FOUND: "AUTH_NOT_FOUND",
    AUTH_TOO_MANY_ATTEMPTS: "AUTH_TOO_MANY_ATTEMPTS",
    AUTH_UNAUTHORIZED_ACCESS: "AUTH_UNAUTHORIZED_ACCESS",
    AUTH_TOKEN_NOT_FOUND: "AUTH_TOKEN_NOT_FOUND",
  
    // Access Control
    ACCESS_UNAUTHORIZED: "ACCESS_UNAUTHORIZED",
    ACCESS_FORBIDDEN: "ACCESS_FORBIDDEN",
  
    // Validation & Resources
    VALIDATION_ERROR: "VALIDATION_ERROR",
    RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
    DUPLICATE_RESOURCE: "DUPLICATE_RESOURCE",
    ALREADY_BOOKED: "ALREADY_BOOKED",
  
    // Server Errors
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
    SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  } as const;
  
  export type ErrorCodeEnumType = keyof typeof ErrorCodeEnum;
  
  export const ErrorMessageMap: Record<ErrorCodeEnumType, string> = {
    AUTH_EMAIL_ALREADY_EXISTS: "Email is already registered.",
    AUTH_EMAIL_NOT_EXISTS:"Email doesn't exists",
    INCORRECT_PASSWORD:"please enter valid email or password",
    AUTH_INVALID_TOKEN: "Token is invalid or expired.",
    AUTH_USER_NOT_FOUND: "User not found.",
    AUTH_NOT_FOUND: "Authentication record not found.",
    AUTH_TOO_MANY_ATTEMPTS: "Too many login attempts. Try again later.",
    AUTH_UNAUTHORIZED_ACCESS: "Unauthorized access.",
    AUTH_TOKEN_NOT_FOUND: "Refresh token not found.",
  
    ACCESS_UNAUTHORIZED: "Access denied.",
    ACCESS_FORBIDDEN: "You do not have permission to perform this action.",
  
    VALIDATION_ERROR: "Validation failed.",
    RESOURCE_NOT_FOUND: "The requested resource was not found.",
    DUPLICATE_RESOURCE: "Duplicate resource exists.",
    ALREADY_BOOKED:"you have already booked",
    
    INTERNAL_SERVER_ERROR: "Internal server error occurred.",
    SERVICE_UNAVAILABLE: "Service is temporarily unavailable.",
  };
  