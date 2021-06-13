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
import {
  parseDevice,
  useIsValid,
} from "@webcarrot/multi-lan-controller/common/db/parse";
import SaveIcon from "@material-ui/icons/Save";
import RemoveIcon from "@material-ui/icons/DeleteForever";

import { Place, Device } from "@webcarrot/multi-lan-controller/common/db/types";
import * as React from "react";
import {
  Bottombar,
  ItemContent,
  Toolbar,
  useAdminApiCall,
  useAutoState,
  useConfirm,
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
  readonly onSave: (id: string | null, mode: Mode) => void;
  readonly title: string;
  readonly places: ReadonlyArray<Place>;
}>(({ mode, item, title, onSave, places }) => {
  const [data, setData] = useAutoState<Device>(item || NEW_DEVICE);
  const adminApi = useAdminApiCall();
  const isValid = useIsValid(data, parseDevice);

  const handleSave = React.useCallback(() => {
    if (isValid) {
      adminApi("Devices/Save", data).then(({ id }) => onSave(id, mode));
    }
  }, [adminApi, data, onSave, mode, isValid]);

  const [removeDialog, handleRemove] = useConfirm(
    item ? `Device ${item.name} will be removed` : null,
    React.useCallback(() => {
      adminApi("Devices/Remove", item).then(() => onSave(null, "list"));
    }, [adminApi, item, onSave])
  );

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
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={8}>
            <TextField
              label="Device name"
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
        {mode === "edit" ? (
          <Grid item>
            <Button
              onClick={handleRemove}
              variant="contained"
              color="secondary"
              startIcon={<RemoveIcon />}
            >
              Remove
            </Button>
            {removeDialog}
          </Grid>
        ) : null}
      </Bottombar>
    </>
  );
});
