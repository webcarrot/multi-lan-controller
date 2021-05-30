import { checkIsAdmin } from "../access";
import { AdminApiFunction } from "../types";

const doSort = <T extends { readonly id: string }>(
  data: ReadonlyArray<T>,
  ids: ReadonlyArray<string>
): ReadonlyArray<T> => {
  const sort = data.reduce<Map<string, number>>((sort, { id }, no) => {
    const index = ids.indexOf(id);
    sort.set(id, index > -1 ? index : no + data.length);
    return sort;
  }, new Map());
  return [...data].sort((a: T, b: T) => sort.get(a.id) - sort.get(b.id));
};

export const sort: AdminApiFunction<
  {
    readonly actions: ReadonlyArray<string>;
    readonly places: ReadonlyArray<string>;
    readonly devices: ReadonlyArray<string>;
  },
  null
> = async ({ actions, places, devices }, { dbAccess, user }) => {
  checkIsAdmin(user);
  await dbAccess.save(async (data) => ({
    ...data,
    actions: doSort(data.actions, actions),
    places: doSort(data.places, places),
    devices: doSort(data.devices, devices),
  }));
  return null;
};
