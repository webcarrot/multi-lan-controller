import * as React from "react";
import { Bottombar, ItemContent } from "../../../components";
import { Button, Grid, Paper, Typography } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";

import {
  DragDropContext,
  Draggable,
  DragStart,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { Action } from "@webcarrot/multi-lan-controller/common/db/types";
import { DashboardPlace } from "@webcarrot/multi-lan-controller/admin/api/dashboard/types";

type Data = {
  readonly actions: ReadonlyArray<Action>;
  readonly dashboard: ReadonlyArray<DashboardPlace>;
};

export const EditSort = React.memo<
  Data & {
    readonly onChange: (cb: (data: Data) => Data) => void;
    readonly onSave: () => void;
  }
>(({ actions, dashboard, onChange, onSave }) => {
  const [droppableId, setDroppableId] = React.useState<string>(null);

  const handleDragStart = React.useCallback(
    (initial: DragStart) => setDroppableId(initial.source.droppableId),
    []
  );

  const handleDragEnd = React.useCallback(
    (result: DropResult) => {
      setDroppableId(null);
      if (
        result.destination &&
        result.source &&
        result.destination.droppableId === result.source.droppableId
      ) {
        const droppableId = result.destination.droppableId;
        switch (droppableId) {
          case "actions":
            onChange((sorted) => {
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
            onChange((sorted) => {
              const items = [...sorted.dashboard];
              const toMove = items.splice(result.source.index, 1);
              items.splice(result.destination.index, 0, ...toMove);
              return {
                ...sorted,
                dashboard: items,
              };
            });
            break;
          default:
            onChange((sorted) => {
              const placeIndex = sorted.dashboard.findIndex(
                ({ id }) => id === droppableId
              );
              if (placeIndex === -1) {
                return sorted;
              }
              const place = sorted.dashboard[placeIndex];
              const items = [...place.devices];
              const toMove = items.splice(result.source.index, 1);
              items.splice(result.destination.index, 0, ...toMove);
              const dashboard = [...sorted.dashboard];
              dashboard.splice(placeIndex, 1, {
                ...place,
                devices: items,
              });
              return {
                ...sorted,
                dashboard,
              };
            });
            break;
        }
      }
    },
    [onChange]
  );

  return (
    <>
      <ItemContent>
        <DragDropContext
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          {actions.length ? (
            <SortThings
              id="actions"
              title="Sort actions"
              items={actions}
              droppableId={droppableId}
            />
          ) : null}
          {dashboard.length ? (
            <>
              <SortThings
                id="places"
                key="places"
                title="Sort places"
                items={dashboard}
                droppableId={droppableId}
              />
              {dashboard
                .filter(({ devices }) => devices.length > 0)
                .map(({ id, name, devices }) => (
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
            onClick={onSave}
          >
            Save
          </Button>
        </Grid>
      </Bottombar>
    </>
  );
});

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
