import React, { useEffect, useState } from "react";

function Pagination(props) {
  const [page, set_page] = useState(props.currentpage);

  console.log(page, "outside");

  const Next = () => {
    set_page(page + 1);
    props.handle(props.currentpage + 1);
  };

  const Previous = () => {
    set_page(page - 1);
    props.handle(props.currentpage - 1);
  };

  return (
    <>
      <button
        className="btn btn-sm m-t-20 previous"
        disabled={props.currentpage > 1 ? false : true}
        onClick={Previous}
      >
        &lt;&lt; Previous
      </button>

      <button
        className="btn btn-sm  m-l-5 m-t-20 next font-color"
        disabled={0 < props.list ? false : true}
        onClick={Next}
      >
        Next &gt;&gt;
      </button>
    </>
  );
}

export default Pagination;
