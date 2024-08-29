import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputAdornment,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import "./style.css";
import { useState, useEffect } from "react";
import { Get_all_store_By_userid } from "../contacts/handlestore";
import { createPhieu } from "./handleform";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import CSS
import ReactLoading from "react-loading";
import i18n from "../../i18n/i18n";
import { useTranslation } from "react-i18next";
import { Get_all_Phieu_Store_By_StoreID } from "../invoices/handlePhieustore";
import { CreateIdMaxValueOfarray } from "../method";
import { Get_all_Product_By_StoreID } from "./handleproduct";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import HandleAccessAccount from "../handleAccess/handleAccess";
import AddIcon from "@mui/icons-material/AddCircleOutline";
import ProductModal from "../../components/ProductModal/ProductModal";
import DatePicker from "react-datepicker";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CommonStyle from "../../components/CommonStyle";
import CategoryList from "../../components/Inventory/CategoryList";
import { Delete } from "@mui/icons-material";
import { updateFirebasePhieuStore } from "../../utils/firebaseUtils";

const today = new Date();
const Form = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  useTranslation();
  const classes = CommonStyle();
  const [stateID, setstateID] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [stateimageFileName, setStateimgFileName] = useState("");
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [stateCheckaccess, setstateCheckaccess] = useState(false);
  const [stateupdatesoluong, setstateupdatesoluong] = useState({
    usoluong: 1,
  });
  const [selectedLoai, setSelectedLoai] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleLoaiChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedLoai(typeof value === "string" ? value.split(",") : value);
  };
  const handleItemSelect = (item, isSelected) => {
    setSelectedItems((prevSelectedItems) => {
      if (isSelected) {
        return [...prevSelectedItems, item];
      } else {
        return prevSelectedItems.filter(
          (selectedItem) => selectedItem.id !== item.id
        );
      }
    });
  };

  const handleDateChange = (date) => {
    if (date) {
      // const formattedDate = date.toISOString().split("T")[0];
      setStatePhieu((prev) => ({
        ...prev,
        thoidiem: date,
      }));
      setisShowerrorDate(false);
    }
  };

  const formatDate = (event) => {
    // Kiểm tra định dạng
    // if (!/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
    //   console.log("input inputDate: " + inputDate);
    //   setErrorMessage("Invalid date format. Please use YYYY-MM-DD.");
    // }
    setisShowerrorDate(false);

    setStatePhieu({
      ...statePhieu,
      [event.target.name]: event.target.value,
    });
  };
  const handleSelectionModelChange = (newSelectionModel) => {
    const hasAcceptedOrCancelled = newSelectionModel.some((selectedId) => {
      const selectedRow = stateProductview.find((row) => row.id === selectedId);
      return selectedRow && selectedRow.soluong === 0;
    });
    if (hasAcceptedOrCancelled) {
      alert("Sản phẩm này đã hết !!");
      return;
    }
    setSelectionModel(newSelectionModel);
  };

  const fetchingGettAllPhieu_by_StoreID = async (x) => {
    const check = await Get_all_Phieu_Store_By_StoreID(x);

    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      const checkIDMAX = CreateIdMaxValueOfarray(
        "PN",
        JSON.parse(resolvedResult),
        code
      );
      setstateID(checkIDMAX);
    } else {
      const checkIDMAX = CreateIdMaxValueOfarray("PN", JSON.parse(check), code);

      setstateID(checkIDMAX);
    }
  };
  const fetchingGettAllProduct_by_storeID = async (x) => {
    const check = await Get_all_Product_By_StoreID(x);

    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;
      setStateProductview(JSON.parse(resolvedResult));
    } else {
      setStateProductview(JSON.parse(check));
    }
  };

  const [stateimage, setStateimg] = useState("");
  const [stateProduct, setStateProduct] = useState([]);
  const [stateProductview, setStateProductview] = useState([]);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  let chinhanhdau = "";
  let code = "";
  const [stateCode, setstateCode] = useState("");
  const [statesotienbandau, setsotienbandau] = useState(0);
  const [statesotienThucTebandau, setsotienThucTebandau] = useState(0);
  const [statechinhanhdau, setchinhanhdau] = useState("");
  const [isshowError, setisshowError] = useState(false);
  const [isshowErrorTable, setisshowErrorTable] = useState(false);
  const [isShowerrorDate, setisShowerrorDate] = useState(false);
  const [isloading, setisloading] = useState(false);
  const [categorySelectionModels, setCategorySelectionModels] = useState({});
  const [selectedProductsByCategory, setSelectedProductsByCategory] = useState(
    {}
  );
  const [stateFormProduct, setStateFormProduct] = useState({
    id: "",
    name: "",
    pictureview: "...",
    loai: "",
    soluong: 0,
    status: "GOOD",
    StoreID: "",
    sotien: 0,
    sotienthucte: 0,
    xuatxu: "",
    behavior: "ADMIN ADD",
  });
  const [errorMessages, setErrorMessages] = useState({
    name: "",
    loai: "",
    soluong: "",

    picture: "",
  });
  const [statePhieu, setStatePhieu] = useState({
    sotien: 0,
    sotienthucte: 0,
    loaiphieu: "",
    thoidiem: today,
  });
  useEffect(() => {
    setStatePhieu((prevState) => ({
      ...prevState,
      loaiphieu: stateCheckaccess ? "NN" : "NK",
    }));
  }, [stateCheckaccess]);
  const onhandlechangePhieu = (event) => {
    setisshowError(false);
    setisshowErrorTable(false);

    if (event.target.name === "loaiphieu") {
      setsotienbandau(0);
      setsotienThucTebandau(0);
      setStateProduct([]);
      setStatePhieu({
        ...statePhieu,
        sotien: 0,
        sotienthucte: 0,
        [event.target.name]: event.target.value,
      });
    } else {
      setStatePhieu({
        ...statePhieu,
        [event.target.name]: event.target.value,
      });
    }
  };
  const onchangeupdatesoluong = (event) => {
    setstateupdatesoluong({
      ...stateupdatesoluong,
      [event.target.name]: event.target.value,
    });
  };
  const handleEditProductNEW = (e, loai) => {
    console.log(e);
    const updatedRows = stateProduct.map((row) =>
      row.id === e.target.id ? { ...row, soluong: e.target.value } : row
    );
    let sumallvalue = 0;
    updatedRows.forEach((item) => (sumallvalue += item.sotien * item.soluong));

    if (statePhieu.loaiphieu === "NK") {
      let newsotien = sumallvalue;

      // setsotienbandau(newsotien);
      setStatePhieu({
        ...statePhieu,
        sotien: newsotien,
      });
    }
    console.log("updatedRows", updatedRows);
    setStateProduct(updatedRows);
    const selectedCategoryProductIndex = selectedProductsByCategory[
      loai
    ].findIndex((item) => item.id === e.target.id);

    if (selectedCategoryProductIndex > -1) {
      const newSelectedProductCate = [...selectedProductsByCategory[loai]];
      newSelectedProductCate[selectedCategoryProductIndex]["soluong"] =
        e.target.value;
      setSelectedProductsByCategory((prev) => ({
        ...prev,
        [loai]: newSelectedProductCate,
      }));
    }
  };

  const handleEditProduct = (productId) => {
    const getProductFirst = stateProduct.filter(
      (item) => item.id === productId
    );

    const checksoluongrow = stateProductview.filter(
      (item) => item.id === productId
    );
    if (statePhieu.loaiphieu === "NK") {
      if (
        checksoluongrow[0].soluong < stateupdatesoluong.usoluong ||
        stateupdatesoluong.usoluong <= 0
      ) {
        alert(
          "Số lượng nhập có giá trị lớn hơn số lượng đang có hoặc nhỏ hơn 0"
        );

        return;
      }
    }

    const updatedRows = stateProduct.map((row) =>
      row.id === productId
        ? { ...row, soluong: stateupdatesoluong.usoluong }
        : row
    );
    if (statePhieu.loaiphieu === "NK") {
      let newsotien =
        statePhieu.sotien -
        getProductFirst[0].sotien * getProductFirst[0].soluong +
        checksoluongrow[0].sotien * stateupdatesoluong.usoluong;

      setsotienbandau(newsotien);
      setStatePhieu({
        ...statePhieu,
        sotien: newsotien,
      });
    }

    setStateProduct(updatedRows);
  };
  const calculateTotalAmount = (products) => {
    return products.reduce((total, product) => {
      return total + product.soluong * product.sotien;
    }, 0);
  };
  console.log({ stateProduct });
  const showAlert = async () => {
    try {
      if (!statePhieu.loaiphieu) {
        setisshowError(true);

        return;
      } else {
        setisshowError(false);
      }

      if (!statePhieu.thoidiem) {
        setisShowerrorDate(true);
        return;
      }

      if (isShowerrorDate) {
        return;
      }
      if (stateProduct.length === 0 || stateProduct == []) {
        setisshowErrorTable(true);
        return;
      } else {
        setisshowErrorTable(false);
      }
      const totalAmount = calculateTotalAmount(stateProduct);
      confirmAlert({
        title: `${i18n.t("ALERT_TITLE")}`,
        message: `${i18n.t("ALERT_DES")} ${
          statePhieu.loaiphieu === "NK" || statePhieu.loaiphieu === "NN"
            ? `${i18n.t("ALERT_PHIEUNHAP")}`
            : `${i18n.t("ALERT_PHIEUXUAT")}`
        } ${i18n.t("ALERT_CHU")}`,
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              // stateProduct.forEach(async (item) => {
              //   await HandleUpload(
              //     "STORE",
              //     item.pictureview,
              //     statechinhanhdau,
              //     item.pictureName
              //   );
              // });
              setisloading(true);
              const createphieu = {
                id: stateID,
                status: "PENDING",
                userID: localStorage.getItem("id"),
                loaiphieu: statePhieu.loaiphieu,
                sotien: totalAmount,
                StoreID: statechinhanhdau,
                arrayProduct: stateProduct,
                sotienThucTe: statePhieu.sotienthucte,
                ngaylap: statePhieu.thoidiem.toISOString().split("T")[0],
                updateDate: "...",
              };

              console.log("phieu", createphieu);
              const check = await createPhieu(createphieu);
              console.log("check: ", check);
              if (
                JSON.parse(check).success ||
                JSON.parse(check).success === "true"
              ) {
                alert(`${i18n.t("ALERT_GUIYEUCAUSUCCESS")}`);
                updateFirebasePhieuStore(
                  createphieu.id,
                  createphieu.StoreID,
                  "pending"
                );
                setisloading(false);
                setStatePhieu({
                  ...statePhieu,
                  sotien: 0,
                  sotienthucte: 0,
                });
                setsotienbandau(0);
                setsotienThucTebandau(0);
                setStateProduct([]);
              }
            },
          },
          {
            label: "No",
            onClick: () => alert("You clicked No!"),
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchingStore = async () => {
    const objBranch = Get_all_store_By_userid();

    if (objBranch instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await objBranch;

      chinhanhdau = JSON.parse(resolvedResult)[0].id;
      code = JSON.parse(resolvedResult)[0].code;
      setchinhanhdau(chinhanhdau);
      setstateCode(code);
    } else {
      // Nếu không phải là promise, cập nhật state ngay lập tức

      chinhanhdau = JSON.parse(objBranch)[0].id;
      code = JSON.parse(objBranch)[0].code;

      setchinhanhdau(chinhanhdau);
      setstateCode(code);
    }
  };

  const addproduct = async () => {
    const { id, loai, name, soluong, pictureview } = stateFormProduct;
    const errors = {};

    if (!id) {
      errors.id = `${i18n.t("ERROR_ID")}`;
    }

    if (!loai) {
      errors.loai = `${i18n.t("ERROR_LOAI")}`;
    }

    if (!soluong) {
      errors.soluong = `${i18n.t("ERROR_SOLUONG")}`;
    }

    // If there are errors, update the state to show error messages
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }

    const existingProductIndex = stateProduct.findIndex(
      (product) => product.name === name
    );

    if (existingProductIndex !== -1) {
      // Update existing product quantity
      const updatedProducts = [...stateProduct];
      updatedProducts[existingProductIndex].soluong = (
        parseInt(updatedProducts[existingProductIndex].soluong, 10) +
        parseInt(soluong, 10)
      ).toString();
      setStateProduct(updatedProducts);
    } else {
      // Add new product
      setsotienbandau(
        parseFloat(statesotienbandau) + parseFloat(stateFormProduct.sotien)
      );
      setsotienThucTebandau(
        parseFloat(statesotienThucTebandau) +
          parseFloat(stateFormProduct.sotienthucte)
      );

      setStatePhieu({
        ...statePhieu,
        sotienthucte:
          parseFloat(statesotienThucTebandau) +
          parseFloat(stateFormProduct.sotienthucte),
        sotien:
          parseFloat(statesotienbandau) + parseFloat(stateFormProduct.sotien),
      });

      const newProduct = {
        ...stateFormProduct,
        checkStore: true,
        pictureName: "",
      };

      setStateProduct((prevProducts) => [...prevProducts, newProduct]);
    }

    setStateFormProduct({
      id: "",
      name: "",
      pictureview: "",
      loai: "",
      soluong: "",
      status: "GOOD",
      StoreID: "",
      sotien: 0,
      sotienthucte: 0,
      xuatxu: "",
      behavior: "ADMIN ADD",
    });
    setStateimgFileName("");
    setStateimg("");
  };
  const handleCategorySelectionChange = (updatedProducts) => {
    const uniqueProducts = Array.from(
      new Set(updatedProducts.map((product) => product.id))
    ).map((id) => updatedProducts.find((product) => product.id === id));
    setStateProduct(uniqueProducts);
  };

  const handleProductDeselect = (deselectedId) => {
    setStateProduct((prevSelected) =>
      prevSelected.filter((product) => product.id !== deselectedId)
    );
  };
  const handleFormSubmit = (values) => {
    console.log(values);
  };

  const checkAccess = async () => {
    try {
      const check = await HandleAccessAccount();
      if (check instanceof Promise) {
        // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
        const resolvedResult = await check;

        setstateCheckaccess(resolvedResult);
      } else {
        setstateCheckaccess(check);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchingapi = async () => {
    await checkAccess();
    await fetchingStore();

    await fetchingGettAllPhieu_by_StoreID(chinhanhdau);
    await fetchingGettAllProduct_by_storeID("ST00");
  };
  useEffect(() => {
    fetchingapi();
  }, [stateProduct]);
  const handleDelete = (productId) => {
    const updatedState = stateProduct.filter((item) => item.id !== productId);
    const updateMoney = stateProduct.filter((item) => item.id === productId);

    if (statePhieu.loaiphieu === "NK") {
      setStatePhieu({
        ...statePhieu,
        sotien:
          statePhieu.sotien -
          parseFloat(updateMoney[0].sotien) * updateMoney[0].soluong,
      });
    } else {
      setsotienbandau(
        parseFloat(statesotienbandau) - parseFloat(updateMoney[0].sotien)
      );
      setsotienThucTebandau(
        parseFloat(statesotienThucTebandau) -
          parseFloat(updateMoney[0].sotienthucte)
      );

      setStatePhieu({
        ...statePhieu,
        sotienthucte:
          parseFloat(statesotienThucTebandau) -
          parseFloat(updateMoney[0].sotienthucte),
        sotien:
          parseFloat(statesotienbandau) - parseFloat(updateMoney[0].sotien),
      });
    }

    setStateProduct(updatedState);
    handleProductDeselect(productId);
    handleProductDeleteFromCategory(productId);
  };
  const handleProductDeleteFromCategory = (productId) => {
    setCategorySelectionModels((prev) => {
      const updatedModels = { ...prev };
      Object.keys(updatedModels).forEach((category) => {
        updatedModels[category] = updatedModels[category].filter(
          (id) => id !== productId
        );
      });
      return updatedModels;
    });

    setSelectedProductsByCategory((prev) => {
      const updatedProducts = { ...prev };
      Object.keys(updatedProducts).forEach((category) => {
        updatedProducts[category] = updatedProducts[category].filter(
          (product) => product.id !== productId
        );
      });
      return updatedProducts;
    });
  };
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const columnsNK = [
    { field: "id", headerName: `${i18n.t("MASP_P")}`, flex: 0.5 },
    { field: "loai", headerName: `${i18n.t("LOAI_P")}`, flex: 1 },
    {
      field: "soluong",
      headerName: `${i18n.t("SOLUONG_P")}`,
      flex: 1,
      renderCell: (params) => (
        <TextField
          id={params.row.id}
          type="number"
          InputProps={{ inputProps: { min: 0 } }}
          onKeyPress={(event) => {
            if (event.key === "-" || event.key === "e") {
              event.preventDefault();
            }
          }}
          onChange={(e) => handleEditProductNEW(e, params.row.loai)}
          value={params.row.soluong}
          className={classes.textField}
        />
      ),
    },
    {
      field: "sotien",
      headerName: `${i18n.t("SOTIEN_NP")}`,
      flex: 1,
      renderCell: (params) =>
        params.row.checkStore ? (
          <Typography fontSize={"0.9rem"}>
            {parseInt(params.row.sotien).toLocaleString("en-US")}
          </Typography>
        ) : (
          "###"
        ),
    },
    {
      field: "actions",
      headerName: "",
      flex: 0.5,
      renderCell: (params) => (
        <Box>
          <IconButton
            sx={{ backgroundColor: "none", border: "1px #ED3333 solid" }}
            onClick={() => handleDelete(params.row.id)}
          >
            <Delete color="error" fontSize="medium" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const columnsNN = [
    { field: "loai", headerName: `${i18n.t("LOAI_P")}`, flex: 1 },
    { field: "name", headerName: `${i18n.t("MASP_P")}`, flex: 1 },
    {
      field: "soluong",
      headerName: `${i18n.t("SOLUONG_P")}`,
      flex: 0.5,
      renderCell: (params) => (
        <Typography fontSize={"0.9rem"}>{params.row.soluong}</Typography>
      ),
    },
    {
      field: "sotien",
      headerName: `${i18n.t("SOTIEN_NP")}`,
      flex: 0.75,
      renderCell: (params) =>
        params.row.checkStore ? (
          <Typography fontSize={"0.9rem"}>
            {parseInt(params.row.sotien).toLocaleString("en-US")}
          </Typography>
        ) : (
          "###"
        ),
    },
    // ...(stateCheckaccess
    //   ? [
    //       {
    //         field: "sotienthucte",
    //         headerName: `${i18n.t("Total")}`,
    //         flex: 0.75,
    //       },
    //     ]
    //   : []),
    {
      field: "pictureview",
      headerName: `${i18n.t("HINHANH_P")}`,
      flex: 1,
      renderCell: (params) => (
        <img height={50} src={params.value} alt="Product" />
      ),
    },
    {
      field: "actions",
      headerName: "",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton
            sx={{ backgroundColor: "none", border: "1px #ED3333 solid" }}
            onClick={() => handleDelete(params.row.id)}
          >
            <Delete color="error" fontSize="medium" />
          </IconButton>
        </Box>
      ),
    },
  ];
  return (
    <>
      <Box justifyContent={"center"} alignItems={"center"} m="20px">
        {/* Sản phẩm còn trong kho */}
        {statePhieu.loaiphieu && statePhieu.loaiphieu === "NK" ? (
          <div>
            <Typography
              variant="h3"
              textTransform={"uppercase"}
              fontWeight={"bold"}
              fontSize={"1.7rem"}
              mb={2}
              color={colors.grey[100]}
            >
              {i18n.t("TKCT")}
            </Typography>
            <CategoryList
              admin={true}
              statechinhanh={statechinhanhdau}
              category={stateProductview}
              onSelectionChange={handleCategorySelectionChange}
              onProductDeselect={handleProductDeselect}
              selectedProducts={stateProduct}
              selectedProductsByCategory={selectedProductsByCategory}
              categorySelectionModels={categorySelectionModels}
              setCategorySelectionModels={setCategorySelectionModels}
              setSelectedProductsByCategory={setSelectedProductsByCategory}
              setStateProduct={setStateProduct}
            />
          </div>
        ) : (
          ""
        )}
        <Header title={i18n.t("TITLENHAP")} />

        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={checkoutSchema}
        >
          {({ values, errors, touched, date, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
                color={colors.grey[100]}
              >
                <Box sx={{ gridColumn: "span 2" }}>
                  <Typography ml={2} variant="body2">
                    {" "}
                    {i18n.t("TONGSOTIEN_NHAP")}
                  </Typography>
                  <TextField
                    readOnly
                    type="text"
                    fullWidth
                    className={classes.textField}
                    name="sotien"
                    value={
                      stateCheckaccess
                        ? parseInt(statePhieu.sotien).toLocaleString("en-US")
                        : statePhieu.loaiphieu === "NN"
                        ? parseInt(statePhieu.sotien).toLocaleString("en-US")
                        : "#####"
                    }
                  />
                </Box>
                <Box fullWidth>
                  <Typography ml={2} variant="body2">
                    {i18n.t("THOIDIEMLAP")}
                  </Typography>
                  <FormControl fullWidth>
                    <DatePicker
                      selected={statePhieu.thoidiem}
                      onChange={(date) => handleDateChange(date)}
                      dateFormat="dd/MM/yyyy"
                      customInput={
                        <TextField
                          name="thoidiem"
                          fullWidth
                          className={classes.textField}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            min: new Date().toISOString().split("T")[0],
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <CalendarTodayIcon
                                  sx={{ color: colors.grey[100] }}
                                />
                              </InputAdornment>
                            ),
                          }}
                        />
                      }
                      minDate={new Date()}
                    />
                  </FormControl>
                </Box>
                <Box width={"100%"}>
                  <Typography ml={2} variant="body2">
                    {" "}
                    {i18n.t("LOAIPHIEU_NHAP")}
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      inputProps={{
                        id: "age-filter",
                      }}
                      name="loaiphieu"
                      value={statePhieu.loaiphieu}
                      className={classes.select}
                      onChange={onhandlechangePhieu}
                    >
                      <MenuItem
                        style={{
                          display: stateCheckaccess ? "none" : "block  ",
                        }}
                        value={"NK"}
                      >
                        {i18n.t("FWarehouse")}
                      </MenuItem>
                      <MenuItem value={"NN"}>{i18n.t("OWarehouse")}</MenuItem>
                    </Select>
                    {isshowError ? (
                      <span style={{ color: "red" }}>
                        {i18n.t("ERROR_PHIEU")}
                      </span>
                    ) : (
                      ""
                    )}
                  </FormControl>
                </Box>
              </Box>
              <div className="table-container">
                {/* <span>
                  {statePhieu.loaiphieu === "NN" ? (
                    <>
                      <span style={{ color: "black" }}>
                        {" "}
                        {">>> "} {i18n.t("MainTotal")} :{" "}
                        <span style={{ color: "red", fontSize: "1.2rem" }}>
                          {statePhieu.sotienthucte}
                        </span>{" "}
                      </span>
                    </>
                  ) : (
                    ""
                  )}
                </span> */}
                <br></br>
                {/* <label htmlFor="usoluong">*{i18n.t("SLDC")}</label> */}
                <br></br>
                {isshowErrorTable ? (
                  <span style={{ color: "red" }}>{i18n.t("ERROR_DULIEU")}</span>
                ) : (
                  ""
                )}

                {/* Bảng sản phẩm đã chọn */}
                {statePhieu.loaiphieu && statePhieu.loaiphieu === "NN" && (
                  <Box
                    marginBottom={2}
                    display={"flex"}
                    justifyContent={"center"}
                  >
                    <Button
                      className={classes.buttonAdd}
                      data-toggle="modal"
                      data-target="#staticBackdrop"
                      onClick={handleOpenDialog}
                    >
                      <Box
                        display={"flex"}
                        flexDirection={"row"}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        {i18n.t("THEMSP_P")}
                        <AddIcon fontSize="large" />
                      </Box>
                    </Button>
                  </Box>
                )}

                {statePhieu.loaiphieu &&
                statePhieu.loaiphieu === "NK" &&
                stateProduct.length > 0 ? (
                  <div
                    style={{ height: 400, width: "100%" }}
                    className={classes.datagrid}
                  >
                    <DataGrid
                      rows={stateProduct}
                      columns={columnsNK}
                      pageSize={5}
                    />
                  </div>
                ) : null}

                {statePhieu.loaiphieu &&
                statePhieu.loaiphieu === "NN" &&
                stateProduct.length > 0 ? (
                  <div
                    style={{ height: 400, width: "100%" }}
                    className={classes.datagrid}
                  >
                    <DataGrid
                      rows={stateProduct}
                      columns={columnsNN}
                      pageSize={5}
                      checkboxSelection
                      onSelectionModelChange={(newSelection) => {
                        setSelectionModel(newSelection.selectionModel);
                        const selectedIDs = new Set(
                          newSelection.selectionModel
                        );
                        const selectedData = stateProduct.filter((row) =>
                          selectedIDs.has(row.id)
                        );
                        setSelectedItems(selectedData);
                      }}
                      selectionModel={selectionModel}
                    />
                  </div>
                ) : null}

                <ProductModal
                  open={openDialog}
                  handleClose={handleCloseDialog}
                  stateFormProduct={stateFormProduct}
                  setStateFormProduct={setStateFormProduct}
                  addProduct={addproduct}
                  errorMessages={errorMessages}
                  stateCheckaccess={stateCheckaccess}
                  stateimage={stateimage}
                  stateProduct={stateProduct}
                  setStateimg={setStateimg}
                  statechinhanhdau={statechinhanhdau}
                  stateProductview={stateProductview}
                />
              </div>
              {stateProduct.length > 0 && (
                <Box display="flex" marginTop={3} justifyContent="center">
                  <Button
                    type="submit"
                    className={classes.button}
                    onClick={showAlert}
                  >
                    {isloading ? (
                      <CircularProgress color="inherit" size={24} />
                    ) : (
                      <Typography variant="body1" textTransform={"none"}>
                        {i18n.t("BTN_GUIYEUCAU")}
                      </Typography>
                    )}
                  </Button>
                </Box>
              )}
            </form>
          )}
        </Formik>
      </Box>
    </>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  contact: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  address1: yup.string().required("required"),
  address2: yup.string().required("required"),
});
const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  address1: "",
  address2: "",
};

export default Form;
