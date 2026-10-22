export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export function isApiError(err: unknown): err is ApiError {
  return (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    "message" in err
  );
}
