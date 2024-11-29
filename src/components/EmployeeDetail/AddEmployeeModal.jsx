import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import i18n from "../../i18n/i18n";
import { HandleUpload } from "../../scenes/sendfileFTP/sendfileFTP";
import useStyles from "./EmployeeDetail";
import CloseIcon from "@mui/icons-material/Close";
import { HandleCreateStaff } from "../../scenes/team/handlestaff";
import { ROLE_EMPLOYEE } from "../../utils/constant";
import { getAllBankName } from "./../../scenes/team/handleBank";
import { useForm } from "react-hook-form";
import InputForm from "../commons/input/InputForm";
import InputSelect from "../commons/input/InputSelect";
import { toast } from "react-toastify";

const AddEmployeeModal = ({ open, onClose, statechinhanh, updateStaff }) => {
  const classes = useStyles();
  const [editRole, setEditRole] = useState(false);
  const [currentFrontImage, setCurrentFrontImage] = useState("");
  const [currentBackImage, setCurrentBackImage] = useState("");
  const [AddStaffForm, setAddStaffForm] = useState({
    picture: "",
    pictureTwo: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    formState: { errors: formErrors },
    handleSubmit: handleSubmitForm,
    reset,
  } = useForm();

  const [isNewEmployeeOpen, setIsNewEmployeeOpen] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [employeeOptions, setEmployeeOptions] = useState([
    { value: ROLE_EMPLOYEE.MANAGER.VALUE, label: ROLE_EMPLOYEE.MANAGER.LABEL },
    {
      value: ROLE_EMPLOYEE.DEPUTY_MANAGER.VALUE,
      label: ROLE_EMPLOYEE.DEPUTY_MANAGER.LABEL,
    },
    { value: ROLE_EMPLOYEE.STAFF.VALUE, label: ROLE_EMPLOYEE.STAFF.LABEL },
  ]);
  const [options, setOptions] = useState([]);

  const handleImageUpload = async (e, setCurrentImage, fieldName) => {
    const render = new FileReader();
    render.readAsDataURL(e.target.files[0]);
    render.onload = () => {
      setCurrentImage(render.result);
    };
    render.onerror = (error) => {
      toast(error);
    };
    const file = e.target.files[0];
    try {
      const url = await HandleUpload(file, "STAFF", statechinhanh);
      setAddStaffForm((prevForm) => ({
        ...prevForm,
        [fieldName]: url,
      }));
    } catch (error) {
      toast("Failed to upload image");
    }
  };

  useEffect(() => {
    (async () => {
      const response = await getAllBankName();
      if (response) {
        const dataOption = JSON.parse(response)?.map((item) => {
          return {
            label: item.shortName,
            value: item.code,
            image: item.logo,
          };
        });
        setOptions(dataOption);
      }
    })();
  }, []);

  useEffect(() => {
    if (AddStaffForm) {
      setCurrentFrontImage(AddStaffForm.picture);
      setCurrentBackImage(AddStaffForm.pictureTwo);
    }
    if (
      AddStaffForm.Role !== ROLE_EMPLOYEE.STAFF.VALUE &&
      AddStaffForm.Role !== ROLE_EMPLOYEE.MANAGER.VALUE &&
      AddStaffForm.Role !== ROLE_EMPLOYEE.DEPUTY_MANAGER.VALUE
    ) {
      setEditRole(true);
    }
  }, [AddStaffForm]);

  const handleChange = (field, value) => {
    setAddStaffForm({
      ...AddStaffForm,
      [field]: value,
      branchID: statechinhanh,
    });
  };

  const handleOpenNewEmployeeDialog = () => {
    setIsNewEmployeeOpen(true);
  };

  const handleCloseNewEmployeeDialog = () => {
    setIsNewEmployeeOpen(false);
    setNewEmployeeName("");
  };

  const handleAddNewEmployee = async () => {
    if (newEmployeeName.trim() !== "") {
      if (employeeOptions.some((e) => e.label === newEmployeeName)) {
        toast(i18n.t("ROLE_EXISTED"));
        return;
      }
      const newEmployeeOption = {
        value: newEmployeeName.toUpperCase()?.replace(/\s+/g, "_"),
        label: newEmployeeName,
      };
      setEmployeeOptions((prevOptions) => [...prevOptions, newEmployeeOption]);
      handleChange("Role", newEmployeeOption.value);
      setNewEmployeeName("");
      setIsNewEmployeeOpen(false);
    }
  };

  const handleSubmitSuccess = async (data) => {
    const { picture, pictureTwo } = AddStaffForm;
    try {
      setIsLoading(true);
      await HandleCreateStaff({
        ...data,
        branchID: statechinhanh,
        picture,
        pictureTwo,
      });
      onClose();
      toast(i18n.t("SUCCESS_ADD_EMPLOYEE"));
      setIsLoading(false);
      reset();
      setAddStaffForm({
        picture: "",
        pictureTwo: "",
      });
      await updateStaff(statechinhanh);
    } catch (error) {
      toast(i18n.t("FAILURE_ADD_EMPLOYEE"));
    }
  };

  return (
    <Modal open={Boolean(open)} onClose={onClose}>
      <Box
        maxWidth={400}
        width={"100%"}
        maxHeight={1000}
        height={"90%"}
        className={classes.modalBox}
      >
        <Box
          padding={2}
          height={"70vh"}
          flex={1}
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
              {i18n.t("THEMNV")}
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
            padding={1}
            overflow={"auto"}
            flexDirection={"column"}
          >
            <form style={{ width: "100%" }}>
              <InputForm
                label={i18n.t("CCCD") || "CCCD"}
                register={register}
                id="id"
                errors={formErrors}
                validate={{
                  required: i18n.t("FIELD_REQUIRED"),
                  pattern: {
                    value: /[0-9]/,
                    message: i18n.t("NUMBER_REQUIRED"),
                  },
                }}
              ></InputForm>
              <InputForm
                label={i18n.t("TNV_TEAM")}
                register={register}
                id="name"
                errors={formErrors}
                validate={{
                  required: i18n.t("FIELD_REQUIRED"),
                }}
              ></InputForm>
              <InputForm
                label={i18n.t("SDT_TEAM")}
                register={register}
                id="phone"
                errors={formErrors}
                validate={{
                  required: i18n.t("FIELD_REQUIRED"),
                  pattern: {
                    value: /(0[3|5|7|8|9])+([0-9]{8})\b/,
                    message: i18n.t("PHONE_REQUIRED"),
                  },
                }}
              ></InputForm>
              <InputSelect
                label={i18n.t("CV_TEAM")}
                register={register}
                id="Role"
                errors={formErrors}
                validate={{
                  required: i18n.t("FIELD_REQUIRED"),
                }}
                onClickOpenNewEmployeeDialog={handleOpenNewEmployeeDialog}
                option={employeeOptions}
              ></InputSelect>
              <InputForm
                label={i18n.t("NV_TEAM")}
                register={register}
                id="ngayvao"
                type="date"
                errors={formErrors}
                validate={{
                  required: i18n.t("FIELD_REQUIRED"),
                }}
              ></InputForm>
              <InputSelect
                label={i18n.t("TENNH")}
                register={register}
                id="bankName"
                errors={formErrors}
                // validate={{
                //   required: i18n.t("FIELD_REQUIRED"),
                // }}
                option={options}
              ></InputSelect>
              <InputForm
                label={i18n.t("TTNH")}
                register={register}
                id="AccountBank"
                errors={formErrors}
                // validate={{
                //   required: i18n.t("FIELD_REQUIRED"),
                //   pattern: {
                //     value: /[0-9]/,
                //     message: i18n.t("NUMBER_REQUIRED"),
                //   },
                // }}
              ></InputForm>
              <Box
                justifyContent={"center"}
                alignItems={"center"}
                display={"flex"}
                flexDirection={"column"}
                mt={2}
              >
                {currentFrontImage && (
                  <img
                    src={currentFrontImage}
                    alt="Mặt trước CCCD"
                    width={300}
                    style={{ marginTop: "16px", borderRadius: "20px" }}
                  />
                )}
                <label htmlFor="picture">{i18n.t("CCCDF")}</label>
                <input
                  accept="image/*"
                  onChange={(e) => {
                    handleImageUpload(e, setCurrentFrontImage, "picture");
                  }}
                  type="file"
                  id="picture"
                  name="picture"
                ></input>
                {currentBackImage && (
                  <img
                    src={currentBackImage}
                    alt="Mặt sau CCCD"
                    width={300}
                    style={{ marginTop: "16px", borderRadius: "20px" }}
                  />
                )}
                <label htmlFor="pictureTwo">{i18n.t("CCCDB")}</label>
                <input
                  accept="image/*"
                  onChange={(e) => {
                    handleImageUpload(e, setCurrentBackImage, "pictureTwo");
                  }}
                  type="file"
                  id="pictureTwo"
                  name="pictureTwo"
                ></input>
              </Box>
            </form>
          </Box>
          <Box display="flex" justifyContent="center" mt={1}>
            <Button
              className={classes.button}
              onClick={handleSubmitForm(handleSubmitSuccess)}
              sx={{ mt: 2, borderRadius: "30px" }}
              variant="contained"
            >
              {isLoading ? <CircularProgress size={24} /> : i18n.t("Update")}
            </Button>
          </Box>
        </Box>
        <Dialog
          open={isNewEmployeeOpen}
          onClose={handleCloseNewEmployeeDialog}
          PaperProps={{
            style: {
              borderRadius: "20px",
              padding: "10px",
              backgroundColor: "black",
            },
          }}
        >
          <DialogTitle>
            <Typography variant="h5">Tên chức vụ</Typography>
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="newEmployeeName"
              type="text"
              className={classes.textFieldAdd}
              fullWidth
              value={newEmployeeName}
              onChange={(e) => setNewEmployeeName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              color="inherit"
              sx={{ borderRadius: "30px" }}
              onClick={handleCloseNewEmployeeDialog}
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
              onClick={handleAddNewEmployee}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Modal>
  );
};

export default AddEmployeeModal;
