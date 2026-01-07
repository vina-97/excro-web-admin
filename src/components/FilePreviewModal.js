import React, { useState } from "react";

import Modal from "react-modal";

function FilePreviewModal({ ...props }) {
  const [file, setFile] = useState(props.data);
  const docs = ["application/pdf", "pdf"];
  const Imagetype = ["image/jpeg", "image/png", "jpeg", "png", "jpg"];
  return (
    <div>
      <Modal
        isOpen={props.open}
        onRequestClose={() => props.setOpen(false)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            maxHeight: "90vh",
            overflow: "auto",
            width: docs.includes(file.docsData?.type) ? "50%" : "40%",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            border: "none",
            paddingBottom: "30px",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)", // optional: semi-transparent overlay
          },
        }}
      >
        <div className="text-right" style={{ marginBottom: "20px" }}>
          <button className="remove-docs " onClick={() => props.setOpen(false)}>
            x
          </button>
        </div>
        {file && Imagetype.includes(file.docsData?.type) && (
          <div className="center-file">
            <img
              src={file?.signedUrl}
              alt="preview"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        )}

        {file && docs.includes(file.docsData?.type) && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "48vw",
              height: "85vh",
            }}
          >
            <iframe
              src={file?.signedUrl}
              width="100%"
              height="100%"
              style={{ border: "none", paddingBottom: "30px" }}
              title="PDF Preview"
            ></iframe>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default FilePreviewModal;
