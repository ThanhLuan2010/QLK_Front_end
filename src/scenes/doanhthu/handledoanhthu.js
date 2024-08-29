import { firstValueFrom } from "rxjs";
import Url_BackEnd from "../../URL";
import { Method } from "../../api/common";

export const GET_ALL_DOANHTHU_By_storeID = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/doanhthu/getalldoanhthuByStoreId`, {
      storeID: req,
    })
  );
  return JSON.stringify(response.All_DOANHTHU);
};

export const Update_ListOfCreditors_Listdebtors_By_id = async (req) => {
  const response = await firstValueFrom(
    Method.put(`${Url_BackEnd}/doanhthu/updateDoanhthuListDebCre`, {
      storeID: req.storeID,
      thoidiem: req.thoidiem,
      ListOfCreditors: req.ListOfCreditors,
      Listdebtors: req.Listdebtors,
    })
  );
  return JSON.stringify(response.All_PhieuStore);
};

export const Update_SOTIENTHUCTE_By_DATE_STOREID = async (req) => {
  const response = await firstValueFrom(
    Method.put(`${Url_BackEnd}/doanhthu/updatesotienAcceptN`, {
      storeID: req.storeID,
      sotienThucte: req.sotienThucte,
      thoidiem: req.thoidiem,
      access: req.access,
      dsmua: req.dsmua,
    })
  );
  return JSON.stringify(response);
};
