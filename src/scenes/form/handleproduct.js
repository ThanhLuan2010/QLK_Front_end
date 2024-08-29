import Url_BackEnd from "../../URL";
import { firstValueFrom } from "rxjs";
import { Method } from "../../api/common";
export const Get_all_Product_By_StoreID = async (req) => {
  try {
    const response = await firstValueFrom(
      Method.post(`${Url_BackEnd}/product/getallproduct`, {
        StoreID: req,
      })
    );
    return JSON.stringify(response.All_Products);
  } catch (error) {
    console.error("Error fetching all products by store ID:", error);
    return "false";
  }
};
export const createProduct = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/product/create`, {
      id: req.id,
      name: req.name,
      picture: req.picture,
      loai: req.loai,
      soluong: req.soluong,
      status: "GOOD",
      StoreID: req.StoreID,
      behavior: req.behavior,
      xuatxu: req.xuatxu,
      sotien: req.sotien,
    })
  );

  return JSON.stringify(response);
};

export const EditProduct = async (req) => {
  const response = await firstValueFrom(
    Method.put(`${Url_BackEnd}/product/update`, {
      id: req.id,
      name: req.name,
      picture: req.picture,
      loai: req.loai,
      soluong: parseInt(req.soluong),
      status: req.status,
      StoreID: req.StoreID,
      xuatxu: req.xuatxu,
    })
  );
  return JSON.stringify(response.All_Products);
};

export const DeleteProduct = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/product/delete`, {
      arraydelted: req,
    })
  );
  return JSON.stringify(response);
};
export const GetNameProduct = async () => {
  const response = await firstValueFrom(
    Method.get(`${Url_BackEnd}/product/get-product-search`)
  );
  return response.data;
};

export const AddNameProduct = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/product/create-product-search`, {
      name: req,
    })
  );
  console.log(response);
  return response;
};

export const DeleteNameProduct = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/product/delete-product-search`, {
      id: req,
    })
  );

  return response;
};
