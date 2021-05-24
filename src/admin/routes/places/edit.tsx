import { Button, Grid, TextField } from "@material-ui/core";
import { Place } from "@webcarrot/multi-lan-controller/common/db/types";
import * as React from "react";
import { ReactAdminApiContext } from "../../api/context";
import {
  Bottombar,
  ItemContent,
  Toolbar,
  useAutoState,
} from "../../components";
import { Mode } from "../types";

const NEW_PLACE: Place = {
  id: null,
  name: "",
};

export const Edit = React.memo<{
  readonly mode: Mode;
  readonly item?: Place;
  readonly onSave: (id: string, mode: Mode) => void;
  readonly title: string;
}>(({ mode, item, onSave, title }) => {
  const [data, setData] = useAutoState<Place>(item || NEW_PLACE);
  const adminApi = React.useContext(ReactAdminApiContext);

  const handleSave = React.useCallback(() => {
    adminApi("Places/Save", data).then(({ id }) => onSave(id, mode));
  }, [adminApi, data, onSave, mode]);

  const handleChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const name = ev.target.name;
      switch (name) {
        case "name": {
          const value = ev.target.value;
          setData((data) => ({
            ...data,
            [name]: value,
          }));
          break;
        }
      }
    },
    [setData]
  );

  return (
    <>
      <Toolbar title={title} />
      <ItemContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Place name"
              name="name"
              value={data.name}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>
      </ItemContent>
      <Bottombar>
        <Grid item>
          <Button onClick={handleSave} variant="contained" color="primary">
            {mode === "add" ? "Add" : "Save"}
          </Button>
        </Grid>
      </Bottombar>
    </>
  );
});
