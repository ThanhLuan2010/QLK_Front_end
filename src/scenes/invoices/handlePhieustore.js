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
      updateDate: "...",
    })
  );
  console.log(response);
  return JSON.stringify(response);
};
export const Get_all_Phieu_Store = async (req) => {
  const response = await firstValueFrom(
    Method.get(`${Url_BackEnd}/phieustore/getallphieustore`)
  );
  return JSON.stringify(response.All_PhieuStore);
};

export const Get_all_Phieu_Store_By_Status = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/phieustore/gettallphieustoreBystatus`, {
      status: req,
    })
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

export const Get_all_Phieu_Store_By_Year_Month = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/phieustore/getPhieuStoreByYearMonth`, {
      storeID: req.storeID,
      thoidiem: req.thoidiem,
    })
  );
  return JSON.stringify(response.All_phieustore);
};

export const Get_all_COST_Phieu_Store_By_Year_Month = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/phieustore/getPhieuGiamuaAccept`, {
      storeID: req.storeID,
      thoidiem: req.thoidiem,
    })
  );
  return JSON.stringify(response.All_phieustore);
};
export const Update_PhieuStore_By_id_Invoces = async (req) => {
  const response = await firstValueFrom(
    Method.put(`${Url_BackEnd}/phieustore/UpdatePhieuStore`, {
      arrayUpdate: req,
      status: "ACCEPT",
    })
  );
  return JSON.stringify(response);
};

export const Update_PhieuStore_By_id = async (req) => {
  const response = await firstValueFrom(
    Method.put(`${Url_BackEnd}/phieustore/UpdatePhieuStore`, {
      arrayUpdate: req[0].array,
      status: "ACCEPT",
      newmoney: req[0].newmoney,
    })
  );
  return JSON.stringify(response);
};

export const Update_PhieuStore_By_id_WATING = async (id, req) => {
  const response = await firstValueFrom(
    Method.put(`${Url_BackEnd}/phieustore/UpdatePhieuStore`, {
      arrayUpdate: id,
      status: "WAITING",
      arrayProduct: req,
    })
  );
  return JSON.stringify(response);
};
export const Update_PhieuStore_By_id_PENDING = async (req) => {
  const response = await firstValueFrom(
    Method.put(`${Url_BackEnd}/phieustore/UpdatePhieuStore`, {
      arrayUpdate: req,
      status: "PENDING",
    })
  );
  return JSON.stringify(response);
};

export const Update_PhieuStore_By_id_CANCEL = async (req) => {
  const response = await firstValueFrom(
    Method.put(`${Url_BackEnd}/phieustore/UpdatePhieuStore`, {
      arrayUpdate: req,
      status: "CANCEL",
    })
  );
  return JSON.stringify(response);
};
