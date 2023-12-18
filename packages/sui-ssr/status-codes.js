export const statusCodes = {
  MOVED_PERMANENTLY: 301,
  FOUND: 302
}

export const DEFAULT_REDIRECT_STATUS_CODE = statusCodes.MOVED_PERMANENTLY

export const redirectStatusCodes = [statusCodes.MOVED_PERMANENTLY, statusCodes.FOUND]
