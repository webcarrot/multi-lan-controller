import {
  makeReactContextProvider,
  makeReactDisplay,
  makeReactLink,
  makeUseConfirm,
} from "@webcarrot/router";
import { RoutesType } from "./types";
import { AppContext } from "../app/types";

export const ReactRouteContext =
  makeReactContextProvider<RoutesType, AppContext>();

export const Display = makeReactDisplay(ReactRouteContext);
export const Link = makeReactLink(ReactRouteContext);

export const useRouteConfirm = makeUseConfirm(ReactRouteContext);
