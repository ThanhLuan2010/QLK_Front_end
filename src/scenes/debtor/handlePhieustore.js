import Url_BackEnd from "../../URL";
import "./style.css";
import { firstValueFrom } from "rxjs";
import { Method } from "../../api/common";
export const createPhieu = async (req) => {
  if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
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

    return JSON.stringify(response);
  }
};

export const Get_all_Order = async (req) => {
  if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
    const response = await firstValueFrom(
      Method.get(`${Url_BackEnd}/order/getAllOrder`)
    );

    return JSON.stringify(response.All_Order);
  }
};

export const Get_all_Phieu_Store = async (req) => {
  if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
    const response = await firstValueFrom(
      Method.get(`${Url_BackEnd}/phieustore/getallphieustore`)
    );

    return JSON.stringify(response.All_PhieuStore);
  }
};

export const Get_all_Phieu_Store_By_StoreID = async (req) => {
  if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
    const response = await firstValueFrom(
      Method.post(`${Url_BackEnd}/phieustore/getphieustoreByUserID`, {
        StoreID: req,
      })
    );

    return JSON.stringify(response.All_PhieuStore);
  }
};

export const Update_SOTIEN_DOANHTHU_By_TWOid = async (req) => {
  if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
    console.log("check req " + JSON.stringify(req));
    const response = await firstValueFrom(
      Method.put(
        `${Url_BackEnd}/debtors/updateSotienByDebtor_BranchIDAndOwner_BranchID`,
        {
          id: req.id,
          Owner_BranchID: req.Owner_BranchID,
          Debtor_BranchID: req.Debtor_BranchID,
          sotienNo: req.sotienNo,
          ThoiDiemNo: req.ThoiDiemNo,
          sotiencapnhat: req.sotiencapnhat,
          Note: req.Note,
        }
      )
    );

    return JSON.stringify(response);
  }
};
