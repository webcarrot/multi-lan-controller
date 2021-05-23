import {
  string,
  array,
  shape,
  make,
  error,
  boolean,
  eq,
  oneOf,
} from "@webcarrot/parse";
import { validate } from "uuid";
import type { Device, Place, User } from "./types";

export const parseId = make<string, string>((id, path) => {
  if (validate(id)) {
    return id;
  } else {
    throw error("Invalid id", path, id);
  }
});

export const parseOptionalId = parseId.catch(
  make<string, string>((id, path) => {
    if (id) {
      throw error("Invalid id", path, id);
    } else {
      return "";
    }
  })
);

export const parseUser = shape<User>({
  id: parseOptionalId,
  login: string({ minLength: 5 }),
  name: string({ minLength: 5 }),
  password: string({ optional: true, default: "" }),
  places: oneOf([eq("all"), array(parseId)]),
  type: oneOf([eq("admin"), eq("normal")], { default: "normal" }),
  isActive: boolean({ default: true }),
}).then(
  make<User, User>((user, path) => {
    if (!user.id && !user.password) {
      throw error("Provide user password", path, "");
    }
    return user;
  })
);

export const parsePlace = shape<Place>({
  id: parseOptionalId,
  name: string({ minLength: 5 }),
});

export const parseDevice = shape<Device>({
  id: parseOptionalId,
  name: string({ minLength: 5 }),
  placeId: parseOptionalId,
  url: string({ minLength: 5 }),
  isActive: boolean({ default: true }),
});
