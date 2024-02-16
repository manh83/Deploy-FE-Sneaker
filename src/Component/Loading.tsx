import React from "react";
import { FaSpinner } from "react-icons/fa";

const Loading = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        zIndex: 9999,
        fontSize: 50
      }}
    >
      <FaSpinner
        style={{
          animation: "spin 1s infinite linear",
        }}
      />
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Loading;
