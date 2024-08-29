import Url_BackEnd from "../../URL";
import { firstValueFrom } from "rxjs";
import { Method } from "../../api/common";

export const GET_ALL_MONEY_BY_STOREID_THOIDIEM_OF_DOANHTHU = async (req) => {
  if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
    const response = await firstValueFrom(
      Method.post(`${Url_BackEnd}/doanhthu/getSotienalldoanhthuStoreId`, {
        storeID: req.storeID,
        thoidiem: req.thoidiem,
      })
    );
    return response;
  }
};

export const GET_ALL_MONEY_BY_STOREID_THOIDIEM_OF_PHIEUSTORE = async (req) => {
  if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
    const response = await firstValueFrom(
      Method.post(`${Url_BackEnd}/phieustore/getallsotienByStoreIdNgayLap`, {
        storeID: req.storeID,
        thoidiem: req.thoidiem,
      })
    );
    return response;
  }
};
