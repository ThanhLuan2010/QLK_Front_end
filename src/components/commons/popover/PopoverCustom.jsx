import React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

const PopoverCustom = ({ isOpen, anchorEl, handleClose }) => {
  const id = isOpen ? "simple-popover" : undefined;

  return (
    <Popover
      id={id}
      open={isOpen}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
    >
      <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
    </Popover>
  );
};

export default PopoverCustom;
