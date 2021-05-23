import { createElement } from "react";
import { render } from "react-dom";
import { makeApi as makeApiContextValue } from "@webcarrot/api/browser";

import { AppProps, AppState } from "./app/types";
import { routes } from "./routes";
import { App } from "./app/app";
import { Routes } from "./routes/types";
import { AdminApiData } from "./api/types";
import { promisfy } from "@webcarrot/router";

declare const APP_STATE: AppState;

const appState: AppState = APP_STATE;

const routeState = appState.route;

const route = routes[routeState.id];

type Parameters<T extends (arg: any) => any> = T extends (arg: infer P) => any
  ? P
  : never;

type Prepare = Routes[typeof routeState.id]["prepare"];
type PrepareInput = Parameters<Routes[typeof routeState.id]["prepare"]>;

const prepare: Prepare = route.prepare;
const prepareInput: PrepareInput = routeState.output;

promisfy(() =>
  prepare(
    // @ts-ignore
    prepareInput
  )
).then((Component: any) => {
  const props: AppProps = {
    adminApiContext: makeApiContextValue<AdminApiData>({
      endpoint: appState.adminApiEndpoint,
      headers: {
        [appState.csrfHeader]: appState.csrfSecret,
      },
    }),
    user: appState.user,
    route: {
      ...appState.route,
      Component,
      route,
    } as any,
    rootPath: appState.rootPath,
  };
  render(createElement(App, props), document.getElementById("app"), () => {
    const ssStyles = document.getElementById("jss-server-side");
    if (ssStyles) {
      ssStyles.parentNode.removeChild(ssStyles);
    }
  });
});
