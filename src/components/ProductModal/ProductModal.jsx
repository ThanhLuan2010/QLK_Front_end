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
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import i18n from "../../i18n/i18n";
import useStyles from "./ProductModalStyles";
import { HandleUpload } from "../../scenes/sendfileFTP/sendfileFTP";
import CloseIcon from "@mui/icons-material/Close";
import { Clear, Add } from "@mui/icons-material";
import { Slider } from "@mui/material";
import {
  AddNameProduct,
  DeleteNameProduct,
  GetNameProduct,
} from "../../scenes/form/handleproduct";
import "../EmployeeDetail/style.css";
import CircleChecked from "@mui/icons-material/CheckCircle";
import CircleUnchecked from "@mui/icons-material/RadioButtonUnchecked";
const ProductModal = ({
  open,
  handleClose,
  stateFormProduct,
  setStateFormProduct,
  addProduct,
  errorMessages,
  stateCheckaccess,
  stateimage,
  stateProduct,
  statechinhanhdau,
  setStateimg,
  stateProductview,
}) => {
  const [focusedField, setFocusedField] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const classes = useStyles();
  const [existProduct, setExistProduct] = useState(false);
  const [productOptions, setProductOptions] = useState([]);
  const [existCount, setExistCount] = useState(0);
  useEffect(() => {
    if (open) {
      fetchProductName();
    }
  }, [open]);
  const fetchProductName = async () => {
    const res = await GetNameProduct();
    const productOptions = res.map((product) => ({
      id: product._id,
      name: product.name,
    }));
    setProductOptions(productOptions);
  };
  const handleOpenNewProductDialog = () => {
    setIsNewProductOpen(true);
  };

  const handleCloseNewProductDialog = () => {
    setIsNewProductOpen(false);
    setNewProductName("");
  };
  const handleDelete = async (id) => {
    await DeleteNameProduct(id);
    fetchProductName();
    setProductOptions(productOptions.filter((item) => item.id !== id.id));
  };

  const handleAddNewProduct = async () => {
    if (newProductName.trim() !== "") {
      if (productOptions.some((product) => product.name === newProductName)) {
        alert("Tên sản phẩm đã tồn tại!");
        return;
      }
      try {
        await AddNameProduct(newProductName);
        fetchProductName();
        setNewProductName("");
      } catch (error) {
        console.error("Error adding product name:", error);
      } finally {
        setIsNewProductOpen(false);
      }
    }
  };
  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleImageUpload = async (e, setCurrentImage) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      return;
    }
    setIsImageUploading(true);
    const render = new FileReader();
    render.readAsDataURL(e.target.files[0]);
    render.onload = () => {
      setCurrentImage(render.result);
    };
    render.onerror = (error) => {};
    const file = e.target.files[0];
    try {
      const url = await HandleUpload(file, "STORE", statechinhanhdau);
      setStateimg(url);
      setStateFormProduct((prevForm) => ({
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
  const handleSliderChange = (_, newValue) => {
    setStateFormProduct((prevForm) => ({
      ...prevForm,
      sotien: newValue,
    }));
    handleChange({ target: { name: "sotien", value: newValue } });
  };
  const generateCode = (name, sotien) => {
    if (!name || typeof name !== "string") return "";

    // Tách các chữ cái đầu tiên của mỗi từ trong name
    const firstLetters = name
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("");

    const sotienTrimmed = Math.floor(sotien / 1000);

    return `${firstLetters}${sotienTrimmed}`;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    const arrayOfNumbers = stateProduct.map((obj) =>
      parseInt(obj.id?.replace(/[^\d]/g, ""), 10)
    );
    let maxNumber = Math.max(...arrayOfNumbers);
    const result = 1 / 0;
    const negativeInfinity = -1 / 0;

    if (maxNumber === negativeInfinity || maxNumber === result) {
      maxNumber = 0;
    }
    let lenghtState = maxNumber + 1;

    setStateFormProduct((prevForm) => {
      const updatedForm = {
        ...prevForm,
        [name]: value,
        StoreID: statechinhanhdau,
        id: "POR" + lenghtState,
      };
      if (!existProduct) {
        if (name === "loai" || name === "sotien") {
          updatedForm.name = generateCode(updatedForm.loai, updatedForm.sotien);
        }
      }
      if (existProduct && name === "name") {
        const selectedProduct = stateProductview.find((product) => {
          return product.id === value;
        });
        console.log("selectedProduct", selectedProduct.soluong);
        if (selectedProduct) {
          updatedForm.sotien = selectedProduct.sotien;
          updatedForm.sotienThucTe = selectedProduct.sotienThucTe;
          updatedForm.pictureview = selectedProduct.picture;
          updatedForm.picture = selectedProduct.picture;
          setExistCount(selectedProduct.soluong);
        }
      }
      return updatedForm;
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        <FormControlLabel
          control={
            <Checkbox
              sx={{
                color: "black",
              }}
              icon={<CircleUnchecked sx={{ color: "black" }} />}
              checkedIcon={<CircleChecked sx={{ color: "black" }} />}
              checked={existProduct}
              onChange={() => {
                setStateFormProduct((prevForm) => ({
                  ...prevForm,
                  name: "",
                }));
                setExistProduct(!existProduct);
              }}
            />
          }
          label={
            <Typography variant="body1" style={{ fontWeight: "600" }}>
              Thêm sản phẩm đã có trong kho
            </Typography>
          }
        />
        {Object.keys(errorMessages).map((key) => (
          <Typography key={key} color="error">
            {errorMessages[key]}
          </Typography>
        ))}
        <Typography
          variant="body1"
          color={focusedField === "loai" ? "black" : "#D9D2D2"}
          onFocus={() => handleFocus("loai")}
          onBlur={handleBlur}
        >
          {i18n.t("LOAI_P")}
        </Typography>{" "}
        <Box>
          <FormControl fullWidth>
            <Select
              onOpen={() => setIsSelectOpen(true)}
              onClose={() => setIsSelectOpen(false)}
              labelId="product-name-label"
              className={classes.select}
              id="loai"
              name="loai"
              value={stateFormProduct.loai}
              onChange={handleChange}
              onFocus={() => {
                handleFocus("loai");
              }}
              onBlur={handleBlur}
              MenuProps={{
                PaperProps: {
                  style: {
                    backgroundColor: "#3f3f3f",
                    boxShadow: "none",
                    borderRadius: " 20px",
                    marginTop: "8px",
                    transition: "background-color 0.3s ease-in-out",
                    maxHeight: 300,
                    padding: 10,
                    overflowY: "hidden",
                  },
                },
                MenuListProps: {
                  className: "custom-scroll",
                  style: {
                    maxHeight: 300,
                    overflowY: "auto",
                  },
                },
              }}
            >
              {productOptions.map((product) => (
                <MenuItem key={product.id} value={product.name}>
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    width={"100%"}
                    flexDirection={"row"}
                    alignItems={"center"}
                    height={"100%"}
                    maxHeight={22}
                    borderRadius={"100px"}
                  >
                    {product.name}
                    <IconButton onClick={() => handleDelete(product.id)}>
                      <Clear />
                    </IconButton>
                  </Box>
                </MenuItem>
              ))}
              <MenuItem onClick={handleOpenNewProductDialog}>
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  flexDirection={"row"}
                  width={"100%"}
                  gap={1}
                >
                  <Add />
                  <Typography variant="body1">Thêm sản phẩm</Typography>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Typography
          variant="body1"
          color={focusedField === "name" ? "black" : "#D9D2D2"}
          onFocus={() => handleFocus("name")}
          onBlur={handleBlur}
        >
          {i18n.t("MASP_P")}
        </Typography>
        {!existProduct ? (
          <TextField
            id="name"
            name="name"
            type="text"
            fullWidth
            value={stateFormProduct.name}
            onChange={handleChange}
            onFocus={() => handleFocus("name")}
            onBlur={handleBlur}
            className={classes.textField}
          />
        ) : (
          <FormControl fullWidth>
            <Select
              onOpen={() => setIsSelectOpen(true)}
              onClose={() => setIsSelectOpen(false)}
              labelId="product-name-label"
              className={classes.select}
              id="name"
              name="name"
              value={stateFormProduct.name}
              onChange={handleChange}
              onFocus={() => {
                handleFocus("name");
              }}
              onBlur={handleBlur}
              MenuProps={{
                PaperProps: {
                  style: {
                    backgroundColor: "#3f3f3f",
                    boxShadow: "none",
                    borderRadius: " 20px",
                    marginTop: "8px",
                    transition: "background-color 0.3s ease-in-out",
                    maxHeight: 300,
                    padding: 10,
                    overflowY: "hidden",
                  },
                },
                MenuListProps: {
                  className: "custom-scroll",
                  style: {
                    maxHeight: 300,
                    overflowY: "auto",
                  },
                },
              }}
            >
              {stateProductview
                .filter(
                  (product) =>
                    product.loai.toUpperCase() ===
                    stateFormProduct.loai.toUpperCase()
                )
                .map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      width={"100%"}
                      flexDirection={"row"}
                      alignItems={"center"}
                      height={"100%"}
                      maxHeight={22}
                      borderRadius={"100px"}
                    >
                      {product.id}
                    </Box>
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        )}
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
          value={stateFormProduct.soluong}
          onChange={handleChange}
          onFocus={() => handleFocus("soluong")}
          onBlur={handleBlur}
          className={classes.textField}
        />
        {existProduct && (
          <Box
            display={"flex"}
            flexDirection={"row"}
            gap={1}
            alignItems={"center"}
          >
            <Typography
              variant="body1"
              color={focusedField === "soluong" ? "black" : "#D9D2D2"}
              onFocus={() => handleFocus("soluong")}
              onBlur={handleBlur}
            >
              {i18n.t("REMAIN")}:
            </Typography>
            <Typography
              variant="h6"
              color={"red"}
              onFocus={() => handleFocus("soluong")}
              onBlur={handleBlur}
            >
              {existCount}
            </Typography>
          </Box>
        )}
        {!existProduct && (
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
              value={stateFormProduct.sotien}
              onChange={handleChange}
              onFocus={() => handleFocus("sotien")}
              onBlur={handleBlur}
              className={classes.textField}
              inputProps={{
                min: 20000,
                max: 150000,
                step: 5000,
              }}
            />
            <Slider
              value={stateFormProduct.sotien}
              min={20000}
              max={150000}
              step={5000}
              marks
              aria-label="Temperature"
              color="primary.main"
              valueLabelDisplay="auto"
              onChange={handleSliderChange}
            />
            {/* {stateCheckaccess && (
              <Box>
                <Typography    
                  variant="body1"
                  color={focusedField === "sotienthucte" ? "black" : "#D9D2D2"}
                  onFocus={() => handleFocus("sotienthucte")}
                  onBlur={handleBlur}
                >
                  Số tiền thực tế
                </Typography>
                <TextField
                  id="sotienthucte"
                  name="sotienthucte"
                  type="number"
                  fullWidth
                  value={stateFormProduct.sotienthucte}
                  onChange={handleChange}
                  onFocus={() => handleFocus("sotienthucte")}
                  onBlur={handleBlur}
                  className={classes.textField}
                />
              </Box>
            )} */}
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
              {stateimage && (
                <img
                  width={"100%"}
                  height={"auto"}
                  src={stateimage}
                  alt="Product"
                  style={{ marginTop: "16px" }}
                />
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Box>
          <Button
            onClick={() => {
              addProduct();
              setExistCount(0);
            }}
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
            {isImageUploading ? (
              <CircularProgress size={24} />
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
      <Dialog
        open={isNewProductOpen}
        onClose={handleCloseNewProductDialog}
        PaperProps={{
          style: {
            borderRadius: "20px",
            padding: "10px",
            backgroundColor: "black",
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h5">Thêm loại sản phẩm</Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="newProductName"
            type="text"
            className={classes.textFieldAddProduct}
            fullWidth
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="inherit"
            sx={{ borderRadius: "30px" }}
            onClick={handleCloseNewProductDialog}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="inherit"
            sx={{
              borderRadius: "30px",
              backgroundColor: "white",
              color: "black",
            }}
            onClick={handleAddNewProduct}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default ProductModal;
