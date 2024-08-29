import Url_BackEnd from "../../URL";
import { firstValueFrom } from "rxjs";
import { Method } from "../../api/common";
export const GET_ALLDEBTOR_BY_Debtor_BranchID = async (req) => {
  if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
    const response = await firstValueFrom(
      Method.post(`${Url_BackEnd}/debtors/getAllDebtor_byDebtor_BranchID`, {
        Debtor_BranchID: req,
      })
    );
    return JSON.stringify(response.All_DEBTOR);
  }
};

export const GET_ALLDEBTOR_BY_Debtor_Year_month = async (req) => {
  if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
    const response = await firstValueFrom(
      Method.post(`${Url_BackEnd}/debtors/getAlldebtorByYearMonth`, {
        storeID: req.storeID,
        thoidiem: req.thoidiem,
      })
    );
    return JSON.stringify(response.All_Debtor);
  }
};

export const GET_ALLDEBTOR_CONNO = async (req) => {
  if (localStorage.getItem("token") && localStorage.getItem("token") !== "") {
    const response = await firstValueFrom(
      Method.get(`${Url_BackEnd}/debtors/getAllDebtorNo`)
    );
    return JSON.stringify(response.All_DEBTOR);
  }
};
