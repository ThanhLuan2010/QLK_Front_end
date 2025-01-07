import DETAILS from "../scenes/Details/details";
import ChamCong from "../scenes/chamcong/chamcong";
import Contacts from "../scenes/contacts";
import Dashboard from "../scenes/dashboard";
import Form from "../scenes/form";
import Invoices from "../scenes/invoices";
import Team from "../scenes/team";
import XUATKHO from "../scenes/xuatkho";
import ORDER from "../scenes/Order";
import Bills from "../scenes/bill";
import DOANHTHU from "../scenes/doanhthu";
import DEBTORS from "../scenes/debtor";
import ACCOUNT from "../scenes/account";
import BRACNH from "../scenes/branch";
import Login from "../scenes/login/LoginPage";
import Father from "../FatherComponent";
import PendingOrders from "../scenes/pendingOrders";

export const routes = [
  { path: "/", element: <Father children={<Dashboard />} />, public: false },
  {
    path: "/details",
    element: <Father children={<DETAILS />} />,
    public: false,
  },
  { path: "/team", element: <Father children={<Team />} />, public: false },
  {
    path: "/chamcong",
    element: <Father children={<ChamCong />} />,
    public: false,
  },
  // {
  //   path: "/contacts",
  //   element: <Father children={<Contacts />} />,
  //   public: false,
  // },
  { path: "/form", element: <Father children={<Form />} />, public: false },
  // {
  //   path: "/invoices",
  //   element: <Father children={<Invoices />} />,
  //   public: false,
  // },
  // {
  //   path: "/xuatkho",
  //   element: <Father children={<XUATKHO />} />,
  //   public: false,
  // },
  // { path: "/orders", element: <Father children={<ORDER />} />, public: false },
  // { path: "/bills", element: <Father children={<Bills />} />, public: false },
  // {
  //   path: "/doanhthu",
  //   element: <Father children={<DOANHTHU />} />,
  //   public: false,
  // },
  // {
  //   path: "/debtors",
  //   element: <Father children={<DEBTORS />} />,
  //   public: false,
  // },
  {
    path: "/account",
    element: <Father children={<ACCOUNT />} />,
    public: false,
  },
  {
    path: "/branch",
    element: <Father children={<BRACNH />} />,
    public: false,
  },
  { path: "/login", element: <Login />, public: true },
  // { path: "/pending-orders", element: <Father children={<PendingOrders />} />, public: false },
];
