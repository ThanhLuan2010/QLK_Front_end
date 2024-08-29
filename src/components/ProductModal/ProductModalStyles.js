import { makeStyles } from "@mui/styles";
import { color } from "@mui/system";

const useStyles = makeStyles((theme) => ({
  modalBox: {
    color: "#000",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: "90%",
    maxHeight: "800px",
    width: "1000px",
    maxWidth: "100%",
    backgroundColor: "white",
    borderRadius: "40px",
    boxShadow: 24,
    padding: "25px",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    overflow: "hidden",
    flexDirection: "column",
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
    marginBottom: "8px",
    "& .MuiInputBase-root": {
      color: "black ",
      height: "40px",
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
      "&.Mui-disabled fieldset": {
        borderColor: "#D9D2D2",
      },
      marginBottom: "8px",
      maxHeight: "40px",
      // maxWidth: "400px",
    },
    "& input.Mui-disabled": {
      color: "#D9D2D2 !important",
    },
  },
  textFieldTime: {
    "& .MuiInputBase-root": {
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
      "& .MuiSvgIcon-root": {
        display: "none",
      },
      maxHeight: "30px",
      maxWidth: "105px",
      marginTop: "2px",
    },
  },
  textFieldAddProduct: {
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
    marginBottom: "8px",
    // position: "relative",
    zIndex: 100,
  },
  transitionBox: {
    transition: "background-color 0.2s  ease-in-out",
  },
  noTransition: {
    transition: "none",
  },
  open: {
    backgroundColor: "#565656",
  },
  button: {
    backgroundColor: "#121212",
    "&:hover": {
      backgroundColor: "#2D2D2D",
    },
    "&:disabled": {
      backgroundColor: "#B1B1B1",
    },
    width: " 30%",
  },
  dialogContent: {
    backgroundColor: "white",
    color: "black",
  },
  dialogActions: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    marginTop: "  10px",
    width: "100%",
    backgroundColor: "white",
  },
  dialog: {
    borderRadius: "20px",
  },
}));

export default useStyles;
