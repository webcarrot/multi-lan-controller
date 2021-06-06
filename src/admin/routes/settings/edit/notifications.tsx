import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import {
  Settings,
  SettingsNotification,
} from "@webcarrot/multi-lan-controller/common/db/types";
import * as React from "react";
import { Bottombar, ItemContent } from "../../../components";

const LABELS: { [key in SettingsNotification["type"]]: string } = {
  ol: "Online Status Change",
  out: "OUT Status Change",
};

const OPTIONS: ReadonlyArray<SettingsNotification> = [
  {
    type: "ol",
    alert: true,
    playSound: false,
    speak: true,
    status: false,
    template: "System lost connection to %device% in %place%.",
  },
  {
    type: "out",
    alert: true,
    playSound: false,
    speak: false,
    status: false,
    no: 0,
    template: "Device %device% in %place% change status of OUT.",
  },
];

const getTitle = (value: SettingsNotification): string => {
  switch (value.type) {
    case "ol":
      return `${value.status ? "ONLINE" : "OFFLINE"}: ${LABELS.ol}`;
    case "out":
      return `${value.status ? "ON" : "OFF"} OUT${value.no}: ${LABELS.ol}`;
    default:
      // @ts-ignore
      return LABELS[value.type];
  }
};

export const EditNotifications = React.memo<{
  data: Settings;
  onChange: (cb: (data: Settings) => Settings) => void;
  onSave: () => void;
  isValid: boolean;
}>(({ data, onChange, onSave, isValid }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [edit, setEdit] = React.useState<number>(-1);
  const handleMenuOpen = (ev: React.MouseEvent<HTMLButtonElement>) => {
    const currentTarget = ev.currentTarget;
    setAnchorEl((el) => (el ? null : currentTarget));
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleRemove = React.useCallback(
    (no: number) => {
      onChange((data) => ({
        ...data,
        notifications: data.notifications.filter((_, index) => index !== no),
      }));
    },
    [onChange]
  );

  const handleAdd = React.useCallback(
    (value: SettingsNotification) => {
      setAnchorEl(null);
      onChange((data) => ({
        ...data,
        notifications: [...data.notifications, value],
      }));
    },
    [onChange]
  );

  const handleEdit = React.useCallback((no: number) => setEdit(no), []);

  const handleEditAbort = React.useCallback(() => setEdit(-1), []);

  const handleEditSave = React.useCallback(
    (value: SettingsNotification) => {
      setEdit(-1);
      const no = edit;
      onChange((data) => ({
        ...data,
        notifications: data.notifications.map((v, index) =>
          index === no ? value : v
        ),
      }));
    },
    [edit, onChange]
  );

  return (
    <>
      <ItemContent>
        <List>
          {data.notifications.map((value, no) => (
            <ListItem divider key={no}>
              <ListItemText
                primary={getTitle(value)}
                secondary={value.template}
              />
              <ListItemIcon>
                <IconButton onClick={() => handleEdit(no)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleRemove(no)} color="secondary">
                  <RemoveIcon />
                </IconButton>
              </ListItemIcon>
            </ListItem>
          ))}
        </List>
      </ItemContent>
      <Bottombar>
        <Grid item>
          <Button
            onClick={onSave}
            variant="contained"
            color="primary"
            disabled={!isValid}
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </Grid>
        <Grid item>
          <Button
            onClick={handleMenuOpen}
            variant="contained"
            color="secondary"
            disabled={!isValid}
            startIcon={<AddIcon />}
          >
            Add notification
          </Button>
        </Grid>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={anchorEl !== null}
          onClose={handleCloseMenu}
        >
          {OPTIONS.map((value, key) => (
            <MenuItem onClick={() => handleAdd(value)} key={key}>
              {LABELS[value.type]}
            </MenuItem>
          ))}
        </Menu>
      </Bottombar>
      {edit === -1 ? null : (
        <EditNotification
          value={data.notifications[edit]}
          onSave={handleEditSave}
          onAbort={handleEditAbort}
        />
      )}
    </>
  );
});

const OUT_NO = [0, 1, 2, 3, 4, 5];

const EditNotification = React.memo<{
  value: SettingsNotification;
  onSave: (data: SettingsNotification) => void;
  onAbort: () => void;
}>(({ value, onSave, onAbort }) => {
  const [data, setData] = React.useState(value);
  const handleSave = React.useCallback(() => onSave(data), [onSave, data]);
  const handleChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const t = ev.target;
      setData((data) => ({
        ...data,
        [t.name]: t.type === "checkbox" ? t.checked : t.value,
      }));
    },
    [setData]
  );
  let extra: JSX.Element;
  switch (data.type) {
    case "ol":
      extra = (
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={data.status}
                onChange={handleChange}
                name="status"
              />
            }
            label="Run if device become Online"
          />
        </Grid>
      );
      break;
    case "out":
      extra = (
        <>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="out-no-label">OUT NO</InputLabel>
              <Select
                labelId="out-no-label"
                id="out-no"
                value={data.no}
                onChange={handleChange}
                name="no"
              >
                {OUT_NO.map((no) => (
                  <MenuItem value={no} key={no}>
                    OUT{no}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.status}
                  onChange={handleChange}
                  name="status"
                />
              }
              label={`Run if OUT${data.no} is ON`}
            />
          </Grid>
        </>
      );
      break;
  }
  return (
    <Dialog open onClose={onAbort} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{getTitle(data)}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.alert}
                  onChange={handleChange}
                  name="alert"
                />
              }
              label="Show alert"
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.playSound}
                  onChange={handleChange}
                  name="playSound"
                />
              }
              label="Play sound"
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.speak}
                  onChange={handleChange}
                  name="speak"
                />
              }
              label="Speak"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Message template"
              value={data.template}
              onChange={handleChange}
              name="template"
              fullWidth
            />
          </Grid>
          <Divider />
          {extra}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onAbort} color="secondary" variant="contained">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          save
        </Button>
      </DialogActions>
    </Dialog>
  );
});
