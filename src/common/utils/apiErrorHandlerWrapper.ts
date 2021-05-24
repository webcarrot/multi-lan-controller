export const prepareApiError = (
  err: Error
): {
  errors: ReadonlyArray<{ message: string }>;
} => {
  return {
    errors: [
      {
        message: err.message,
      },
    ],
  };
};

export const apiErrorHandlerWrapper = <
  T extends (...args: any[]) => Promise<any>
>(
  func: T
): T => <T>((...args: any[]) =>
    func(...args).catch((err) => {
      throw prepareApiError(err);
    }));
