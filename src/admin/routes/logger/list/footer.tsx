import * as React from "react";
import { AppBar, TablePagination } from "@material-ui/core";
import { InternalLoggerMeta } from "@webcarrot/multi-lan-controller/admin/api/logger/types";

export const Footer = React.memo<{
  meta: InternalLoggerMeta;
  onChange: (meta: InternalLoggerMeta) => void;
  onExport: (meta: InternalLoggerMeta) => Promise<string>;
}>(({ meta, onChange }) => {
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

  const rowsPerPage = meta.limit || 50;
  const page = meta.offset / rowsPerPage;

  return (
    <AppBar component="footer" position="static" color="default">
      <TablePagination
        rowsPerPageOptions={[50, 100, 200]}
        component="nav"
        count={meta.total}
        rowsPerPage={rowsPerPage}
        page={page}
        labelRowsPerPage="Per page"
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </AppBar>
  );
});
