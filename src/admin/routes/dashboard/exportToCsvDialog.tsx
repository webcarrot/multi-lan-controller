import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  DialogActions,
  Button,
} from "@material-ui/core";
import {
  CSVLine,
  makeCsvLine,
} from "@webcarrot/multi-lan-controller/common/utils/csv";
import { downloadFile } from "@webcarrot/multi-lan-controller/common/utils/downloadFile";
import * as React from "react";
import { InternalActionLoggerRecord } from "../../api/logger/types";
import { useAdminApiCall } from "../../components";
import ExportIcon from "@material-ui/icons/CloudDownload";
import CancelIcon from "@material-ui/icons/Cancel";

const InputProps = { type: "date" };
const InputLabelProps = {
  shrink: true,
};

const formatToCsv = (items: ReadonlyArray<InternalActionLoggerRecord>) =>
  "\uFEFF" +
  [["date", "success", "user", "action", "device", "place"] as CSVLine]
    .concat(
      items.map<CSVLine>(({ date, user, action, device, place, success }) => [
        new Date(date).toISOString(),
        success ? "yes" : "no",
        user,
        action,
        device,
        place,
      ])
    )
    .map(makeCsvLine)
    .join("\r\n");

export const ExportToCsvDialog = React.memo<{ onClose: () => void }>(
  ({ onClose }) => {
    const [query, setQuery] = React.useState({ fromDate: "", toDate: "" });

    const adminApi = useAdminApiCall();

    const handleExport = React.useCallback(() => {
      adminApi("Dashboard/Logs", query)
        .then(formatToCsv)
        .then((data) => downloadFile(data, "export.csv", "text/csv"))
        .then(onClose);
    }, [query]);

    const handleDateChange = React.useCallback(
      (ev: React.ChangeEvent<HTMLInputElement>) => {
        const name = ev.target.name;
        const value = ev.target.value;
        setQuery((query) => ({
          ...query,
          [name]: value,
        }));
      },
      []
    );
    return (
      <Dialog open onClose={onClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          Export history of actions to CSV
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="From date"
                value={query.fromDate || ""}
                name="fromDate"
                onChange={handleDateChange}
                InputProps={InputProps}
                InputLabelProps={InputLabelProps}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="To date"
                value={query.toDate || ""}
                name="toDate"
                onChange={handleDateChange}
                InputProps={InputProps}
                InputLabelProps={InputLabelProps}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            color="secondary"
            variant="contained"
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            color="primary"
            variant="contained"
            startIcon={<ExportIcon />}
          >
            Export
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);
