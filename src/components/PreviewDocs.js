import React, { useState } from "react";
import pdfimg from "../assets/images/pdf.png";
import images from "../assets/images/images.png";
import FilePreviewModal from "./FilePreviewModal";

const PreviewDocs = ({ ...props }) => {
  const [open, setOpen] = useState(false);
  const supporting = props?.transactionData?.supporting_document
    ? props?.transactionData?.supporting_document
    : props?.transactionData;
  const url = supporting?.signedUrl
    ? supporting?.signedUrl
    : supporting?.signed_url;
  const file = supporting?.fileName
    ? supporting?.fileName
    : supporting?.file_name;

  const ext = file?.split(".").pop().toLowerCase();

  const openFullView = () => {
    if (url) {
      // window.open(url, "_blank"); // opens full view in a new tab
      setOpen(true);
    }
  };
  return url ? (
    <>
      <div className="col-xs-4 detail-label">Proof of Transaction</div>
      <div className="col-xs-6 detail-value">
        <div className="doc-item">
          <button
            type="button"
            onClick={openFullView}
            className="doc-preview"
            title={supporting?.fileName}
          >
            <img src={ext === "pdf" ? pdfimg : images} alt="docs" />
            <span className="doc-name">{supporting?.fileName}</span>
          </button>
        </div>
      </div>

      <FilePreviewModal
        data={{ signedUrl: url, docsData: { type: ext } }}
        open={open}
        setOpen={setOpen}
      />
    </>
  ) : (
    ""
  );
};

export default PreviewDocs;
