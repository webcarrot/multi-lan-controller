import {
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Delete";

import { validSettingsKeys } from "@webcarrot/multi-lan-controller/common/db/parse";
import { Settings } from "@webcarrot/multi-lan-controller/common/db/types";
import { DeviceStatusValues } from "@webcarrot/multi-lan-controller/common/device/types";
import * as React from "react";
import { Bottombar, ItemContent } from "../../../components";

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";

export const EditCols = React.memo<{
  data: Settings;
  onChange: (cb: (data: Settings) => Settings) => void;
  onSave: () => void;
  isValid: boolean;
}>(({ data, onChange, onSave, isValid }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleMenuOpen = (ev: React.MouseEvent<HTMLButtonElement>) => {
    const currentTarget = ev.currentTarget;
    setAnchorEl((el) => (el ? null : currentTarget));
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const addOptions = React.useMemo(
    () => validSettingsKeys.filter((key) => !data.cols.includes(key)),
    [data.cols]
  );

  const handleDragEnd = React.useCallback(
    (result: DropResult) => {
      if (result.source && result.destination) {
        onChange((data) => {
          const cols = [...data.cols];
          const toMove = cols.splice(result.source.index, 1);
          cols.splice(result.destination.index, 0, ...toMove);
          return {
            ...data,
            cols,
          };
        });
      }
    },
    [onChange]
  );
  const handleRemove = React.useCallback(
    (id: DeviceStatusValues) => {
      onChange((data) => ({
        ...data,
        cols: data.cols.filter((col) => id !== col),
      }));
    },
    [onChange]
  );

  const handleAdd = React.useCallback(
    (id: DeviceStatusValues) => {
      setAnchorEl(null);
      onChange((data) => ({
        ...data,
        cols: [...data.cols, id],
      }));
    },
    [onChange]
  );
  return (
    <>
      <ItemContent>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="cols">
            {(provided) => (
              <List {...provided.droppableProps} ref={provided.innerRef}>
                {data.cols.map((id, index) => (
                  <Draggable key={id} draggableId={id} index={index}>
                    {(provided) => (
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        divider
                        style={provided.draggableProps.style}
                      >
                        <ListItemText primary={data[id]} secondary={id} />
                        <ListItemIcon>
                          <IconButton
                            onClick={() => handleRemove(id)}
                            color="secondary"
                          >
                            <RemoveIcon />
                          </IconButton>
                        </ListItemIcon>
                      </ListItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
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
            Add column
          </Button>
        </Grid>

        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={anchorEl !== null}
          onClose={handleClose}
        >
          {addOptions.map((key) => (
            <MenuItem onClick={() => handleAdd(key)}>{data[key]}</MenuItem>
          ))}
        </Menu>
      </Bottombar>
    </>
  );
});
