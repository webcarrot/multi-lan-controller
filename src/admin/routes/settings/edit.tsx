import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";

import {
  parseSettings,
  useIsValid,
} from "@webcarrot/multi-lan-controller/common/db/parse";
import {
  OutSetting,
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

export const Edit = React.memo<{
  readonly settings: Settings;
  readonly onSave: () => void;
  readonly title: string;
}>(({ settings, onSave, title }) => {
  const [data, setData] = useAutoState<Settings>(settings);
  const adminApi = React.useContext(ReactAdminApiContext);
  const isValid = useIsValid(data, parseSettings);

  const handleSave = React.useCallback(() => {
    if (isValid) {
      adminApi("Settings/Save", data).then(() => onSave());
    }
  }, [onSave, data, isValid]);

  const handleChangeOut = React.useCallback(
    (no: number, outSettings: OutSetting) => {
      setData((data) => {
        let out = [...data.out];
        out.splice(no, 1, outSettings);
        return {
          ...data,
          out: out as any,
        };
      });
    },
    [setData]
  );

  return (
    <>
      <Toolbar title={title} />
      <ItemContent>
        {data.out.map((outSettings, no) => (
          <OutSettingEdit
            key={no}
            onChange={handleChangeOut}
            no={no}
            {...outSettings}
          />
        ))}
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
            Save
          </Button>
        </Grid>
      </Bottombar>
    </>
  );
});
const OUT_SETTING_STYLE = { margin: "8px 0", padding: "8px" };

const OutSettingEdit = React.memo<
  OutSetting & {
    no: number;
    onChange: (no: number, data: OutSetting) => void;
  }
>(({ isActive, name, no, onChange }) => {
  const handleChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      switch (ev.target.name) {
        case "name": {
          onChange(no, {
            isActive,
            name: ev.target.value,
          });
          break;
        }
        case "isActive": {
          onChange(no, {
            isActive: ev.target.checked,
            name,
          });
          break;
        }
      }
    },
    [onChange, name, isActive, no]
  );

  return (
    <Paper variant="outlined" style={OUT_SETTING_STYLE}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={9}>
          <TextField
            label={`OUT${no} name`}
            name="name"
            value={name}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Checkbox
                checked={isActive}
                onChange={handleChange}
                name="isActive"
              />
            }
            label="Show in Dashboard"
          />
        </Grid>
      </Grid>
    </Paper>
  );
});
