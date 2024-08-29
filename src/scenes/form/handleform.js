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
      sotienThucTe: req.sotienThucTe,
      StoreID: req.StoreID,
      ngaylap: req.ngaylap,
      updateDate: "...",
    })
  );
  return JSON.stringify(response);
};
