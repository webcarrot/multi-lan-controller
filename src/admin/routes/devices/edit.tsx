import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { Place, Device } from "@webcarrot/multi-lan-controller/common/db/types";
import * as React from "react";
import { ReactAdminApiContext } from "../../api/context";
import {
  Bottombar,
  ItemContent,
  Toolbar,
  useAutoState,
} from "../../components";
import { Mode } from "../types";

const NEW_DEVICE: Device = {
  id: null,
  name: "",
  url: "",
  placeId: null,
  isActive: true,
};

export const Edit = React.memo<{
  readonly mode: Mode;
  readonly item?: Device;
  readonly onSave: (id: string, mode: Mode) => void;
  readonly title: string;
  readonly places: ReadonlyArray<Place>;
}>(({ mode, item, title, onSave, places }) => {
  const [data, setData] = useAutoState<Device>(item || NEW_DEVICE);
  const adminApi = React.useContext(ReactAdminApiContext);

  const handleSave = React.useCallback(() => {
    adminApi("Devices/Save", data).then(({ id }) => onSave(id, mode));
  }, [adminApi, data, onSave, mode]);

  const handleChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const name = ev.target.name;
      switch (name) {
        case "name":
        case "url": {
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
        case "placeId": {
          const value = ev.target.value || null;
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
          <Grid item xs={12}>
            <TextField
              label="Device name"
              name="name"
              value={data.name}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Device URL"
              name="url"
              value={data.url}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="place">Place</InputLabel>
              <Select
                labelId="place"
                id="place-select"
                value={data.placeId}
                name="placeId"
                onChange={handleChange}
              >
                <MenuItem value={null} key="none">
                  No Place
                </MenuItem>
                {places.map(({ id, name }) => (
                  <MenuItem value={id} key={id}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.isActive}
                  onChange={handleChange}
                  name="isActive"
                  color="primary"
                />
              }
              label="Is Active"
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
