import Url_BackEnd from "../../URL";
import { firstValueFrom } from "rxjs";
import { Method } from "../../api/common";

export const GET_ALL_DOANHTHU_By_storeID = async (req) => {
  if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
    const response = await firstValueFrom(
      Method.post(`${Url_BackEnd}/doanhthu/getalldoanhthuByStoreId`, {
        storeID: req,
      })
    );
    return JSON.stringify(response.All_DOANHTHU);
  }
};

export const GET_ALL_DOANHTHU_By_storeID_date = async (req) => {
  if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
    const response = await firstValueFrom(
      Method.post(`${Url_BackEnd}/doanhthu/getdoanhthubyDate`, {
        storeID: req.storeID,
        thoidiem: req.thoidiem,
      })
    );
    return JSON.stringify(response.All_DOANHTHU);
  }
};

export const Update_ListOfCreditors_Listdebtors_By_id = async (req) => {
  if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
    const response = await firstValueFrom(
      Method.put(`${Url_BackEnd}/doanhthu/updateDoanhthuListDebCre`, {
        storeID: req.storeID,
        thoidiem: req.thoidiem,
        ListOfCreditors: req.ListOfCreditors,
        Listdebtors: req.Listdebtors,
      })
    );
    return JSON.stringify(response.All_PhieuStore);
  }
};
export const Update_SOTIEN_Listdebtors = async (req) => {
  if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
    const response = await firstValueFrom(
      Method.put(`${Url_BackEnd}/doanhthu/updatesotienOfListdebtors`, {
        storeID: req.storeID,
        DebtorId: req.DebtorId,
        thoidiem: req.thoidiem,
        sotien: req.sotien,
        sotiencapnhat: req.sotiencapnhat,
        storeIDNo: req.storeIDNo,
      })
    );
    return JSON.stringify(response.All_PhieuStore);
  }
};
