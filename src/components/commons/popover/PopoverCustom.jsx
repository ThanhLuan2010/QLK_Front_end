import React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "../../../hook/reduxHooks";
import i18n from "../../../i18n/i18n";

const PopoverCustom = ({ isOpen, anchorEl, handleClose, dayData }) => {
  const id = isOpen ? "simple-popover" : undefined;

  const { dataInPopover } = useAppSelector((state) => state.common);

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
      {dataInPopover && dataInPopover.length > 0 ? (
        dataInPopover.map((item, index) => {
          return (
            <div style={{ paddingLeft: 8, paddingRight: 8 }} key={index}>
              <span>
                {i18n.t("SHIFT")} {index + 1}:{" "}
              </span>
              <span>
                {item?.times.checkIn} - {item?.times.checkOut}
              </span>
            </div>
          );
        })
      ) : (
        <Typography sx={{ p: 2 }}>{i18n.t("NOT_DATA")}</Typography>
      )}
    </Popover>
  );
};

export default PopoverCustom;
