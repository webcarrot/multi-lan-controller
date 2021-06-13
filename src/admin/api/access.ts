import { User } from "@webcarrot/multi-lan-controller/common/db/types";

export const checkIsAdmin = (user: User) => {
  if (user.type !== "admin") {
    throw new Error("Forbidden");
  }
};
