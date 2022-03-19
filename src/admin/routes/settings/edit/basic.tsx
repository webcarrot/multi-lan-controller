import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  Paper,
  TextField,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";

import { Settings } from "@webcarrot/multi-lan-controller/common/db/types";
import * as React from "react";
import { Bottombar, ItemContent } from "../../../components";

export const EditBasic = React.memo<{
  data: Settings;
  onChange: React.ChangeEventHandler;
  onSave: () => void;
  isValid: boolean;
}>(({ data, onChange, onSave, isValid }) => {
  return (
    <>
      <ItemContent>
        <Grid
          container
          spacing={2}
          component={Paper}
          variant="outlined"
          style={{
            margin: "8px 0 16px 0",
          }}
        >
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.reverseOut}
                  onChange={onChange}
                  name="reverseOut"
                />
              }
              label="Reverse out state"
            />
            <FormHelperText variant="outlined">
              This also affect actions
            </FormHelperText>
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              value={`${data.statsInterval}`}
              onChange={onChange}
              name="statsInterval"
              label="Stats interval"
              helperText="Set to 0 to turn off stats"
            />
          </Grid>
        </Grid>
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
