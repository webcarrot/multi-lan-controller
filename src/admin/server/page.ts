import { createElement } from "react";
import { ServerStyleSheets } from "@material-ui/styles";
import { getBody } from "@webcarrot/multi-lan-controller/common/utils/getBody";

import {
  makeContext as makeRouteContext,
  execute as executeRoute,
  isRedirect,
  GetPayload,
  PostPayload,
  ChangeType,
} from "@webcarrot/router";

import { getManifests } from "@webcarrot/multi-lan-controller/common/lib/build/manifest";

import { App } from "../app/app";
import { Html } from "../app/html";
import { routes } from "../routes";
import { Context } from "koa";
import { make as makeAdminApi } from "../api";
import { AppProps, AppState } from "../app/types";
import { CSRF_HEADER } from "./constants";
import {
  API_ENDPOINT,
  STATE_ENDPOINT,
} from "@webcarrot/multi-lan-controller/endpoints";
import { render } from "@webcarrot/multi-lan-controller/common/utils/render";
import {
  DbAccess,
  User,
} from "@webcarrot/multi-lan-controller/common/db/types";

const makeInit = async (rootPath: string): Promise<string> => {
  const { manifests } = await getManifests();
  const legacy = manifests.get("admin-legacy");
  const modern = manifests.get("admin-modern");
  const legacyFiles = JSON.stringify(
    legacy
      ? [
          legacy.get("main.js"),
          legacy.get("vendors.js"),
          legacy.get("material.js"),
        ]
      : null
  );
  const modernFiles = JSON.stringify(
    modern
      ? [
          modern.get("main.js"),
          modern.get("vendors.js"),
          modern.get("material.js"),
        ]
      : null
  );
  return `window.process={env:{NODE_ENV:"${
    process.env.NODE_ENV === "development" ? "development" : "production"
  }"}};(function(d,w,l,m,r,i){function a(s,e){e=d.createElement('script');e.src=r+s;d.head.appendChild(e);}(l&&!(w.fetch&&w.Proxy&&!/(Edge|Trident\\/7\\.)/.test(navigator.userAgent))?l:m).forEach(a);})(document,window,${legacyFiles},${modernFiles},${JSON.stringify(
    rootPath
  )})`;
};

export const adminPageHandler = async (
  ctx: Context,
  next: () => Promise<any>,
  csrfSecret: string,
  storeState: (state: string, init: string) => string,
  dbAccess: DbAccess,
  user: User
) => {
  const method = ctx.method;
  if (method !== "GET" && method !== "POST") {
    return next();
  }
  ctx.compress = true;
  const body: any = await getBody(ctx);

  const adminApi = await makeAdminApi(dbAccess, user);

  const appContext = makeRouteContext(routes, {
    adminApi,
    rootPath: "",
  });

  const routePayload =
    method === "GET"
      ? ({
          method: "GET",
          no: 0,
          changeType: ChangeType.PUSH,
          url: ctx.originalUrl || "/",
        } as GetPayload)
      : ({
          method: "POST",
          no: 0,
          changeType: ChangeType.PUSH,
          url: ctx.originalUrl || "/",
          body: body as any,
        } as PostPayload);

  const routeState = await executeRoute(routes, routePayload, appContext);

  if (isRedirect(routeState.output.status)) {
    ctx.status = routeState.output.status;
    ctx.set("Location", routeState.output.url);
    return;
  }
  const rootPath = `${ctx.protocol}://${ctx.host}`;

  const state: AppState = {
    adminApiEndpoint: `/${API_ENDPOINT}`,
    csrfSecret,
    csrfHeader: CSRF_HEADER,
    route: {
      ...routeState,
      route: null,
      Component: null,
    },
    user,
    rootPath,
  };

  const props: AppProps = {
    adminApiContext: adminApi,
    route: routeState,
    user,
    rootPath,
  };

  const sheets = new ServerStyleSheets();

  const html = await render(sheets.collect(createElement(App, props)));

  const meta = [
    {
      name: "viewport",
      content:
        ctx.headers["user-agent"] &&
        /iPad|iPhone/.test(ctx.headers["user-agent"])
          ? "width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"
          : "width=device-width,minimum-scale=1.0",
    },
  ];

  const stateId = storeState(JSON.stringify(state), await makeInit(rootPath));

  ctx.set({
    Link: `</${STATE_ENDPOINT}/${stateId}>; rel="preload"; as="script"`,
  });

  ctx.type = "html";
  ctx.status = routeState.output.status;
  ctx.body =
    "<!doctype html>" +
    (await render(
      createElement(Html, {
        sheets,
        stateId,
        title: state.route.output.title,
        html,
        meta,
      })
    ));
};
