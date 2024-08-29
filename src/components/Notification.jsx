import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import i18n from "../i18n/i18n";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { Close } from "@mui/icons-material";

const Notification = ({
  statePhieustore,
  Refreshphieu,
  handleDropdownClick,
  statechinhanh,
}) => {
  useTranslation();
  let nav = useNavigate();
  const { setSelected } = useSidebar();
  const [showPopup, setShowPopup] = useState(false);
  const [info, setInfo] = useState([]);

  const handleClosePopup = () => {
    setShowPopup(false);
  };
console.log("statePhieustore",statePhieustore)
  const CoppyText = (obj) => {
    setInfo(obj.arrayProduct)
console.log("obj",obj.arrayProduct)

    console.log(statechinhanh);
    if (obj.type === "NN") {
      setSelected("Invoices");
      handleDropdownClick();
      nav("/invoices");
    } else {
      if (statechinhanh === "ST00") {
        setSelected("Input");
        nav("/orders", { state: { stateStoreID: obj.StoreID } });
      } else {
        setSelected("Invoices");
        // nav("/invoices");
        setShowPopup(true);
      }
    }
  };
  const CustomPopup = ({ show, handleClose, content }) => {
    return (
      <Dialog
        open={show}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        scroll="paper"
        PaperProps={{
          style: {
            borderRadius: "20px",
            padding: "10px",
            backgroundColor: "white",
            color: "black",
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between">
            {/* <PrintTableButton /> */}
            <Typography variant="h4" fontWeight={"bold"} > {i18n.t("DetailProduct")}</Typography>
            <Box>
              <IconButton
                onClick={handleClose}
                sx={{ color: "black", border: "2px solid black" }}
                size="small"
              >
                <Close />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent style={{ maxHeight: "500px" }}>
          <div className="table-container">
            <table
              id="tabletemp"
              style={{ width: "100%" }}
              className="custom-table"
            >
              <thead>
                <tr>
                  <th>{i18n.t("LOAI_P")}</th>
                  <th>{i18n.t("SOLUONG_P")}</th>
                  <th>{i18n.t("HINHANH_P")}</th>
                </tr>
              </thead>
              <tbody>
                {content && content.map((item) => (
                  <tr key={item.id}>
                    <td>{item.loai}</td>
                    <td>{item.soluong}</td>
                    <td>
                      <img width={100} height={75} src={item.picture}></img>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    );
  };
  return (
    <Box
      bgcolor={"#3F3F3F"}
      borderRadius={"20px"}
      display={"block"}
      flexDirection={"column"}
      sx={{
        transform: "translateX(-100%)",
        position: "absolute",
      }}
      zIndex={1000}
    >
      <Box>
        <Typography textAlign={"center"} p={2} fontSize={"1.2rem"}>
          {i18n.t("MAPN_PX")} - {i18n.t("TINHTRANG_PX")} -{" "}
          {i18n.t("LOAIPHIEU_NHAP")} - {i18n.t("THOIDIEMTAOPHIEU")}
        </Typography>
        <Box maxHeight={"250px"} overflow={"auto"} className="custom-scroll">
          {statePhieustore.map((object, index) => (
            <Box
              px={3}
              key={index}
              onClick={() => CoppyText(object)}
              sx={{
                cursor: "pointer",
                "&:hover": { backgroundColor: "#cecece" },
              }}
              className="dropdown-item"
              bgcolor={"white"}
              color={"#212529"}
              borderBottom={"1px #E0E0E0 solid"}
              flexDirection={"row"}
              alignItems={"center"}
              display={"flex"}
              borderLeft={"1px #cecece solid"}
              gap={1}
            >
              <Typography fontSize={"1.2rem"} variant="h6">
                {object.id}
              </Typography>
              {" | "}
              <Typography
                fontSize={"1rem"}
                variant="h6"
                textAlign={"center"}
                alignItems={"center"}
                justifyContent={"center"}
                display={"flex"}
                color={"white"}
                px={1}
                my={1}
                style={{
                  backgroundColor: "#FFC107",
                  borderRadius: "40px",
                }}
              >
                {object.status}
              </Typography>{" "}
              {" | "}
              {object.loaiphieu === "NK" ? (
                <Typography
                  fontSize={"1rem"}
                  variant="h6"
                  textAlign={"center"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  display={"flex"}
                  color={"white"}
                  px={1}
                  my={1}
                  style={{
                    backgroundColor: "#22C75B",
                    borderRadius: "40px",
                  }}
                >
                  {i18n.t("NK")}
                </Typography>
              ) : (
                <Typography
                  fontSize={"1rem"}
                  variant="h6"
                  textAlign={"center"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  display={"flex"}
                  color={"white"}
                  px={1}
                  my={1}
                  style={{
                    backgroundColor: "#D14444",
                    borderRadius: "40px",
                  }}
                >
                  {i18n.t("NNK")}
                </Typography>
              )}{" "}
              {" | "}
              <Typography
                fontSize={"1.2rem"}
                variant="h6"
                textAlign={"center"}
                alignItems={"center"}
                justifyContent={"center"}
                display={"flex"}
              >
                {object.ngaylap}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <Box
        bgcolor={"white"}
        borderBottom={"1px #E0E0E0 solid"}
        p={1}
        sx={{
          borderBottomLeftRadius: "20px",
          borderBottomRightRadius: "20px",
        }}
      >
        <Button
          style={{ fontSize: "1rem", color: "#000" }}
          onClick={Refreshphieu}
        >
          Refresh
        </Button>
      </Box>
      <CustomPopup
        show={showPopup}
        handleClose={handleClosePopup}
        content={info}
      />
    </Box>
  );
};

export default Notification;
