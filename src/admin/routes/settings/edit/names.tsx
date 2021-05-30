import { Button, Grid, Paper, TextField, Typography } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";

import {
  validDiKeys,
  validIaKeys,
  validMiscKeys,
  validOutKeys,
  validSecKeys,
} from "@webcarrot/multi-lan-controller/common/db/parse";
import { Settings } from "@webcarrot/multi-lan-controller/common/db/types";
import { DeviceStatusValues } from "@webcarrot/multi-lan-controller/common/device/types";
import * as React from "react";
import { Bottombar, ItemContent } from "../../../components";

export const EditNames = React.memo<{
  data: Settings;
  onChange: React.ChangeEventHandler;
  onSave: () => void;
  isValid: boolean;
}>(({ data, onChange, onSave, isValid }) => {
  return (
    <>
      <ItemContent>
        <EditNamesGroup
          data={data}
          onChange={onChange}
          name="OUT"
          keys={validOutKeys}
        />
        <EditNamesGroup
          data={data}
          onChange={onChange}
          name="DI"
          keys={validDiKeys}
        />
        <EditNamesGroup
          data={data}
          onChange={onChange}
          name="IA"
          keys={validIaKeys}
        />
        <EditNamesGroup
          data={data}
          onChange={onChange}
          name="SEC"
          keys={validSecKeys}
        />
        <EditNamesGroup
          data={data}
          onChange={onChange}
          name="MISC"
          keys={validMiscKeys}
        />
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
      </Bottombar>
    </>
  );
});

const EditNamesGroup = React.memo<{
  data: Settings;
  onChange: React.ChangeEventHandler;
  name: string;
  keys: ReadonlyArray<DeviceStatusValues>;
}>(({ data, onChange, name, keys }) => {
  return (
    <>
      <Typography variant="h6">{name}</Typography>
      <Grid
        container
        spacing={2}
        style={{
          margin: "8px 0 16px 0",
        }}
        component={Paper}
        variant="outlined"
      >
        {keys.map((key) => (
          <Grid item xs={6} key={key}>
            <TextField
              label={`${key.toUpperCase()} name`}
              name={key}
              value={data[key]}
              onChange={onChange}
              fullWidth
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
});
