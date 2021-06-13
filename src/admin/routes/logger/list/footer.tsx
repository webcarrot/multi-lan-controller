import * as React from "react";
import { Button, Grid, TablePagination, TextField } from "@material-ui/core";
import { InternalLoggerMeta } from "@webcarrot/multi-lan-controller/admin/api/logger/types";
import { Bottombar } from "@webcarrot/multi-lan-controller/admin/components";
import { downloadFile } from "@webcarrot/multi-lan-controller/common/utils/downloadFile";
import ExportIcon from "@material-ui/icons/CloudDownload";

const InputProps = { type: "date" };
const InputLabelProps = {
  shrink: true,
};
const GROW = { flexGrow: 1 };

export const Footer = React.memo<{
  meta: InternalLoggerMeta;
  onChange: (meta: InternalLoggerMeta) => void;
  onExport: (meta: InternalLoggerMeta) => Promise<string>;
}>(({ meta, onChange, onExport }) => {
  const handleChangePage = React.useCallback(
    (_: any, page: number) =>
      onChange({
        ...meta,
        offset: page * meta.limit,
      }),
    [onChange, meta]
  );

  const handleChangeRowsPerPage = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) =>
      onChange({
        ...meta,
        offset: 0,
        limit: parseInt(ev.target.value),
      }),
    [onChange, meta]
  );

  const handleDateChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) =>
      onChange({
        ...meta,
        offset: 0,
        [ev.target.name]: ev.target.value,
      }),
    [onChange, meta]
  );

  const handleExport = React.useCallback(() => {
    onExport(meta).then((data) => downloadFile(data, "export.csv", "text/csv"));
  }, [onExport, meta]);

  const rowsPerPage = meta.limit || 25;
  const page = meta.offset / rowsPerPage;

  return (
    <Bottombar>
      <Grid item>
        <TextField
          label="From date"
          value={meta.fromDate || ""}
          name="fromDate"
          onChange={handleDateChange}
          InputProps={InputProps}
          InputLabelProps={InputLabelProps}
        />
      </Grid>
      <Grid item>
        <TextField
          label="To date"
          value={meta.toDate || ""}
          name="toDate"
          onChange={handleDateChange}
          InputProps={InputProps}
          InputLabelProps={InputLabelProps}
        />
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={handleExport}
          startIcon={<ExportIcon />}
        >
          Export to CSV
        </Button>
      </Grid>
      <Grid item style={GROW}>
        <TablePagination
          rowsPerPageOptions={[25, 50, 100, 200]}
          component="nav"
          count={meta.total}
          rowsPerPage={rowsPerPage}
          page={page}
          labelRowsPerPage="Per page"
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Grid>
    </Bottombar>
  );
});
