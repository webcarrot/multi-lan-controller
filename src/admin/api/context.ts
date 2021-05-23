import { ApiResolver } from "@webcarrot/api";
import { makeContext } from "@webcarrot/api/context";
import { AdminApiData } from "./types";

export type ReactAdminApiContextType = ApiResolver<AdminApiData>;
export const ReactAdminApiContext = makeContext<AdminApiData>();
