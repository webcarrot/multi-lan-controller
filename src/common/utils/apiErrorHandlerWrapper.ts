export const prepareApiError = (
  err: Error
): {
  readonly message: string;
} => ({
  message: (err && err.message) || "Unknown error",
});

export const apiErrorHandlerWrapper = <
  T extends (...args: any[]) => Promise<any>
>(
  func: T
): T => <T>((...args: any[]) =>
    func(...args).catch((err) => {
      throw prepareApiError(err);
    }));
