// import { useCallback, useEffect, useState } from "react";
// import Url_BackEnd from "../URL";
// import { firstValueFrom } from "rxjs";
// import { Method } from "../api/common";

// const useGetData = ({
//   url = "",
//   queryParams,
//   pageSize = 10,
//   limit = 10,
//   pageCurrent,
// }) => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [totalPages, setTotalPages] = useState();

//   const fetchData = useCallback(async () => {
//    alert(`${Url_BackEnd}${url}`)
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await firstValueFrom(
//         Method.get(
//           `${Url_BackEnd}${url}`,
//           `${queryParams}&page=${pageCurrent}&limit=${limit}`
//         )
//       );
//       if (response?.data?.totalPages) setTotalPages(response?.data?.totalPages);
//       setData(response);
//     } catch (err) {
//       setError(err);
//     } finally {
//       setLoading(false);
//     }
//   }, [url, pageCurrent, pageSize, queryParams]);

//   const reload = () => {
//     fetchData();
//   };

//   return { data, loading, error, pageCurrent, totalPages, reload };
// };

// export default useGetData;

import { useCallback, useEffect, useState } from "react";
import Url_BackEnd from "../URL";
import { firstValueFrom } from "rxjs";
import { Method } from "../api/common";

const useGetData = ({
  url = "",
  queryParams,
  pageSize = 10,
  limit = 10,
  pageCurrent,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState();
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await firstValueFrom(
        Method.get(
          `${Url_BackEnd}${url}`,
          `${queryParams}&page=${pageCurrent}&limit=${limit}`
        )
      );
      if (response?.data?.totalPages) setTotalPages(response?.data?.totalPages);
      setData(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, pageCurrent, pageSize, queryParams]);

  const reload = () => {
    fetchData()
  };



  return { data, loading, error, pageCurrent, totalPages, reload };
};

export default useGetData;