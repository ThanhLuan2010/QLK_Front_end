import Url_BackEnd from "../../URL";
import { firstValueFrom } from "rxjs";
import { Method } from "../../api/common";

export const GET_ALL_DOANHTHU_By_storeID = async (req) => {
  const response = await firstValueFrom(
    Method.post(`${Url_BackEnd}/doanhthu/getalldoanhthuByStoreId`, {
      storeID: req,
    })
  );
  return JSON.stringify(response.All_DOANHTHU);
};
