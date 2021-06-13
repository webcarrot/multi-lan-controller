import * as React from "react";
import { ReactAdminApiContext, ReactAdminApiContextType } from "../api/context";
import { useSnackbar } from "notistack";
import { InProgressContext } from "./layout";

export const useAdminApiCall = (
  noBlock?: boolean
): ReactAdminApiContextType => {
  const adminApi = React.useContext(ReactAdminApiContext);
  const setInProgress = React.useContext(InProgressContext);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const cb: ReactAdminApiContextType = (method, payload, batch) => {
    const done = noBlock ? () => {} : setInProgress();
    const promise = adminApi(method, payload, batch);
    promise
      .catch(({ errors = [{ message: "Unknown error" }] }) => {
        errors.forEach(({ message }: { message: string }) => {
          const key = enqueueSnackbar(message, {
            variant: "error",
            onClick: () => closeSnackbar(key),
          });
        });
      })
      .then(done, done);
    return promise;
  };
  return React.useCallback(cb, [adminApi]);
};
