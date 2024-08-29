import Url_BackEnd from "../../URL";
import { firstValueFrom } from "rxjs";
import { Method } from "../../api/common";
export const createDebtor = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/debtors/create`, {
      id: req.id,
      Debtor_BranchID: req.Debtor_BranchID,
      Owner_BranchID: req.Owner_BranchID,
      sotienNo: req.sotienNo,
      ThoiDiemNo: req.ThoiDiemNo,
      LastPaymentDate: req.LastPaymentDate,
      status: req.status,
      Note: req.Note,
      arrayProduct: req.arrayProduct,
      OrderId: req.OrderId,
    })
  );
  return JSON.stringify(response);
};
export const Get_all_DEBTOR = async (req) => {
  const response = await firstValueFrom(
    Method.get(`${Url_BackEnd}/debtors/getAllDebtor`)
  );

  return JSON.stringify(response.All_DEBTOR);
};
export const Update_DOANHTHU_BY_storeID_thoidiem = async (req) => {

  const response = await firstValueFrom(
    Method.put(`${Url_BackEnd}/doanhthu/updatesotien`, {
      storeID: req.storeID,
      thoidiem: req.thoidiem,
    })
  );
  return JSON.stringify(response);
};
