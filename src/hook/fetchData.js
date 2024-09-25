import { useEffect } from "react";
import { useState } from "react";
import { BASE_URL, baseQuery } from "../api/baseQuery";
import { getState } from "../store/configStore";

const useGetData = ({
  url = "",
  query,
  isLazy = true,
  isLoading = true,
}) => {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setloading] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(true);

  useEffect(() => {
      getData(1);
      setPage(1);
  }, []);

  const reLoad = () => {
    getData(1);
    setPage(1);
  };

  const onLoadMore = () => {
    if (canLoadMore) {
      if (!loading) {
        getData(page + 1);
        setPage(page + 1);
      }
    }
  };

  const getData = async (_page = page) => {
    
    // setCanLoadMore(true);
    // setloading(true);
    // const response = await baseQuery({
    //   url: url,
    //   query: isLazy
    //     ? {
    //         page: _page,
    //         ...query,
    //       }
    //     : null,
    // });
    // if (url?.includes("rule/get-rule")) {
    // }
    // if (isLazy) {
    //   if (response?.data?.page === 1) {
        
    //     setData(response?.data?.results);
    //   } else {
    //     setData(data?.concat(response?.data?.results));
    //   }
    //   if (response?.data?.results?.length < 10) {
    //     setCanLoadMore(false);
    //   }
    //   setTotal(response?.data?.totalResults);
    // } else {
    //   setData(response?.data);
    // }

    // setloading(false);
  };

  return {
    data,
    setData,
    reLoad,
    onLoadMore,
    loading,
    total,
  };
};

export default useGetData;
