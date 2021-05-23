import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
} from "@material-ui/core";
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

  const handleSave = React.useCallback(() => {
    adminApi("Settings/Save", data).then(() => onSave());
  }, [onSave, data]);

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
        <Grid container spacing={2}>
          {data.out.map((outSettings, no) => (
            <OutSettingEdit
              key={no}
              onChange={handleChangeOut}
              no={no}
              {...outSettings}
            />
          ))}
        </Grid>
      </ItemContent>
      <Bottombar>
        <Grid item>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </Grid>
      </Bottombar>
    </>
  );
});

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
    <>
      <Grid item xs={4}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isActive}
              onChange={handleChange}
              name="isActive"
              color="primary"
            />
          }
          label="Is Active"
        />
      </Grid>
      <Grid item xs={8}>
        <TextField
          label="Place name"
          name="name"
          value={name}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
    </>
  );
});
