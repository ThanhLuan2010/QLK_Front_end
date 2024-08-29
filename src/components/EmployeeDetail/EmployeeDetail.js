import { makeStyles } from "@mui/styles";

const EmployeeDetail = makeStyles((theme) => ({
  modalBox: {
    color: "#000",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    borderRadius: "40px",
    boxShadow: 24,
    padding: "10px",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
  },
  textFieldAdd: {
    "& .MuiInputBase-root": {
      color: "white",
      height: "40px",
    },
    "& .MuiInputBase-root": {
      width: "200px",
      color: "white",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#D9D2D2",
        color: "white",
        borderRadius: "40px",
      },
      "&:hover fieldset": {
        borderColor: "#D9D2D2",
      },
      "&.Mui-focused fieldset": {
        borderColor: "white",
      },
      marginBottom: "8px",
      maxHeight: "40px",
      maxWidth: "200px",
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
    width: "100%",
    maxWidth: "150px !important",
    borderRadius: "40px !important",
    color: "#fff !important",
  },
  textField: {
    "& .MuiInputBase-root": {
      height: "40px",
      width: "100%",
      maxWidth: "300px",
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
      marginBottom: "8px",
    },
  },
  textFieldTime: {
    "& .MuiInputBase-root": {
      width: "100%",
      color: "black",
      fontWeight: "bold",
      height: "30px",
      fontSize: "16px",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        border: "none",
        color: "#D9D2D2",
        padding: 0,
      },
      "&:hover fieldset": {
        border: "none",
        padding: 0,
      },
      "&.Mui-focused fieldset": {
        border: "none",
        padding: 0,
      },
    },
  },
  disableTextField: {
    "& .MuiInputBase-root": {
      color: "#D9D2D2",
      borderColor: "#D9D2D2",
    },
    "& .MuiInputLabel-root": {
      color: "#D9D2D2",
      borderColor: "#D9D2D2",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#D9D2D2",
        color: "#D9D2D2",
      },
      "&:hover fieldset": {
        borderColor: "#D9D2D2",
        color: "#D9D2D2",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#D9D2D2",
        color: "#D9D2D2",
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
      padding: 10,
    },
    "&:hover .MuiSelect-select": {
      color: "black",
    },
  },
}));

export default EmployeeDetail;
