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
  parseAction,
  useIsValid,
} from "@webcarrot/multi-lan-controller/common/db/parse";
import SaveIcon from "@material-ui/icons/Save";

import {
  Action,
  ActionChangeType,
  DeviceOutNo,
  Settings,
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
  readonly settings: Settings;
}>(({ mode, item, title, onSave, settings }) => {
  const [data, setData] = useAutoState<Action>(item || NEW_DEVICE);
  const adminApi = React.useContext(ReactAdminApiContext);
  const isValid = useIsValid(data, parseAction);

  const handleSave = React.useCallback(() => {
    if (isValid) {
      adminApi("Actions/Save", data).then(({ id }) => onSave(id, mode));
    }
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
                />
              }
              label="Is Active"
            />
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="right">Name</TableCell>
                    <TableCell align="right" width={30}></TableCell>
                    <TableCell align="left">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {OUT_NUMBERS.map((no) => (
                    <ActionToChangeEdit
                      key={no}
                      no={no}
                      label={settings[`out${no}` as "out0"]}
                      reverseOut={settings.reverseOut}
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

const OPTIONS_NORMAL = [
  {
    value: "none",
    label: "No action",
  },
  {
    value: "on",
    label: "ON: ?->1",
  },
  {
    value: "off",
    label: "OFF: ?->0",
  },
  {
    value: "toggle",
    label: "TOGGLE: 0->1 or 1->0",
  },
];

const OPTIONS_REVERTED = [
  {
    value: "none",
    label: "No action",
  },
  {
    value: "on",
    label: "ON: ?->0",
  },
  {
    value: "off",
    label: "OFF: ?->1",
  },
  {
    value: "toggle",
    label: "TOGGLE: 0->1 or 1->0",
  },
];

const ActionToChangeEdit = React.memo<{
  no: DeviceOutNo;
  value?: ActionChangeType;
  reverseOut: boolean;
  label: string;
  onChange: (no: DeviceOutNo, data?: ActionChangeType) => void;
}>(({ no, value, label, reverseOut, onChange }) => {
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
  const OPTIONS = reverseOut ? OPTIONS_REVERTED : OPTIONS_NORMAL;

  return (
    <TableRow>
      <TableCell align="right">{label}</TableCell>
      <TableCell align="center" width={30}>
        {no}
      </TableCell>
      <TableCell align="left">
        <Select
          id={`to-change-${no}`}
          value={value || "none"}
          name="to-change"
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
