import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import {
  Action,
  ActionChangeType,
  DeviceOutNo,
} from "@webcarrot/multi-lan-controller/common/db/types";
import * as React from "react";
import { ReactAdminApiContext } from "../../api/context";
import {
  Bottombar,
  ItemContent,
  Toolbar,
  useAutoState,
} from "../../components";
import { Mode } from "../types";

const NEW_DEVICE: Action = {
  id: null,
  name: "",
  color: "#333333",
  textColor: "#ffffff",
  isActive: true,
  toChange: [],
};

const OUT_NUMBERS: ReadonlyArray<DeviceOutNo> = [0, 1, 2, 3, 4];

export const Edit = React.memo<{
  readonly mode: Mode;
  readonly item?: Action;
  readonly onSave: (id: string, mode: Mode) => void;
  readonly title: string;
}>(({ mode, item, title, onSave }) => {
  const [data, setData] = useAutoState<Action>(item || NEW_DEVICE);
  const adminApi = React.useContext(ReactAdminApiContext);

  const handleSave = React.useCallback(() => {
    adminApi("Actions/Save", data).then(({ id }) => onSave(id, mode));
  }, [adminApi, data, onSave, mode]);

  const handleChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const name = ev.target.name;
      switch (name) {
        case "name":
        case "color":
        case "textColor": {
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

  const handleChangeToChange = React.useCallback(
    (no: DeviceOutNo, value?: ActionChangeType) => {
      setData((data) => {
        let toChange = data.toChange.filter(({ out }) => out !== no);
        if (value) {
          toChange = [...toChange, { out: no, change: value }];
        }
        return {
          ...data,
          toChange,
        };
      });
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
              label="Action name"
              name="name"
              value={data.name}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Button color"
              name="color"
              type="color"
              value={data.color}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Text color"
              name="textColor"
              type="color"
              value={data.textColor}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
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
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="right" width={50}>
                      OUT
                    </TableCell>
                    <TableCell align="left">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {OUT_NUMBERS.map((no) => (
                    <ActionToChangeEdit
                      key={no}
                      no={no}
                      value={
                        data.toChange.find(({ out }) => out === no)?.change
                      }
                      onChange={handleChangeToChange}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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

const OPTIONS = [
  {
    value: "none",
    label: "No action",
  },
  {
    value: "on",
    label: "?->1 - on",
  },
  {
    value: "off",
    label: "?->0 - off",
  },
  {
    value: "toggle",
    label: "0->1 or 1->0 - toggle",
  },
];

const ActionToChangeEdit = React.memo<{
  no: DeviceOutNo;
  value?: ActionChangeType;
  onChange: (no: DeviceOutNo, data?: ActionChangeType) => void;
}>(({ no, value, onChange }) => {
  const handleChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      switch (ev.target.value) {
        case "on":
        case "off":
        case "toggle":
          onChange(no, ev.target.value);
          break;
        default:
          onChange(no, undefined);
      }
    },
    [no, value, onChange]
  );

  return (
    <TableRow>
      <TableCell align="right" width={50}>
        OUT{no}
      </TableCell>
      <TableCell align="left">
        <Select
          id="place-select"
          value={value || "none"}
          name="placeId"
          onChange={handleChange}
          fullWidth
        >
          {OPTIONS.map(({ value, label }) => (
            <MenuItem value={value} key={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </TableCell>
    </TableRow>
  );
});
