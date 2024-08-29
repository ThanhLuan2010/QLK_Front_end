import { makeStyles } from "@mui/styles";

const CommonStyle = makeStyles((theme) => ({
  datagrid: {
    marginTop: "20px",
    "& .MuiDataGrid-root": {
      border: "none",
      alignItem: "center",
      width: "100% !important",
    },
    "& .MuiDataGrid-cell": {
      borderBottom: "1px solid #E0E0E0 !important",
      color: "#000 !important",
    },
    "& .MuiDataGrid-cellContent": {
      fontSize: "0.9rem !important",
    },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "#3F3F3F",
      color: "#fff !important",
      borderTopLeftRadius: "20px",
      borderTopRightRadius: "20px",
      fontSize: "0.9rem !important",
    },
    "& .MuiDataGrid-virtualScrollerContent": {
      backgroundColor: "#fff",
      borderLeft: "1px solid #E0E0E0 !important",
      borderRight: "1px solid #E0E0E0 !important",
      overflow: "hidden",
      width: "100%",
    },
    "& .MuiDataGrid-row:nth-of-type(even)": {
      backgroundColor: "#f5f5f5",
      width: "99.9%",
    },
    "& .MuiDataGrid-footerContainer": {
      borderTop: "none",
      backgroundColor: "#3F3F3F",
      borderBottomLeftRadius: "20px",
      borderBottomRightRadius: "20px",
      display: "flex",
      alignItems: "center",
    },
    "& .MuiTablePagination-displayedRows": {
      margin: 0,
    },
    "& .MuiCheckbox-root": {
      color: "#000 !important",
    },
    "& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root": {
      color: "#fff !important",
    },
    "& .MuiDataGrid-toolbarContainer": {
      display: "none",
    },
  },
  datagridInfo: {
    "& .MuiDataGrid-root": {
      border: "none !important",
      alignItem: "center",
      width: "100% !important",
    },

    "& .MuiDataGrid-cell": {
      borderBottom: "2px solid #fff !important",
      color: "#000 !important",
    },
    "& .MuiDataGrid-cellContent": {
      fontSize: "0.9rem !important",
    },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "#CECECE",
      color: "#000 !important",
      borderTopLeftRadius: "20px",
      borderTopRightRadius: "20px",
      border: "none !important",
      fontSize: "0.9rem !important",
    },
    "& .MuiDataGrid-virtualScrollerContent": {
      backgroundColor: "#F3F3F3",
      overflow: "hidden",
      width: "100%",
    },
    "& .MuiDataGrid-footerContainer": {
      borderTop: "none",
      backgroundColor: "#CECECE",
      borderBottomLeftRadius: "20px",
      borderBottomRightRadius: "20px",
      display: "flex",
      alignItems: "center",
      color: "#000 !important",
    },
    "& .MuiTablePagination-displayedRows": {
      margin: 0,
    },
    "& .MuiCheckbox-root": {
      color: "#B6B6B6 !important",
    },
    "& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root": {
      color: "#B6B6B6 !important",
    },
    "& .MuiDataGrid-toolbarContainer": {
      display: "none",
    },
  },
  textField: {
    "& .MuiInputBase-root": {
      height: "40px",
      color: "black",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#D9D2D2",
        color: "#D9D2D2",
        borderRadius: "40px",
      },
      "&:hover fieldset": {
        borderColor: "#D9D2D2",
      },
      "&.Mui-focused fieldset": {
        borderColor: "black",
      },
    },
  },
  select: {
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#D9D2D2",
      borderRadius: "40px",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#D9D2D2 !important",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "black !important",
    },

    "& .MuiSelect-icon": {
      color: "#D9D2D2",
    },
    "& .MuiSelect-select": {
      color: "black",
      padding: "10px 15px",
    },
    "&:hover .MuiSelect-select": {
      color: "black",
    },
  },
  button: {
    backgroundColor: "#000 !important",
    "&:hover": {
      backgroundColor: "#2D2D2D !important",
    },
    "&:disabled": {
      backgroundColor: "#B1B1B1 !important",
    },
    width: "15%",
    borderRadius: "40px !important",
    color: "#fff !important",
    textTransform: "none !important",
  },
  buttonAdd: {
    backgroundColor: "#22C75B !important",
    "&:hover": {
      backgroundColor: "#26D763 !important",
    },
    maxWidth: 150,
    width: "100% !important",
    height: "100% !important",
    padding: "10px 10px !important",
    textTransform: "none !important",
    fontSize: "0.9rem !important",
    fontWeight: "600 !important",
    borderRadius: "40px !important",
  },
  buttonDelete: {
    backgroundColor: "#D14444 !important",
    "&:hover": {
      backgroundColor: "#E84C4C !important",
    },
    maxWidth: 150,
    width: "100% !important",
    height: "100% !important",
    padding: "10px 10px !important",
    textTransform: "none !important",
    fontSize: "0.9rem !important",
    fontWeight: "600 !important",
    borderRadius: "40px !important",
  },
  buttonEdit: {
    backgroundColor: "#FFC107 !important",
    "&:hover": {
      backgroundColor: "#FFC926 !important",
    },
    maxWidth: 150,
    width: "100% !important",
    height: "100% !important",
    padding: "10px 10px !important",
    textTransform: "none !important",
    fontSize: "0.9rem !important",
    fontWeight: "600 !important",
    borderRadius: "40px !important",
  },
  buttonExport: {
    backgroundColor: "#4CCEAC !important",
    "&:hover": {
      backgroundColor: "#51DFBA !important",
    },
    border: "none !important",
    maxWidth: 150,
    width: "100% !important",
    height: "100% !important",
    padding: "10px 10px !important",
    fontSize: "0.9rem !important",
    fontWeight: "600 !important",
    borderRadius: "40px !important",
  },
}));

export default CommonStyle;
