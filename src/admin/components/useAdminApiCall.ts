import * as React from "react";
import { ReactAdminApiContext, ReactAdminApiContextType } from "../api/context";
import { useSnackbar } from "notistack";
import { InProgressContext } from "./layout";

export const useAdminApiCall = (noBlock = false): ReactAdminApiContextType => {
  const adminApi = React.useContext(ReactAdminApiContext);
  const setInProgress = React.useContext(InProgressContext);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const cb: ReactAdminApiContextType = (method, payload, batch) => {
    const done = noBlock ? () => {} : setInProgress();
    const promise = adminApi(method, payload, batch);
    promise
      .catch(({ message = "Unknown error" }) => {
        const key = enqueueSnackbar(message, {
          variant: "error",
          autoHideDuration: 5 * 1000,
          onClick: () => closeSnackbar(key),
        });
      })
      .then(done, done);
    return promise;
  };
  return React.useCallback(cb, [adminApi, setInProgress]);
};
