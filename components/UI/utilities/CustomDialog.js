import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";
import { MdClose } from "react-icons/md";
import CloseButton from "./CloseButton";

function CustomDialog({ open, width, Close, title, children, className }) {
  return (
    <Dialog
      open={open}
      onClose={Close}
      disableAutoFocus
      disableEnforceFocus
      disableRestoreFocus
      fullWidth
      maxWidth={width ?? "lg"}
    >
      <DialogTitle className="flex justify-between items-center">
        <p className={`capitalize ${className ?? ""} `}>{title}</p>
        <CloseButton onClick={Close} />
      </DialogTitle>
      {children}
    </Dialog>
  );
}

export default CustomDialog;
