import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { Place, User } from "@webcarrot/multi-lan-controller/common/db/types";
import * as React from "react";
import { ReactAdminApiContext } from "../../api/context";
import {
  Bottombar,
  ItemContent,
  Toolbar,
  useAutoState,
} from "../../components";
import { Mode } from "../types";

const NEW_USER: User = {
  id: null,
  name: "",
  login: "",
  password: "",
  isActive: true,
  places: "all",
  type: "normal",
};

export const Edit = React.memo<{
  readonly mode: Mode;
  readonly item?: User;
  readonly onSave: (id: string, mode: Mode) => void;
  readonly title: string;
  readonly places: ReadonlyArray<Place>;
}>(({ mode, item, title, onSave, places }) => {
  const [data, setData] = useAutoState<User>(item || NEW_USER);

  const adminApi = React.useContext(ReactAdminApiContext);

  const handleSave = React.useCallback(() => {
    adminApi("Users/Save", data).then(({ id }) => onSave(id, mode));
  }, [adminApi, data, onSave, mode]);

  const handleChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const name = ev.target.name;
      switch (name) {
        case "name":
        case "login":
        case "password":
        case "type": {
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
        case "places": {
          const value = ev.target.value;
          if (value === "all") {
            const checked = ev.target.checked;
            setData((data) => ({
              ...data,
              places: checked ? "all" : [],
            }));
          } else {
            const checked = ev.target.checked;
            setData((data) => {
              let places = data.places instanceof Array ? data.places : [];
              if (checked) {
                if (!places.includes(value)) {
                  places = [...places, value];
                }
              } else {
                places = places.filter((id) => id !== value);
              }
              return {
                ...data,
                places,
              };
            });
          }
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
          <Grid item xs={6}>
            <TextField
              label="User name"
              name="name"
              value={data.name}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="type">User type</InputLabel>
              <Select
                labelId="type"
                id="type-select"
                value={data.type}
                name="type"
                onChange={handleChange}
              >
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="admin">Administrator</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="User login"
              name="login"
              value={data.login}
              onChange={handleChange}
              fullWidth
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="User password"
              name="password"
              type="password"
              value={data.password}
              onChange={handleChange}
              fullWidth
              autoComplete="off"
            />
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
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Places</FormLabel>
              <FormGroup>
                <FormControlLabel
                  key="all"
                  control={
                    <Checkbox
                      checked={data.places === "all"}
                      onChange={handleChange}
                      value="all"
                      name="places"
                    />
                  }
                  label="All places"
                />
                {data.places !== "all"
                  ? places.map(({ id, name }) => (
                      <FormControlLabel
                        key={id}
                        control={
                          <Checkbox
                            checked={data.places.includes(id)}
                            onChange={handleChange}
                            value={id}
                            name="places"
                          />
                        }
                        label={name}
                      />
                    ))
                  : null}
              </FormGroup>
            </FormControl>
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
