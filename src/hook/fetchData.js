import { useCallback, useEffect } from "react";
import { useState } from "react";
import Url_BackEnd from "../URL";
import { firstValueFrom } from "rxjs";
import { Method } from "../api/common";

const useGetData = ({ url = "", queryParams }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState();
  const [pageCurrent, setPageCurrent] = useState(1);
  const limit = 10;

  const fetchData = useCallback(
    async (page = pageCurrent) => {
      setLoading(true);
      setError(null);
      try {
        const response = await firstValueFrom(
          Method.get(
            `${Url_BackEnd}${url}`,
            `${queryParams}&page=${page}&limit=${limit}`
          )
        );
        if (response?.data?.totalPages)
          setTotalPages(response?.data?.totalPages);
        setData(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [url, pageCurrent, queryParams]
  );

  const reLoad = () => {
    fetchData(1);
    setPageCurrent(1);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData, queryParams]);

  return { data, loading, error, pageCurrent, totalPages, reLoad };
};

export default useGetData;
