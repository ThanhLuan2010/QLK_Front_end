import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import "./style.css";
import React, { useState, useEffect } from "react";
import { Get_all_store_By_userid } from "../contacts/handlestore";
import { createPhieu } from "./handleform";
import { confirmAlert } from "react-confirm-alert";
import { Modal } from "react-bootstrap";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import CSS
import { createOrder } from "./handleform";
import { Get_all_Store } from "../contacts/handlestore";
import { Get_all_Product_By_StoreID } from "../contacts/handleproduct";
import HandleAccessAccount from "../handleAccess/handleAccess";
import ReactLoading from "react-loading";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Get_all_Phieu_Store_By_StoreID } from "../invoices/handlePhieustore";
import i18n from "../../i18n/i18n";
import { useTranslation } from "react-i18next";
import { EditProduct } from "../contacts/handleproduct";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllOrder_BY_storeID } from "./handleform";
import { CreateIdMaxValueOfarray } from "../method";
import { converToName } from "../method";
import { useRef } from "react";
import {
  Update_PhieuStore_By_id,
  Update_PhieuStore_By_id_WATING,
} from "../invoices/handlePhieustore";
import CommonStyle from "../../components/CommonStyle";
import CategoryList from "../../components/Inventory/CategoryList";
import { Close, Delete } from "@mui/icons-material";
import { useOrderContext } from "../../context/OrderContext";
import { updateFirebasePhieuStore } from "../../utils/firebaseUtils";

const Form = () => {
  const location = useLocation();
  const { stateStoreID } = location.state || {};
  useTranslation();
  const classes = CommonStyle();
  const nav = useNavigate();
  const targetRef = useRef(null);
  const ref = useRef(null);
  const [stateErrorMp, setstateErrorMp] = useState(false);
  const [stateErrorLP, setstateErrorLP] = useState(false);
  const [stateErrorDL, setstateErrorDL] = useState(false);
  // const [stateErrorSL, setstateErrorSL] = useState(false);
  const [stateimage, setStateimg] = useState("");
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [selectionModelPhieu, setSelectionModelPhieu] = React.useState([]);
  const [stateProductfetch, setStateProductfetch] = useState([]);
  const [stateProduct, setStateProduct] = useState([]);
  const [stateStore, setStateStore] = useState([]);
  const [statechinhanh, setStatechinhanh] = useState("");
  const [statechinhanhPN, setStatechinhanhPN] = useState("");
  const [statePhieuStore, setStatePhieuStore] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [stateContentModal, setStatecontentModal] = useState([]);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  let chinhanhdau = "";
  let code = "";
  const [stateCode, setstateCode] = useState("");
  const [stateCodePN, setstateCodePN] = useState("");
  const [stateID, setstateID] = useState("");
  const [statesotienbandau, setsotienbandau] = useState(0);
  const [statechinhanhnhan, setchinhanhnhan] = useState("");
  const [stateCheckAccess, setstateCheckAccess] = useState(false);
  const [isloading, setisloading] = useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [stateupdatesoluong, setstateupdatesoluong] = useState({
    usoluong: 0,
  });
  const [stateFormProduct, setStateFormProduct] = useState({
    id: "",
    name: "",
    picture: "",
    loai: "",
    soluong: "",
    status: "GOOD",
    diachi: "",
    sotien: 0,
  });
  let checkaccess = false;
  const { fetchingOrderBy_storeID } = useOrderContext();
  const handleOpenPopup = (content) => {
    setShowPopup(true);
    setStatecontentModal(content);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
    setStatecontentModal([]);
  };
  const CustomPopup = ({ show, handleClose, content }) => {
    return (
      <Dialog
        open={show}
        onClose={handleClose}
        maxWidth="md"
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
            <Typography
              variant="h3"
              fontWeight={"bold"}
              style={{ color: "black" }}
            >
              {i18n.t("DetailProduct")}
            </Typography>
            <IconButton
              onClick={handleClose}
              sx={{ color: "black", border: "2px solid black" }}
              size="small"
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent style={{ maxHeight: "500px" }}>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>{i18n.t("MASP_P")}</th>
                  <th>{i18n.t("LOAI_P")}</th>
                  <th>{i18n.t("SOLUONG_P")}</th>

                  <th>{i18n.t("Img")}</th>
                  <th>{i18n.t("SOTIEN_NP")}</th>
                </tr>
              </thead>
              <tbody>
                {content.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.loai}</td>
                    <td>{item?.soluong}</td>

                    <td>
                      {item.picture ? (
                        <img width={200} height={100} src={item.picture}></img>
                      ) : (
                        ""
                      )}
                    </td>
                    <th>{parseInt(item.sotien).toLocaleString("en-US")} VND</th>
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
  const columnphieustore = [
    { field: "id", flex: 1, headerName: `${i18n.t("MAPN_PX")}` },
    {
      field: "status",
      headerName: `${i18n.t("TINHTRANG_P")}`,
      flex: 1,
      renderCell: StatusObjectCell,
    },
    {
      field: "loaiphieu",
      headerName: `${i18n.t("LOAIPHIEU_NHAP")}`,
      flex: 1,
      renderCell: StatusObjectCellLoai,
    },

    {
      field: "sotien",
      headerName: `${i18n.t("SOTIEN_NP")}`,
      renderCell: StatusMoney,
      flex: 1,
    },
    {
      field: "createDate",
      headerName: `${i18n.t("NGAYLAPPHIEU_NP")}`,
      renderCell: UpdatedateObjectCell,
      flex: 1,
    },
    {
      field: "updateDate",
      headerName: `${i18n.t("NGAYCAPNHAT_NP")}`,
      flex: 1,
    },
    {
      field: "arrayProduct",
      headerName: `${i18n.t("SOLUONGSP_NP")}`,
      flex: 1,
      renderCell: ArrayObjectCell,
    },
  ];

  const [errorMessages, setErrorMessages] = useState({
    name: "",
    loai: "",
    soluong: "",
    sotien: "",
    picture: "",
    id: "",
  });
  const [statePhieu, setStatePhieu] = useState({
    sotien: 0,
    loaiphieu: "X",
    maphieu: "",
  });

  const onhandlechangePhieu = (event) => {
    setStatePhieu({
      ...statePhieu,
      [event.target.name]: event.target.value,
    });
  };
  const fetchingGettAllPhieu_by_StoreID = async (x) => {
    const check = await Get_all_Phieu_Store_By_StoreID(x);

    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;
      const sortedResult = JSON.parse(resolvedResult).sort(
        (a, b) => new Date(b.createDate) - new Date(a.createDate)
      );

      setStatePhieuStore(sortedResult);
    } else {
      const sortedResult = JSON.parse(check).sort(
        (a, b) => new Date(b.createDate) - new Date(a.createDate)
      );

      setStatePhieuStore(sortedResult);
    }
  };
  useEffect(() => {
    fetchingapi();
  }, []);
  const fetchingStore = async () => {
    if (checkaccess || checkaccess === "true") {
      const objBranch = Get_all_Store();

      if (objBranch instanceof Promise) {
        // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
        const resolvedResult = await objBranch;

        setStateStore(JSON.parse(resolvedResult));

        chinhanhdau = JSON.parse(resolvedResult)[0].id;
        code = JSON.parse(resolvedResult)[0].code;

        setStatechinhanh(chinhanhdau);
        setstateCode(code);
      } else {
        // Nếu không phải là promise, cập nhật state ngay lập tức

        setStateStore(JSON.parse(objBranch));
        chinhanhdau = JSON.parse(objBranch)[0].id;
        code = JSON.parse(objBranch)[0].code;

        setStatechinhanh(chinhanhdau);
        setstateCode(code);
      }
    } else {
      const objBranch = Get_all_store_By_userid();

      if (objBranch instanceof Promise) {
        // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
        const resolvedResult = await objBranch;

        setStateStore(JSON.parse(resolvedResult));
        chinhanhdau = JSON.parse(resolvedResult)[0].id;
        code = JSON.parse(resolvedResult)[0].code;

        setStatechinhanh(chinhanhdau);
        setstateCode(code);
      } else {
        // Nếu không phải là promise, cập nhật state ngay lập tức
        setStateStore(JSON.parse(objBranch));
        chinhanhdau = JSON.parse(objBranch)[0].id;
        code = JSON.parse(objBranch)[0].code;

        setStatechinhanh(chinhanhdau);
        setstateCode(code);
      }
    }
  };

  const fetchingGettAllProduct_by_storeID = async (x) => {
    const check = await Get_all_Product_By_StoreID(x);

    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      setStateProductfetch(JSON.parse(resolvedResult));
    } else {
      setStateProductfetch(JSON.parse(check));
    }
  };
  const checkAccess = async () => {
    const check = HandleAccessAccount();
    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      if (resolvedResult === "true" || resolvedResult) {
        checkaccess = resolvedResult;
      } else {
        checkaccess = resolvedResult;
      }
    } else {
      if (check === "true" || check) {
        checkaccess = true;
      } else {
        checkaccess = false;
      }
    }
    setstateCheckAccess(checkaccess);
  };

  const fetchgetAllOrder_BY_storeID = async (x, y) => {
    const check = await getAllOrder_BY_storeID(x);
    if (check instanceof Promise) {
      // Nếu là promise, chờ promise hoàn thành rồi mới cập nhật state
      const resolvedResult = await check;

      const createID = CreateIdMaxValueOfarray(
        "PX",
        JSON.parse(resolvedResult),
        y
      );

      setstateID(createID);
    } else {
      const createID = CreateIdMaxValueOfarray("PX", JSON.parse(check), y);

      setstateID(createID);
    }
  };

  const fetchingapi = async () => {
    await checkAccess();
    await fetchingStore();
    await fetchingGettAllProduct_by_storeID(chinhanhdau);
    await fetchingGettAllPhieu_by_StoreID(chinhanhdau);

    await fetchgetAllOrder_BY_storeID(chinhanhdau, code);
    setstateCodePN(code);
    setStatechinhanh(chinhanhdau);
    setchinhanhnhan(chinhanhdau);
  };

  function UpdatedateObjectCell(params) {
    const arrayObject = params.value;
    const originalDateString = arrayObject;
    const originalDate = new Date(originalDateString);

    // Lấy thông tin về năm, tháng, ngày, giờ, phút, giây từ đối tượng Date
    const year = originalDate.getFullYear();
    const month = (originalDate.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
    const day = originalDate.getDate().toString().padStart(2, "0");
    const hours = originalDate.getHours().toString().padStart(2, "0");
    const minutes = originalDate.getMinutes().toString().padStart(2, "0");
    const seconds = originalDate.getSeconds().toString().padStart(2, "0");

    // Tạo chuỗi mới với định dạng "năm tháng ngày giờ phút giây"
    const formattedDateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return (
      <span
        style={{
          width: "100%",
          fontSize: "0.9rem",
          padding: "2px",
        }}
      >
        {formattedDateString}
      </span>
    );
  }

  function StatusObjectCell(params) {
    const arrayObject = params.value;
    if (arrayObject === "CANCEL") {
      return (
        <span
          style={{
            backgroundColor: "#ED3333",
            width: "100%",
            textAlign: "center",
            borderRadius: "40px",
            fontSize: "1.1rem",
            color: "white",
          }}
        >
          {arrayObject}
        </span>
      );
    }
    if (arrayObject === "ACCEPT") {
      return (
        <span
          style={{
            backgroundColor: "#22C75B",
            width: "100%",
            textAlign: "center",
            borderRadius: "40px",
            fontSize: "1.1rem",
            color: "white",
          }}
        >
          {arrayObject}
        </span>
      );
    } else {
      return (
        <span
          style={{
            backgroundColor: "orange",
            width: "100%",
            textAlign: "center",
            borderRadius: "40px",
            fontSize: "1.1rem",
            color: "white",
          }}
        >
          {arrayObject}
        </span>
      );
    }
  }

  function StatusObjectCellLoai(params) {
    const arrayObject = params.value;
    if (arrayObject === "NK") {
      return (
        <span
          style={{
            backgroundColor: "#48E57E",
            width: "100%",
            textAlign: "center",
            borderRadius: "40px",
            fontSize: "1.1rem",
            color: "white",
          }}
        >
          {arrayObject}
        </span>
      );
    }
    if (arrayObject === "NN") {
      return (
        <span
          style={{
            backgroundColor: "#ED3333",
            width: "100%",
            textAlign: "center",
            borderRadius: "40px",
            fontSize: "1.1rem",
            color: "white",
          }}
        >
          {arrayObject}
        </span>
      );
    } else {
      return (
        <span
          style={{
            backgroundColor: "#FFC107",
            width: "100%",
            textAlign: "center",
            borderRadius: "40px",
            fontSize: "1.1rem",
            color: "white",
          }}
        >
          {arrayObject}
        </span>
      );
    }
  }

  function ArrayObjectCell(params) {
    const arrayObject = params.value;
    const numberOfItems = Array.isArray(arrayObject) ? arrayObject.length : 0;
    return (
      <>
        <Box>
          <Button
            className={classes.button}
            onClick={() => handleOpenPopup(arrayObject)}
          >
            {numberOfItems} Items
          </Button>
        </Box>
      </>
    );
  }

  const showAlert = async () => {
    try {
      if (!statePhieu.loaiphieu) {
        setstateErrorLP(true);
        return;
      } else {
        setstateErrorLP(false);
      }
      if (!statePhieu.maphieu) {
        setstateErrorMp(true);
        return;
      } else {
        setstateErrorMp(false);
      }
      if (stateProduct.length === 0 || stateProduct == []) {
        setstateErrorDL(true);
        return;
      } else {
        setstateErrorDL(false);
      }
      // if (stateErrorSL) {
      //   return;
      // }
      confirmAlert({
        title: `${i18n.t("ALERT_TITLE")}`,
        message: `${i18n.t("ALERT_DES")} ${
          statePhieu.loaiphieu === "N"
            ? `${i18n.t("ALERT_PHIEUNHAP")}`
            : `${i18n.t("ALERT_PHIEUXUAT")}`
        } ${i18n.t("ALERT_CHU")}`,
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              setisloading(true);
              // Tạo một đối tượng Date hiện tại
              const currentDate = new Date();

              // Lấy thông tin về ngày, giờ, phút, giây và milliseconds
              const year = currentDate.getFullYear();
              const month = (currentDate.getMonth() + 1)
                .toString()
                .padStart(2, "0"); // Tháng bắt đầu từ 0
              const day = currentDate.getDate().toString().padStart(2, "0");
              const hours = currentDate.getHours().toString().padStart(2, "0");
              const minutes = currentDate
                .getMinutes()
                .toString()
                .padStart(2, "0");
              const seconds = currentDate
                .getSeconds()
                .toString()
                .padStart(2, "0");
              const milliseconds = currentDate
                .getMilliseconds()
                .toString()
                .padStart(3, "0");

              // Tạo chuỗi datetime
              const datetimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
              const createphieu = {
                id: stateID,
                tongtien: "0",
                storeID: statechinhanh,
                CreateAt: datetimeString,
                arrayProduct: stateProduct,
                phieustoreID: statePhieu.maphieu,
              };
              const c = await createOrder(createphieu);

              if (JSON.parse(c).success) {
                await fetchingGettAllProduct_by_storeID(statechinhanh);
                alert(`${i18n.t("ALERT_ADDPHIEUSUCCESS")}`);
                const result = await Update_PhieuStore_By_id_WATING(
                  selectionModelPhieu,
                  stateProduct
                );
                console.log(result);
                const phieu = statePhieuStore.find(
                  (phieu) => phieu.id === selectionModelPhieu[0]
                );
                updateFirebasePhieuStore(
                  selectionModelPhieu[0],
                  phieu.StoreID,
                  "waiting"
                );

                await fetchingGettAllPhieu_by_StoreID(statechinhanhnhan);
                await fetchgetAllOrder_BY_storeID(statechinhanh, stateCode);
                setisloading(false);

                setStatePhieu({
                  ...statePhieu,
                  sotien: 0,
                  maphieu: "",
                });
                setStateFormProduct({
                  id: "",
                  name: "",
                  picture: "",
                  loai: "",
                  soluong: "",
                  status: "GOOD",
                  dia: "",
                  sotien: 0,
                });
                setStateProduct([]);
                setSelectionModel([]);
                setSelectionModelPhieu([]);
              }
              if (ref.current) {
                ref.current.scrollIntoView({ behavior: "smooth" });
              }
              await fetchingOrderBy_storeID();
            },
          },
          {
            label: "No",
            onClick: () => {},
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  const acceptPhieu = () => {
    // const filteredArray = stateProductfetch.filter((obj1) =>
    //   selectedRow[0].arrayProduct.some(
    //     (obj2) => obj2.id == obj1.id && obj2?.soluong > obj1?.soluong
    //   )
    // );
    setStateProduct(selectedRow[0].arrayProduct);
    setStatePhieu({
      ...statePhieu,
      maphieu: selectedRow[0].id,
    });
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const updateEditproduct = async () => {
    for (const item of stateProduct) {
      const itemsWithIdOne = stateProductfetch.filter(
        (itemx) => itemx.id === item.id
      );
      item.soluong = parseInt(
        parseFloat(itemsWithIdOne[0]?.soluong) - parseFloat(item?.soluong)
      );
      console.log("stateProduct", stateProduct);
      console.log("stateProductfetch", stateProductfetch);
      console.log("formEdit1", item);
      // await EditProduct(item); // Gọi hàm bất đồng bộ trong vòng lặp
    }
  };

  const onChangeAddProductForm = (event) => {
    // // Tách phần số từ chuỗi 'id' và chuyển đổi thành số nguyên
    // const arrayOfNumbers = stateProduct.map((obj) =>
    //   parseInt(obj.id.replace(/[^\d]/g, ""), 10)
    // );

    // // Tìm giá trị lớn nhất trong mảng 'arrayOfNumbers'
    // let maxNumber = Math.max(...arrayOfNumbers);
    // const result = 1 / 0;

    // const negativeInfinity = -1 / 0;

    // if (maxNumber === negativeInfinity || maxNumber === result) {
    //   maxNumber = 0;
    // }
    // let lenghtState = maxNumber + 1;
    let temp = stateimage;

    setStateFormProduct({
      ...stateFormProduct,
      [event.target.name]: event.target.value,
      picture: temp,
    });
    setErrorMessages({
      name: "",
      loai: "",
      soluong: "",
      sotien: "",
      picture: "",
      id: "",
    });
  };
  const isIdInstate = (idToCheck) => {
    for (const column of stateProduct) {
      if (column.field === "id" && column.value === idToCheck) {
        return true;
      }
    }
    return false;
  };
  const addproduct = async () => {
    const { name, loai, soluong, sotien, id } = stateFormProduct;
    // console.log("id " + stateFormProduct.id);
    const errors = {};
    // if (isIdInstate(id)) {
    //   errors.id = "ID này đã tồn tại trong mãng";
    // }
    if (!name) {
      errors.name = "Vui lòng nhập Tên sản phẩm.";
    }

    if (!loai) {
      errors.loai = "Vui lòng nhập Loại.";
    }

    if (!soluong) {
      errors.soluong = "Vui lòng nhập Số lượng.";
    }

    if (!sotien) {
      errors.sotien = "Vui lòng nhập Giá tiền.";
    }

    // If there are errors, update the state to show error messages
    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }
    setsotienbandau(
      parseFloat(statesotienbandau) + parseFloat(stateFormProduct.sotien)
    );

    setStatePhieu({
      ...statePhieu,
      sotien:
        parseFloat(statesotienbandau) + parseFloat(stateFormProduct.sotien),
    });

    const arry = [];
    arry.push(stateFormProduct);
    setStateProduct(stateProduct.concat(arry));
    setStateFormProduct({
      id: "",
      name: "",
      picture: "",
      loai: "",
      soluong: "",
      status: "GOOD",
      diachi: "",
      sotien: 0,
    });
  };
  const handleFormSubmit = (values) => {
    console.log(values);
  };
  const convertoBase64 = (e) => {
    const file = e.target.files[0];

    // Check if a file is selected
    if (!file) {
      setErrorMessages((prev) => ({
        ...prev,
        picture: "Vui lòng chọn một hình ảnh.",
      }));
      return;
    }
    setErrorMessages({
      ...errorMessages,
      picture: "",
    });

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setStateFormProduct((prev) => ({ ...prev, picture: reader.result }));
      setStateimg(reader.result);
    };

    reader.onerror = (error) => {
      console.error("Error reading the file: ", error);
    };
  };

  const handleDelete = (productId) => {
    const updatedState = stateProduct.filter((item) => item.id !== productId);

    // Cập nhật stateProduct
    const updateMoney = stateProduct.filter((item) => item.id === productId);

    setsotienbandau(
      parseFloat(statesotienbandau) - parseFloat(updateMoney[0].sotien)
    );

    setStatePhieu({
      ...statePhieu,
      sotien: parseFloat(statesotienbandau) - parseFloat(updateMoney[0].sotien),
    });
    setStateProduct(updatedState);
  };
  const handleEditProduct = (productId) => {
    const checksoluongrow = stateProductfetch.filter(
      (item) => item.id === productId
    );
    if (
      checksoluongrow[0]?.soluong < stateupdatesoluong.usoluong ||
      stateupdatesoluong.usoluong < 0
    ) {
      alert("Số lượng nhập có giá trị lớn hơn số lượng đang có hoặc nhỏ hơn 0");
      return;
    }
    const updatedRows = stateProduct.map((row) =>
      row.id === productId
        ? { ...row, soluong: stateupdatesoluong.usoluong }
        : row
    );
    // setstateupdatesoluong({
    //   usoluong: 0,
    // });
    setStateProduct(updatedRows);
  };
  const handle_getAllProduct = async (e) => {
    await fetchingGettAllProduct_by_storeID(e.target.value);
    const selectedStore = stateStore.find(
      (store) => store.id === e.target.value
    );
    if (selectedStore) {
      console.log("Selected Store:", selectedStore.code);
      const selectedId = selectedStore.code;
      await fetchgetAllOrder_BY_storeID(e.target.value, selectedId);
      setstateCode(selectedId);
    } else {
      console.log("Store not found");
    }
    setStatechinhanh(e.target.value);
  };
  const handle_changechinhanhnhan = async (e) => {
    setchinhanhnhan(e.target.value);
    await fetchingGettAllPhieu_by_StoreID(e.target.value);
    const selectedStore = stateStore.find(
      (store) => store.id === e.target.value
    );
    if (selectedStore) {
      console.log("Selected Store:", selectedStore.code);
      const selectedId = selectedStore.code;
      setstateCodePN(selectedId);
    } else {
      console.log("Store not found");
    }
  };
  const handleSelectionModelChange = (newSelectionModel) => {
    const hasAcceptedOrCancelled = newSelectionModel.some((selectedId) => {
      const selectedRow = stateProductfetch.find(
        (row) => row.id === selectedId
      );
      return selectedRow && selectedRow?.soluong === 0;
    });
    if (hasAcceptedOrCancelled) {
      // Một trong những phần tử có status là "ACCEPT" hoặc "CANCEL"
      alert("Không thể chọn sản phẩm với số lượng là 0!!!");
      return;
    }
    setSelectionModel(newSelectionModel);
  };

  const handleSelectionModelChangePhieu = (newSelectionModel) => {
    const selectedRows = newSelectionModel.map((selectedId) =>
      statePhieuStore.find((row) => row.id === selectedId)
    );
    setSelectedRow(selectedRows);

    const hasAcceptedOrCancelled = newSelectionModel.some((selectedId) => {
      const selectedRow = statePhieuStore.find((row) => row.id === selectedId);
      return (
        selectedRow &&
        (selectedRow.status === "ACCEPT" ||
          selectedRow.status === "CANCEL" ||
          selectedRow.status === "WAITING" ||
          selectedRow.loaiphieu === "NN")
      );
    });
    // if (hasAcceptedOrCancelled) {
    //   // Một trong những phần tử có status là "ACCEPT" hoặc "CANCEL"
    //   return;
    // }
    setSelectionModelPhieu(newSelectionModel);
  };

  const onchangeupdatesoluong = (event) => {
    setstateupdatesoluong({
      ...stateupdatesoluong,
      [event.target.name]: event.target.value,
    });
  };
  const handleGetSelectedData = () => {
    const selectedData = selectionModel.map((selectedId) => {
      return stateProductfetch.find((row) => row.id === selectedId);
    });
    // Đồng thời thay đổi giá trị sotien thành 0 trong selectedData
    const updatedSelectedData = selectedData.map((selectedItem) => {
      // Kiểm tra xem có selectedItem không trả về undefined
      if (selectedItem) {
        // Tạo một bản sao của đối tượng để không ảnh hưởng đến stateProductfetch
        const updatedItem = { ...selectedItem, behavior: "ADMIN ADD" };
        return updatedItem;
      }
      return selectedItem; // Trả về nguyên bản nếu không tìm thấy đối tượng
    });
    setStateProduct(updatedSelectedData);
    // setSelectionModel([]);
    // selectedData là mảng chứa dữ liệu của các hàng được chọn
  };
  function StatusMoney(params) {
    const arrayObject = params.value;
    // Định dạng số thành chuỗi với dấu phân cách
    const formattedNumber = parseInt(arrayObject).toLocaleString("en-US");
    return (
      <>
        <span
          style={{
            backgroundColor: "#22C75B",
            width: "100%",
            textAlign: "center",
            borderRadius: "40px",
            fontSize: "1rem",
            color: "white",
            padding: "2px",
          }}
        >
          {formattedNumber} VND
        </span>
      </>
    );
  }
  function ImageCell(params) {
    return (
      <img
        src={params.value}
        alt="Image"
        loading="lazy"
        width={100}
        height={50}
        style={{ cursor: "pointer" }}
      />
    );
  }
  const handleEditProductNEW = (e) => {
    // const checksoluongrow = stateProductfetch.filter(
    //   (item) => item.id === e.target.id
    // );

    // if (checksoluongrow[0]?.soluong < e.target.value) {
    //   alert("Số lượng nhập có giá trị lớn hơn số lượng đang có hoặc nhỏ hơn 0");

    //   return;
    // }
    console.log(e.target.value);
    const updatedRows = stateProduct.map((row) =>
      row.id === e.target.id ? { ...row, soluong: e.target.value * 1 } : row
    );
    let sumallvalue = 0;
    updatedRows.forEach((item) => (sumallvalue += item.sotien * item?.soluong));
    setStateProduct(updatedRows);
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
          onChange={handleEditProductNEW}
          value={params.row?.soluong}
          className={classes.textField}
        />
      ),
    },
    {
      headerName: `${i18n.t("REMAIN")}`,
      flex: 1,
      renderCell: (params) => (
        <Typography color={"red"}>
          {stateProductfetch.find((row) => row.id === params.row.id)?.soluong}
        </Typography>
      ),
    },
    {
      field: "picture",
      headerName: `${i18n.t("HINHANH _P")}`,
      flex: 1,
      renderCell: (params) => (
        <img src={params.row.picture} height={50} alt="Product"></img>
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
  console.log("==selectionModelPhieu===",selectionModelPhieu)
  return (
    <Box m="20px">
      <Header ref={ref} title={i18n.t("TITLEPHIEUXUAT")} />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box
              mt={2}
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <Box>
                <Typography
                  fontWeight="600"
                  color={colors.grey[100]}
                  ml={2}
                  variant="body2"
                >
                  {i18n.t("MAPHIEU_XUAT")}
                </Typography>
                <FormControl fullWidth>
                  <TextField
                    type="text"
                    name="maphieu"
                    value={statePhieu.maphieu}
                    onChange={onhandlechangePhieu}
                    sx={{ gridColumn: "span 2" }}
                    className={classes.textField}
                  />
                  <label htmlFor="maphieu">
                    {" "}
                    {stateErrorMp ? (
                      <span style={{ color: "red" }}>
                        *Lỗi không được để trống
                      </span>
                    ) : (
                      ""
                    )}
                  </label>
                </FormControl>
              </Box>
              <Box>
                <Typography
                  fontWeight="600"
                  color={colors.grey[100]}
                  ml={2}
                  variant="body2"
                >
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
                    <MenuItem value={"X"}>{i18n.t("LABLE_XUAT")}</MenuItem>
                  </Select>
                  {stateErrorLP ? (
                    <span style={{ color: "red" }}>
                      *Lỗi không được để trống
                    </span>
                  ) : (
                    ""
                  )}
                </FormControl>
              </Box>
            </Box>
            {stateCheckAccess ? (
              <Box>
                <Typography
                  ml={2}
                  fontWeight="600"
                  color={colors.grey[100]}
                  variant="body2"
                >
                  {i18n.t("ALERT_PHIEUNHAP")}
                </Typography>
                <FormControl sx={{ maxWidth: "300px", width: "100%" }}>
                  <Select
                    value={statechinhanhnhan}
                    onChange={handle_changechinhanhnhan}
                    displayEmpty
                    className={classes.select}
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
                    {stateStore &&
                      stateStore.map((object, index) => (
                        <MenuItem key={index} value={object.id}>
                          {object.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <Box height="75vh" className={classes.datagrid}>
                  <Box mb={2}>
                    <Button
                      disabled={selectionModelPhieu.length !== 1}
                      className={classes.button}
                      onClick={acceptPhieu}
                    >
                      <Typography variant="h5">{i18n.t("Confirm")}</Typography>
                    </Button>
                  </Box>
                  <DataGrid
                    editMode="row"
                    checkboxSelection
                    selectionModel={selectionModelPhieu}
                    onSelectionModelChange={handleSelectionModelChangePhieu}
                    components={{
                      Toolbar: GridToolbar,
                    }}
                    pageSize={10}
                    rows={statePhieuStore}
                    columns={columnphieustore}
                  />
                </Box>
              </Box>
            ) : (
              ""
            )}
            <Box ref={targetRef} mt={10}>
              <Box>
                <br></br>
                <Typography
                  color={colors.grey[100]}
                  variant="h3"
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                  htmlFor="usoluong"
                >
                  {i18n.t("DetailProduct1")}
                </Typography>
                <br></br>
                <Box height="50vh" className={classes.datagridInfo}>
                  <DataGrid
                    rows={stateProduct}
                    columns={columnsNK}
                    pageSize={5}
                  />
                </Box>
              </Box>

              <Box mt={2} display="flex" justifyContent="center">
                <Button
                  type="submit"
                  className={classes.button}
                  color="secondary"
                  onClick={showAlert}
                  disabled={stateProduct.length === 0}
                >
                  {isloading ? (
                    <CircularProgress
                      color="inherit"
                      size={24}
                    ></CircularProgress>
                  ) : (
                    <Typography variant="body1" textTransform={"none"}>
                      {i18n.t("XACNHANYEUCAU")}
                    </Typography>
                  )}
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
      <CustomPopup
        show={showPopup}
        handleClose={handleClosePopup}
        content={stateContentModal}
      />
    </Box>
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
