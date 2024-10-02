import React from "react";
import Pagination from "@mui/material/Pagination";

const PaginationCustom = ({ pageCurrent, countPage }) => {
  return (
    <div>
      <Pagination
        count={countPage}
        page={pageCurrent}
        variant="outlined"
        shape="rounded"
      />
    </div>
  );
};

export default PaginationCustom;
