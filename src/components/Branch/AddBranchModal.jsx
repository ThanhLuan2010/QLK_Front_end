import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  IconButton,
  Modal,
} from "@mui/material";
import i18n from "../../i18n/i18n";
import { HandleUpload } from "../../scenes/sendfileFTP/sendfileFTP";
import useStyles from "./../EmployeeDetail/EmployeeDetail";
import CloseIcon from "@mui/icons-material/Close";
import CircleChecked from "@mui/icons-material/CheckCircle";
import CircleUnchecked from "@mui/icons-material/RadioButtonUnchecked";
import { HandleCreateStaff } from "../../scenes/team/handlestaff";
import { CreateBranch, CreateStore } from "../../scenes/branch/handlebranch";
const AddBranchModal = ({ open, onClose, stateMaxIDStoreId, fetchingapi }) => {
  const classes = useStyles();
  const [focusedField, setFocusedField] = useState(null);
  const [stateFormBranch, setStateFormBranch] = useState({
    branchID: "BT0" + (stateMaxIDStoreId + 1),
    name: "",
    diachi: "",
    masothue: "...",
    code: "",
  });
  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleChange = (field, value) => {
    setStateFormBranch({
      ...stateFormBranch,
      [field]: value,
      branchID: "BT0" + (stateMaxIDStoreId + 1),
    });
  };
  const [errors, setErrors] = useState({});
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const requiredFields = ["branchID", "code", "name", "masothue", "diachi"];

    requiredFields.forEach((field) => {
      if (!stateFormBranch[field]) {
        newErrors[field] = `Không được để trống thông tin!`;
      }
    });
   

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        handleSubmit();
      } catch (error) {
        console.error("Failed to add branch", error);
        alert("Thêm chi nhánh thất bại!");
      }
    }
  };
  const handleSubmit = async () => {
    try {
      const check = await CreateBranch(stateFormBranch);
      if (JSON.parse(check).success) {
        let formStore = {
          id: "ST" + (stateMaxIDStoreId + 1),
          name: stateFormBranch.name,
          BranchId: stateFormBranch.branchID,
          code: stateFormBranch.code,
        };
        const checkstore = await CreateStore(formStore);
        if (JSON.parse(checkstore).success) {
          alert("Create Success");
          setStateFormBranch({
            branchID: "",
            name: "",
            diachi: "",
            masothue: "...",
            code: "",
          });
          onClose();
          await fetchingapi();
        }
      }
    } catch (error) {
      if (
        !stateFormBranch.branchID ||
        !stateFormBranch.name ||
        !stateFormBranch.diachi ||
        !stateFormBranch.masothue ||
        !stateFormBranch.code
      ) {
        alert("Create fail, create form missing !!");
      } else {
        alert("Branch ID already exits");
      }
    }
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box maxWidth={350} width={"100%"} className={classes.modalBox}>
        <Box
          padding={2}
          height={"70vh"}
          flex={1}
          width={"100%"}
          flexDirection={"column"}
          display="flex"
        >
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            flexDirection={"row"}
            alignItems={"center"}
            mb={2}
          >
            <Typography variant="h4" component="h2" fontWeight={"bold"}>
            {i18n.t("AddBranch")}
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{ color: "black", border: "2px solid black" }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            width={"100%"}
            height={"100%"}
            display={"flex"}
            overflow={"auto"}
            overflowX={"hidden"}
            className="custom-scroll"
            flexDirection={"column"}
          >
            <Typography
              variant="body1"
              color={focusedField === "branchID" ? "black" : "#D9D2D2"}
              onFocus={() => handleFocus("branchID")}
              onBlur={handleBlur}
            >
              Mã chi nhánh
            </Typography>
            <TextField
              className={classes.textField}
              error={!!errors["branchID"]}
              readOnly
              helperText={errors["branchID"]}
              value={stateFormBranch.branchID}
              onChange={(e) => handleChange("branchID", e.target.value)}
              onFocus={() => handleFocus("branchID")}
              onBlur={handleBlur}
            />
            <Typography
              color={focusedField === "code" ? "black" : "#D9D2D2"}
              variant="body1"
              onFocus={() => handleFocus("code")}
              onBlur={handleBlur}
            >
              Mã code
            </Typography>
            <TextField
              error={!!errors["code"]}
              helperText={errors["code"]}
              placeholder="ex: BHD, D2, CRM, VHM, ....."
              required
              className={classes.textField}
              value={stateFormBranch.code}
              onChange={(e) => handleChange("code", e.target.value)}
              onFocus={() => handleFocus("code")}
              onBlur={handleBlur}
            />
            <Typography
              color={focusedField === "name" ? "black" : "#D9D2D2"}
              variant="body1"
              onFocus={() => handleFocus("name")}
              onBlur={handleBlur}
            >
              Tên chi nhánh
            </Typography>

            <TextField
              error={!!errors["name"]}
              helperText={errors["name"]}
              required
              className={classes.textField}
              value={stateFormBranch.name}
              onChange={(e) => handleChange("name", e.target.value)}
              onFocus={() => handleFocus("name")}
              onBlur={handleBlur}
            ></TextField>

            <Typography
              color={focusedField === "masothue" ? "black" : "#D9D2D2"}
              variant="body1"
              onFocus={() => handleFocus("masothue")}
              onBlur={handleBlur}
            >
              Mã số thuế
            </Typography>
            <TextField
              error={!!errors["masothue"]}
              helperText={errors["masothue"]}
              className={classes.textField}
              value={stateFormBranch.masothue}
              onChange={(e) => handleChange("masothue", e.target.value)}
              onFocus={() => handleFocus("masothue")}
              onBlur={handleBlur}
            />
            <Typography
              color={focusedField === "diachi" ? "black" : "#D9D2D2"}
              variant="body1"
              onFocus={() => handleFocus("diachi")}
              onBlur={handleBlur}
            >
              Địa chỉ
            </Typography>

            <TextField
              error={!!errors["diachi"]}
              helperText={errors["diachi"]}
              className={classes.textField}
              value={stateFormBranch.diachi}
              onChange={(e) => handleChange("diachi", e.target.value)}
              onFocus={() => handleFocus("diachi")}
              onBlur={handleBlur}
            />
          </Box>
          <Box display="flex" justifyContent="center" mt={1}>
            <Button
              className={classes.button}
              onClick={handleFormSubmit}
              sx={{ mt: 2, borderRadius: "30px" }}
              variant="contained"
            >
              {i18n.t("Update")}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddBranchModal;
