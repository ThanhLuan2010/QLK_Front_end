import Url_BackEnd from "../../URL";
import "./style.css";
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
      sotienThucTe: req.sotienThucTe,
      StoreID: req.StoreID,
      ngaylap: req.ngaylap,
      updateDate: "...",
    })
  );

  return JSON.stringify(response);
};

export const Get_all_Order = async (req) => {
  const response = await firstValueFrom(
    Method.get(`${Url_BackEnd}/order/getAllOrder`)
  );
  return JSON.stringify(response.All_Order);
};

export const Get_all_Phieu_Store = async (req) => {
  const response = await firstValueFrom(
    Method.get(`${Url_BackEnd}/phieustore/getallphieustore`)
  );
  return JSON.stringify(response.All_PhieuStore);
};

export const Get_all_Phieu_Store_By_StoreID = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/phieustore/getphieustoreByUserID`, {
      StoreID: req,
    })
  );
  return JSON.stringify(response.All_PhieuStore);
};

export const Update_PhieuStore_By_id = async (req) => {
  const response = await firstValueFrom(
    Method.put(`${Url_BackEnd}/phieustore/UpdatePhieuStore`, {
      arrayUpdate: req,
    })
  );
  return JSON.stringify(response.All_PhieuStore);
};
