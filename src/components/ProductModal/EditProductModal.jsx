import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import i18n from "../../i18n/i18n";
import useStyles from "./ProductModalStyles";
import { HandleUpload } from "../../scenes/sendfileFTP/sendfileFTP";
import CloseIcon from "@mui/icons-material/Close";
import { Clear, Add, Check } from "@mui/icons-material";
import { Slider } from "@mui/material";
import {
  AddNameProduct,
  DeleteNameProduct,
  EditProduct,
  GetNameProduct,
} from "../../scenes/form/handleproduct";
import "../EmployeeDetail/style.css";
const EditProductModal = ({
  open,
  stateProduct,
  setStateProduct,
  handleClose,
  statechinhanh,
  fetchingGettAllProduct_by_storeID,
}) => {
  const [focusedField, setFocusedField] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const classes = useStyles();
  const [stateimage, setStateimg] = useState(stateProduct.picture);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };
  const handleModalClose = () => {
    fetchingGettAllProduct_by_storeID(statechinhanh);
    handleClose();
  };
  const handleImageUpload = async (e, setCurrentImage) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      console.log("No file selected");
      return;
    }
    setIsImageUploading(true);
    const render = new FileReader();
    render.readAsDataURL(e.target.files[0]);
    render.onload = () => {
      setCurrentImage(render.result);
    };
    render.onerror = (error) => {
      console.log("error" + error);
    };
    const file = e.target.files[0];
    try {
      const url = await HandleUpload(file, "STORE", statechinhanh);
      setStateimg(url);
      setStateProduct((prevForm) => ({
        ...prevForm,
        pictureview: url,
        picture: url,
      }));
    } catch (error) {
      console.error("Failed to upload image", error);
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await EditProduct(stateProduct);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 500);
    } catch (error) {
      console.error("Failed to update product", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setStateProduct((prevForm) => {
      const updatedForm = {
        ...prevForm,
        [name]: value,
      };
      return updatedForm;
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleModalClose}
      aria-labelledby="form-dialog-title"
      PaperProps={{
        style: {
          borderRadius: "40px",
          padding: "10px",
          backgroundColor: "white",
          width: "450px",
        },
      }}
    >
      <DialogTitle id="form-dialog-title" className={classes.dialogContent}>
        <Box
          display="flex"
          flexDirection={"row"}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4" component="h2" fontWeight={"bold"}>
            {i18n.t("THEMSP_P")}
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{ color: "black", border: "2px solid black" }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {/* {Object.keys(errorMessages).map((key) => (
          <Typography key={key} color="error">
            {errorMessages[key]}
          </Typography>
        ))} */}
        <Typography
          variant="body1"
          color={focusedField === "loai" ? "black" : "#D9D2D2"}
          onBlur={handleBlur}
        >
          {i18n.t("LOAI_P")}
        </Typography>{" "}
        <TextField
          id="loai"
          name="loai"
          type="text"
          readonly
          fullWidth
          value={stateProduct.loai}
          className={classes.textField}
        />
        <Typography
          variant="body1"
          color={focusedField === "name" ? "black" : "#D9D2D2"}
          onFocus={() => handleFocus("name")}
          onBlur={handleBlur}
        >
          {i18n.t("MASP_P")}
        </Typography>
        <TextField
          id="name"
          name="name"
          type="text"
          fullWidth
          readonly
          value={stateProduct.id}
          onChange={handleChange}
          onFocus={() => handleFocus("name")}
          onBlur={handleBlur}
          className={classes.textField}
        />
        <Typography
          variant="body1"
          color={focusedField === "soluong" ? "black" : "#D9D2D2"}
          onFocus={() => handleFocus("soluong")}
          onBlur={handleBlur}
        >
          {i18n.t("SOLUONG_P")}
        </Typography>
        <TextField
          id="soluong"
          name="soluong"
          type="number"
          fullWidth
          value={stateProduct.soluong}
          onChange={handleChange}
          onFocus={() => handleFocus("soluong")}
          onBlur={handleBlur}
          className={classes.textField}
        />
        <Box>
          <Typography
            variant="body1"
            color={focusedField === "sotien" ? "black" : "#D9D2D2"}
            onFocus={() => handleFocus("sotien")}
            onBlur={handleBlur}
          >
            {i18n.t("SOTIEN_NP")}
          </Typography>
          <TextField
            id="sotien"
            name="sotien"
            type="number"
            fullWidth
            readonly
            value={stateProduct.sotien}
            className={classes.textField}
            inputProps={{
              min: 20000,
              max: 150000,
              step: 5000,
            }}
          />
          <Box flexDirection={"column"} display={"flex"}>
            <input
              accept="image/*"
              onChange={(e) => {
                handleImageUpload(e, setStateimg, "pictureview");
              }}
              type="file"
              id="pictureview"
              style={{ marginTop: "16px" }}
            />

            <img
              width={"100%"}
              height={"auto"}
              src={stateimage}
              alt="Product"
              style={{ marginTop: "16px" }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Box>
          <Button
            onClick={() => handleUpdate()}
            disabled={isImageUploading}
            className={classes.button}
            sx={{
              backgroundColor: "#000 !important",
              "&:hover": {
                backgroundColor: "#2D2D2D !important",
              },
              "&:disabled": {
                backgroundColor: "#B1B1B1 !important",
              },
              width: "100%",
              padding: "8px 20px !important",
              maxWidth: "150px !important",
              borderRadius: "40px !important",
              color: "#fff !important",
            }}
          >
            {isImageUploading || isLoading ? (
              <CircularProgress size={24} />
            ) : success ? (
              <Check />
            ) : (
              <Typography
                color={"white"}
                fontSize={"0.9rem"}
                textTransform={"none"}
              >
                {i18n.t("BTN_XACNHAN")}
              </Typography>
            )}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductModal;
