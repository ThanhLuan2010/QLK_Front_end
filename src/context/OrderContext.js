import React, { createContext, useState, useContext } from "react";
import { Get_all_Order } from "../scenes/xuatkho/handlePhieustore";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const fetchingOrderBy_storeID = async () => {
    try {
      const response = await Get_all_Order();
      const res = JSON.parse(response);

      const watingOrders = res.filter((order) =>
        order.status.includes("PENDING")
      );

      setOrders(watingOrders);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  //   const fetchingOrderBy_storeID = async () => {
  //   try {
  //     const check = await Get_all_Order();

  //     if (check instanceof Promise) {
  //       const resolvedResult = await check;

  //       const orders = JSON.parse(resolvedResult);

  //       const watingOrders = orders.filter((order) =>
  //         order.status.includes("PENDING")
  //       );

  //       setStatePhieuStore(watingOrders);
  //     } else {
  //       const orders = JSON.parse(check);

  //       const watingOrders = orders.filter((order) =>
  //         order.status.includes("PENDING")
  //       );

  //       setStatePhieuStore(watingOrders);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch orders by store ID and year-month", error);
  //   }
  // };

  return (
    <OrderContext.Provider value={{ orders, fetchingOrderBy_storeID }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => useContext(OrderContext);
