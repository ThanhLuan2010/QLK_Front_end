import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import PlayArrowIcon from "@mui/icons-material/ArrowForwardIos";
import "./../EmployeeDetail/style.css";
import CommonStyle from "../CommonStyle";
import i18n from "../../i18n/i18n";
import { useTranslation } from "react-i18next";
import { Delete, DeleteForever, Edit } from "@mui/icons-material";
import EditProductModal from "../ProductModal/EditProductModal";

const CategoryList = ({
  admin,
  statechinhanh,
  category,
  onSelectionChange,
  onProductDeselect,
  selectedProducts,
  categorySelectionModels,
  setCategorySelectionModels,
  selectedProductsByCategory,
  setSelectedProductsByCategory,
  fetchingGettAllProduct_by_storeID,
}) => {
  const classes = CommonStyle();
  useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectionModel, setSelectionModel] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  useEffect(() => {
    if (selectedCategory) {
      const selectedIds = categorySelectionModels[selectedCategory] || [];
      setSelectionModel(selectedIds);
    }
  }, [selectedCategory, categorySelectionModels]);
  useEffect(() => {
    const updatedSelectionModel = selectedProducts
      .filter((product) => product.loai === selectedCategory)
      .map((product) => product.id);
    if (
      JSON.stringify(selectionModel) !== JSON.stringify(updatedSelectionModel)
    ) {
      setSelectionModel(updatedSelectionModel);
    }
  }, [selectedProducts, selectedCategory]);

  const handleSelectionModelChange = (newSelection) => {
    const selectedRows = newSelection.map((id) => {
      const selectedRow = category.find((row) => row.id === id);
      console.log({ selectedProducts, newSelection, selectedRow });

      const existingProduct = selectedProducts.find(
        (product) => product.id === id
      );
      return existingProduct ? existingProduct : { ...selectedRow, soluong: 1 };
    });

    const deselectedIds = selectionModel.filter(
      (id) => !newSelection.includes(id)
    );
    deselectedIds.forEach(handleDeselect);

    const updatedSelectionModel = [...newSelection];

    setCategorySelectionModels((prev) => ({
      ...prev,
      [selectedCategory]: updatedSelectionModel,
    }));

    setSelectedProductsByCategory((prev) => ({
      ...prev,
      [selectedCategory]: selectedRows,
    }));

    setSelectionModel(updatedSelectionModel);

    const allSelectedProducts = Object.values({
      ...selectedProductsByCategory,
      [selectedCategory]: selectedRows,
    }).flat();

    onSelectionChange(allSelectedProducts);

    console.log({
      selectedProducts,
      allSelectedProducts,
      selectedRows,
      selectedProductsByCategory,
    });
  };
  const handleCategoryChange = (loai) => {
    setSelectedCategory(loai);
    const selectedIds = categorySelectionModels[loai] || [];
    setSelectionModel(selectedIds);
  };

  const handleDeselect = (deselectedId) => {
    onProductDeselect(deselectedId);
  };
  const handleEdit = (id) => {
    const selectedProduct = category.find((product) => product.id === id);
    if (selectedProduct) {
      setCurrentProduct(selectedProduct);
      setIsEditModalOpen(true);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: i18n.t("MASP_P"),
      flex: 1,
    },
    {
      field: "soluong",
      headerName: i18n.t("SOLUONG_P"),
      flex: 1,
      hide: admin,
    },
    {
      field: "picture",
      headerName: i18n.t("Hình ảnh"),
      flex: 1,
      renderCell: (params) => (
        <img width={50} src={params.value} alt="Product" />
      ),
    },
    {
      headerName: "",
      flex: 0.5,
      hide: admin,
      renderCell: (params) => (
        <Box
          display={"flex"}
          width={"100%"}
          justifyContent={"center"}
          flexDirection={"row"}
        >
          <Box>
            <IconButton
              size="small"
              color="warning"
              onClick={() => handleEdit(params.id)}
            >
              <Edit></Edit>
            </IconButton>
          </Box>
          {/* <Box>
            <IconButton size="small" color="error">
              <DeleteForever></DeleteForever>
            </IconButton>
          </Box> */}
        </Box>
      ),
    },
  ];

  const rows = category
    .filter((item) => item.loai === selectedCategory)
    .map((item) => ({
      id: item.id,
      soluong: item.soluong,
      picture:
        item.picture === "..." || item.picture === null
          ? item.pictureview
          : item.picture,
    }));
  return (
    <Box mb={5} gap={2} display={"flex"} flexDirection={"row"} width={"100%"}>
      <Box
        flex={1}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        border={"1px solid #CECECE"}
        borderRadius={"20px"}
        p={2}
      >
        <Typography mb={2} fontWeight={"bold"} color={"black"}>
          {i18n.t("TypeProduct")}
        </Typography>
        <Box
          maxHeight={"300px"}
          height={"100%"}
          overflow={"auto"}
          width={"100%"}
          className="custom-scroll"
          p={1}
        >
          {Array.from(new Set(category.map((item) => item.loai))).map(
            (loai) => (
              <Button
                sx={{
                  backgroundColor:
                    selectedCategory === loai ? "#3F3F3F" : "#f3f3f3",
                  borderRadius: "40px",
                  "&:hover": {
                    backgroundColor:
                      selectedCategory === loai ? "#3F3F3F" : "#E2E2E2",
                  },
                  mb: 1,
                }}
                fullWidth
                onClick={() => handleCategoryChange(loai)}
              >
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  width={"100%"}
                  key={loai}
                  color={selectedCategory === loai ? "white" : "#535353"}
                  p={"2px"}
                >
                  <Typography textTransform={"none"} fontWeight={"500"}>
                    {loai}
                  </Typography>
                  <PlayArrowIcon />
                </Box>
              </Button>
            )
          )}
        </Box>
      </Box>
      <Box className={classes.datagridInfo} flex={2}>
        <DataGrid
          checkboxSelection={admin}
          editMode="row"
          components={{
            Toolbar: GridToolbar,
          }}
          selectionModel={selectionModel}
          onSelectionModelChange={handleSelectionModelChange}
          rows={rows}
          columns={columns}
          pageSize={4}
        />
      </Box>
      {isEditModalOpen && (
        <EditProductModal
          open={isEditModalOpen}
          handleClose={() => setIsEditModalOpen(false)}
          stateProduct={currentProduct}
          setStateProduct={setCurrentProduct}
          statechinhanh={statechinhanh}
          fetchingGettAllProduct_by_storeID={fetchingGettAllProduct_by_storeID}
        />
      )}
    </Box>
  );
};

export default CategoryList;
