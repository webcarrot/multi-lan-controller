import { createContext } from "react";
import { User } from "@webcarrot/multi-lan-controller/common/db/types";

export const UserContext = createContext<User>(null);
