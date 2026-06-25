"use client";

import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => <div style={{ height: "400px", width: "100%", borderRadius: "12px", backgroundColor: "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading Map...</div>,
});

export default DynamicMap;
