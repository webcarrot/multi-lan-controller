import * as React from "react";
import { ThemeProvider } from "@material-ui/styles";
import "@webcarrot/multi-lan-controller/common/lib/clsx";
import { ContextProvider as RouteContextProvider } from "@webcarrot/router";
import { SnackbarProvider } from "notistack";
import { ErrorHandler } from "@webcarrot/multi-lan-controller/common/components/error";
import { ReactRouteContext } from "../routes/components";
import { ReactAdminApiContext } from "../api/context";
import { AppProps } from "./types";
import { routes } from "../routes";
import theme from "./theme";
import { Layout } from "../components";
import { AppContext } from "./types";
import { UserContext } from "../components/userContext";

export const App = ({ adminApiContext, route, user, rootPath }: AppProps) => {
  const routeContext: AppContext = React.useMemo(
    () => ({ adminApi: adminApiContext, rootPath }),
    [adminApiContext, rootPath]
  );
  return (
    <UserContext.Provider value={user}>
      <ReactAdminApiContext.Provider value={adminApiContext}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={6} autoHideDuration={60000}>
            <ErrorHandler>
              <RouteContextProvider
                ReactContext={ReactRouteContext}
                routes={routes}
                context={routeContext}
                initialInfo={route}
              >
                <Layout />
              </RouteContextProvider>
            </ErrorHandler>
          </SnackbarProvider>
        </ThemeProvider>
      </ReactAdminApiContext.Provider>
    </UserContext.Provider>
  );
};
