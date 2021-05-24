import { AdminApiContextValue } from "../api/types";
import { RoutesType } from "../routes/types";
import { ExtractRouteFullOutput } from "@webcarrot/router";
import { User } from "@webcarrot/multi-lan-controller/common/db/types";

export type AppContext = {
  readonly adminApi: AdminApiContextValue;
  readonly rootPath: string;
};

export type AppProps = {
  readonly adminApiContext: AdminApiContextValue;
  readonly route: ExtractRouteFullOutput<
    RoutesType,
    RoutesType["id"],
    AppContext
  >;
  readonly user: User;
  readonly rootPath: string;
};

export type AppState = {
  readonly adminApiEndpoint: string;
  readonly csrfHeader: string;
  readonly csrfSecret: string;
  readonly route: ExtractRouteFullOutput<
    RoutesType,
    RoutesType["id"],
    AppContext
  >;
  readonly user: User;
  readonly rootPath: string;
};
