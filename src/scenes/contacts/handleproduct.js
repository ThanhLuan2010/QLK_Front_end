import Url_BackEnd from "../../URL";
import { firstValueFrom } from "rxjs";
import { Method } from "../../api/common";
export const Get_all_Product_By_StoreID = async (req) => {
  let tempstoreid = "";
  if (!req.StoreID) {
    tempstoreid = req;
  } else {
    tempstoreid = req.StoreID;
  }

  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/product/getallproduct`, {
      StoreID: tempstoreid,
      startIndex: req.startIndex,
      endIndex: req.endIndex,
    })
  );

  return JSON.stringify(response.All_Products);
};

export const Get_all_ProductB_By_StoreID = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/productp/getallproductB`, {
      StoreID: req,
    })
  );

  return JSON.stringify(response.All_Products);
};

export const Get_all_LENGHT_Product_By_StoreID = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/product/getallProductLength`, {
      StoreID: req,
    })
  );
  return response.soluong;
};
export const createProduct = async (req) => {
  if (!req.name) {
    req.name = "...";
  }

  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/product/create`, {
      id: req.id,
      name: req.name,
      picture: req.picture ? req.picture : "...",
      loai: req.loai,
      soluong: req.soluong,
      status: "GOOD",
      StoreID: req.StoreID,
      behavior: req.behavior,
      xuatxu: "...",
      sotien: req.sotien,
    })
  );
  return JSON.stringify(response);
};

export const createProductp = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/productp/create`, {
      id: req.id,
      name: req.name,
      picture: req.picture,
      loai: req.loai,
      soluong: req.soluong,
      status: req.status,
      StoreID: req.StoreID,
      date: req.date,
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
      sotien: req.sotien,
    })
  );
  console.log("======", response);
  return JSON.stringify(response);
};

export const DeleteProduct = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/product/delete`, {
      arraydelted: req,
    })
  );
  return JSON.stringify(response);
};
