import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from "../../../hook/reduxHooks";
import { doSetIsOpenModel } from "../../../store/slices/commonSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ModelCustom = ({ isOpen }) => {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(doSetIsOpenModel(false));
  };
  return (
    <div>
      <Modal
        keepMounted
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="keep-mounted-modal-title"
            variant="h6"
            component="h2"
          ></Typography>
          <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default ModelCustom;
