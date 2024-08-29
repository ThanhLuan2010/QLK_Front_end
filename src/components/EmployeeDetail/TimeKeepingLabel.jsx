import { Box, IconButton, TextField, Typography } from "@mui/material";
import React from "react";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import EmployeeDetail from "./EmployeeDetail";
import i18n from "../../i18n/i18n";
const TimeKeepingLabel = ({
  index,
  timeIn,
  timeOut,
  handleDelete,
  handleTimeChange,
}) => {
  const classes = EmployeeDetail();

  return (
    <Box
      index={index}
      borderRadius={"10px"}
      display={"flex"}
      height={65}
      width={"100%"}
      marginTop={2}
    >
      <Box
        width={7}
        sx={{
          backgroundColor: "#121212",
          borderTopLeftRadius: "10px",
          borderBottomLeftRadius: "10px",
        }}
        height={65}
      ></Box>
      <Box
        borderRadius={"10px"}
        sx={{ backgroundColor: "#F8F8F8" }}
        height={65}
        gap={2}
        flexDirection={"row"}
        alignItems={"center"}
        display={"flex"}
        padding={2}
        width={"100%"}
        fontSize={"16px"}
      >
        <Box display={"flex"} gap={1} flexDirection={"column"}>
          <Typography fontSize={"0.8rem"}>{i18n.t("Checkin")}</Typography>
          <Typography fontSize={"0.8rem"}>{i18n.t("Checkout")}</Typography>
        </Box>
        <Box flexDirection={"column"} display={"flex"}>
          <TextField
            type="time"
            value={timeIn}
            onChange={(e) => handleTimeChange(index, "checkIn", e.target.value)}
            fullWidth
            className={classes.textFieldTime}
          />
          <TextField
            type="time"
            value={timeOut}
            onChange={(e) =>
              handleTimeChange(index, "checkOut", e.target.value)
            }
            fullWidth
            className={classes.textFieldTime}
          />
        </Box>
      </Box>
      <Box
        marginLeft={2}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <IconButton
          onClick={() => handleDelete(index)}
          size="small"
          color="primary"
          sx={{
            border: "2px solid #D14444",
            "&: hover": {
              backgroundColor: "#FFE5E5",
            },
          }}
        >
          <DeleteForeverOutlinedIcon
            sx={{ color: "#D14444", fontSize: "24px" }}
          />
        </IconButton>
      </Box>
    </Box>
  );
};
export default TimeKeepingLabel;
