import * as React from "react";
import { Component as ComponentInt } from "./types";
import {
  Bottombar,
  Item,
  ItemContent,
  Main,
  Toolbar,
  UserContext,
} from "../../components";
import { Button, Grid, Paper, Typography } from "@material-ui/core";
import { ReactAdminApiContext } from "../../api/context";
import BackIcon from "@material-ui/icons/ArrowBack";
import SaveIcon from "@material-ui/icons/Save";

import {
  DragDropContext,
  Draggable,
  DragStart,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { Link, ReactRouteContext } from "../components";

const Component: ComponentInt = ({
  output: { dashboards, actions, title },
}) => {
  const { navigate } = React.useContext(ReactRouteContext);

  const [droppableId, setDroppableId] = React.useState<string>(null);
  const [sorted, setSorted] = React.useState({
    dashboards,
    actions,
  });
  const adminApi = React.useContext(ReactAdminApiContext);
  const user = React.useContext(UserContext);

  const handleDragStart = React.useCallback(
    (initial: DragStart) => setDroppableId(initial.source.droppableId),
    []
  );

  const handleSave = React.useCallback(() => {
    adminApi("Settings/Sort", {
      actions: sorted.actions.map(({ id }) => id),
      places: sorted.dashboards.map(({ id }) => id),
      devices: sorted.dashboards.reduce<ReadonlyArray<string>>(
        (out, { devices }) => out.concat(devices.map(({ id }) => id)),
        []
      ),
    }).then(() => navigate("dashboard", { match: { mode: "sort" } }));
  }, [adminApi, sorted, navigate]);

  const handleDragEnd = React.useCallback((result: DropResult) => {
    setDroppableId(null);
    if (
      result.destination &&
      result.source &&
      result.destination.droppableId === result.source.droppableId
    ) {
      const droppableId = result.destination.droppableId;
      switch (droppableId) {
        case "actions":
          setSorted((sorted) => {
            const items = [...sorted.actions];
            const toMove = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, ...toMove);
            return {
              ...sorted,
              actions: items,
            };
          });
          break;
        case "places":
          setSorted((sorted) => {
            const items = [...sorted.dashboards];
            const toMove = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, ...toMove);
            return {
              ...sorted,
              dashboards: items,
            };
          });
          break;
        default:
          setSorted((sorted) => {
            const placeIndex = sorted.dashboards.findIndex(
              ({ id }) => id === droppableId
            );
            if (placeIndex === -1) {
              return sorted;
            }
            const place = sorted.dashboards[placeIndex];
            const items = [...place.devices];
            const toMove = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, ...toMove);
            const dashboards = [...sorted.dashboards];
            dashboards.splice(placeIndex, 1, {
              ...place,
              devices: items,
            });
            return {
              ...sorted,
              dashboards,
            };
          });
          break;
      }
    }
  }, []);

  if (user.type === "normal") {
    return null;
  }

  return (
    <Main>
      <Item>
        <Toolbar title={title} />
        <ItemContent>
          <DragDropContext
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
          >
            {sorted.actions.length ? (
              <SortThings
                id="actions"
                title="Sort actions"
                items={sorted.actions}
                droppableId={droppableId}
              />
            ) : null}
            {sorted.dashboards.length ? (
              <>
                <SortThings
                  id="places"
                  key="places"
                  title="Sort places"
                  items={sorted.dashboards}
                  droppableId={droppableId}
                />
                {sorted.dashboards.map(({ id, name, devices }) => (
                  <SortThings
                    id={id}
                    key={id}
                    title={`Sort devices in ${name}`}
                    items={devices}
                    droppableId={droppableId}
                  />
                ))}
              </>
            ) : null}
          </DragDropContext>
        </ItemContent>
        <Bottombar>
          <Grid item>
            <Button
              startIcon={<SaveIcon />}
              variant="contained"
              color="primary"
              onClick={handleSave}
            >
              Save
            </Button>
          </Grid>
          <Grid item>
            <Button
              component={Link}
              match={{}}
              route="dashboard"
              variant="contained"
              startIcon={<BackIcon />}
            >
              Back to dashboard
            </Button>
          </Grid>
        </Bottombar>
      </Item>
    </Main>
  );
};

const SortThings = React.memo(
  <T extends { readonly id: string; readonly name: string }>({
    title,
    id,
    items,
    droppableId,
  }: {
    readonly title: string;
    readonly id: string;
    readonly items: ReadonlyArray<T>;
    readonly droppableId: string;
  }) => {
    return (
      <>
        <Typography variant="h6">{title}</Typography>
        <Droppable
          droppableId={id}
          isDropDisabled={!!(droppableId && droppableId !== id)}
        >
          {(provided) => (
            <div
              {...provided.droppableProps}
              style={{
                margin: "8px 0 16px 0",
              }}
              ref={provided.innerRef}
            >
              {items.map(({ name, id }, index) => (
                <Draggable key={id} draggableId={id} index={index}>
                  {(provided, { isDragging }) => (
                    <Paper
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      variant="outlined"
                      style={{
                        opacity: isDragging ? 0.5 : 1,
                        padding: "8px",
                        margin: "8px 0",
                        ...provided.draggableProps.style,
                      }}
                    >
                      {name}
                    </Paper>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </>
    );
  }
);

export default Component;
