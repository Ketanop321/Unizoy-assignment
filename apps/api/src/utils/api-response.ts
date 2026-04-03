interface ApiErrorPayload {
  code: string;
  details?: Record<string, string[]>;
}

interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  error?: ApiErrorPayload;
}

export const successResponse = <T>(message: string, data: T): ApiResponse<T> => ({
  success: true,
  data,
  message,
});

export const errorResponse = (message: string, error: ApiErrorPayload): ApiResponse<null> => ({
  success: false,
  data: null,
  message,
  error,
});
