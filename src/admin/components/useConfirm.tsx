import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from "@material-ui/core";
import * as React from "react";

export const useConfirm = (
  message: string,
  onConfirm: () => void
): [JSX.Element, () => void] => {
  const [showDialog, setShowDialog] = React.useState(false);
  const handleAbort = React.useCallback(() => setShowDialog(false), []);
  const handleSave = React.useCallback(() => {
    setShowDialog(false);
    onConfirm();
  }, [onConfirm]);

  let modalContent: JSX.Element = null;
  if (showDialog) {
    modalContent = (
      <Dialog open onClose={handleAbort} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Please Confirm</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAbort} color="secondary" variant="contained">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return [modalContent, React.useCallback(() => setShowDialog(true), [])];
};
