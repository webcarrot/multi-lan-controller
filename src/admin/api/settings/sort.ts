import { checkIsAdmin } from "../access";
import { AdminApiFunction } from "../types";

const makeSort = <T extends { readonly id: string }>(
  data: ReadonlyArray<T>,
  ids: ReadonlyArray<string>
) => {
  const sort = data.reduce<Map<string, number>>((sort, { id }, no) => {
    const index = ids.indexOf(id);
    sort.set(id, index > -1 ? index : no + data.length);
    return sort;
  }, new Map());
  return (a: T, b: T) => sort.get(a.id) - sort.get(b.id);
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
    actions: [...data.actions].sort(makeSort(data.actions, actions)),
    places: [...data.places].sort(makeSort(data.actions, places)),
    devices: [...data.devices].sort(makeSort(data.devices, devices)),
  }));
  return null;
};
