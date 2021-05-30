import { parseUser } from "./parse";
import { User, DbAccess } from "./types";
import { hash, verify } from "argon2";
import { v4 } from "uuid";

export const list = async (access: DbAccess): Promise<ReadonlyArray<User>> =>
  (await access.read()).users.map((user) => ({ ...user, password: null }));

export const save = async (access: DbAccess, item: User): Promise<User> => {
  let itemToSave = parseUser(item);
  await access.save(async (db) => {
    if (itemToSave.id) {
      if (!db.users.find(({ id }) => id === itemToSave.id)) {
        throw new Error("Unknown user");
      }
      return {
        ...db,
        users: await Promise.all(
          db.users.map(async (user) => {
            if (user.id === itemToSave.id) {
              return {
                ...itemToSave,
                password: itemToSave.password
                  ? await hash(itemToSave.password)
                  : user.password,
              };
            } else {
              return user;
            }
          })
        ),
      };
    } else {
      itemToSave = {
        ...itemToSave,
        password: await hash(itemToSave.password),
        id: v4(),
      };
      return {
        ...db,
        users: [...db.users, itemToSave],
      };
    }
  });
  return {
    ...itemToSave,
    password: null,
  };
};

export const getById = async (access: DbAccess, id: string): Promise<User> => {
  const users = await list(access);
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    if (user.isActive && user.id === id) {
      return user;
    }
  }
  return null;
};

export const login = async (
  access: DbAccess,
  login: string,
  password: string
): Promise<User> => {
  const users = (await access.read()).users;
  if (users.length === 0) {
    return await save(access, {
      id: null,
      isActive: true,
      login,
      password,
      name: "Administrator",
      places: "all",
      actions: "all",
      type: "admin",
    });
  }
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    if (
      user.isActive &&
      user.login === login &&
      (await verify(user.password, password))
    ) {
      return {
        ...user,
        password: null,
      };
    }
  }
  throw new Error("User not found");
};
