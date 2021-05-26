import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
} from "@material-ui/core";
import {
  parsePlace,
  useIsValid,
} from "@webcarrot/multi-lan-controller/common/db/parse";
import SaveIcon from "@material-ui/icons/Save";

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
  isActive: true,
};

export const Edit = React.memo<{
  readonly mode: Mode;
  readonly item?: Place;
  readonly onSave: (id: string, mode: Mode) => void;
  readonly title: string;
}>(({ mode, item, onSave, title }) => {
  const [data, setData] = useAutoState<Place>(item || NEW_PLACE);
  const adminApi = React.useContext(ReactAdminApiContext);
  const isValid = useIsValid(data, parsePlace);

  const handleSave = React.useCallback(() => {
    if (isValid) {
      adminApi("Places/Save", data).then(({ id }) => onSave(id, mode));
    }
  }, [adminApi, data, onSave, mode, isValid]);

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
        case "isActive": {
          const value = ev.target.checked;
          setData((data) => ({
            ...data,
            isActive: value,
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
          <Grid item xs={8}>
            <TextField
              label="Place name"
              name="name"
              value={data.name}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.isActive}
                  onChange={handleChange}
                  name="isActive"
                />
              }
              label="Is Active"
            />
          </Grid>
        </Grid>
      </ItemContent>
      <Bottombar>
        <Grid item>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={!isValid}
            startIcon={<SaveIcon />}
          >
            {mode === "add" ? "Add" : "Save"}
          </Button>
        </Grid>
      </Bottombar>
    </>
  );
});
