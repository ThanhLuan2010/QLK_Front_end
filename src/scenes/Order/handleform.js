import Url_BackEnd from "../../URL";
import { firstValueFrom } from "rxjs";
import { Method } from "../../api/common";
export const createPhieu = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/phieustore/create`, {
      id: req.id,
      status: req.status,
      userID: req.userID,
      loaiphieu: req.loaiphieu,
      sotien: req.sotien,
      arrayProduct: req.arrayProduct,
      StoreID: req.StoreID,
      updateDate: "...",
    })
  );
  return JSON.stringify(response);
};
export const getAllOrder_BY_storeID = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/order/getAllOrderByStoreId`, {
      storeID: req,
    })
  );
  return JSON.stringify(response.All_Order);
};

export const createOrder = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/order/create`, {
      id: req.id,
      tongtien: req.tongtien,
      storeID: req.storeID,
      arrayProduct: req.arrayProduct,
      CreateAt: req.CreateAt,
      phieustoreID: req.phieustoreID,
    })
  );
  return JSON.stringify(response);
};
