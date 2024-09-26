import { useCallback, useEffect } from "react";
import { useState } from "react";
import Url_BackEnd from "../URL";
import { firstValueFrom } from "rxjs";
import { Method } from "../api/common";

const useGetData = ({ url = "", queryParams, pageSize = 10, limit = 10 }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // handle save in Redux
  const [totalPages, setTotalPages] = useState();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await firstValueFrom(
        Method.get(`${Url_BackEnd}${url}`, `page=${page}&limit=${limit}`)
      );
      if (response?.data?.totalPages) setTotalPages(response?.data?.totalPages);
      setData(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, page, totalPages };
};

export default useGetData;
