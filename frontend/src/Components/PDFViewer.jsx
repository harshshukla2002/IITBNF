import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const PdfViewer = ({ pdfUrl, setViewPdf }) => {
  return (
    <div
      style={{
        margin: "20px",
      }}
    >
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer fileUrl={pdfUrl} defaultScale={1.0} />
      </Worker>
      <div
        className="button-wrapper"
        style={{ width: "50%", margin: "auto", marginBlock: "20px" }}
        onClick={() => setViewPdf(false)}
      >
        Close
      </div>
    </div>
  );
};

export default PdfViewer;
