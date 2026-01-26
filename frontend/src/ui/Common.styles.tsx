// // File: frontend/src/ui/Common.styles.tsx
// import React from "react";
//
// type PropsWithChildren = { children?: React.ReactNode };
//
// // Simple presentational wrappers with inline styles to avoid additional deps
// export const PageContainer: React.FC<PropsWithChildren> = ({ children }) => (
//     <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>{children}</div>
// );
//
// export const PageHeader: React.FC<PropsWithChildren> = ({ children }) => (
//     <header style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//         {children}
//     </header>
// );
//
// export const TableContainer: React.FC<PropsWithChildren> = ({ children }) => (
//     <div style={{ overflowX: "auto", background: "#fff", borderRadius: 8, padding: 12 }}>{children}</div>
// );
//
// export const StyledTable: React.FC<PropsWithChildren> = ({ children }) => (
//     <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>{children}</table>
// );
//
// export const ActionButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...rest }) => (
//     <button
//         {...rest}
//         style={{
//             backgroundColor: "#28a745",
//             color: "#fff",
//             border: "none",
//             padding: "6px 10px",
//             borderRadius: 4,
//             cursor: "pointer",
//             fontWeight: 600,
//         }}
//     >
//         {children}
//     </button>
// );
//
// export const DeleteButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...rest }) => (
//     <button
//         {...rest}
//         style={{
//             backgroundColor: "#f0ad4e",
//             color: "#fff",
//             border: "none",
//             padding: "6px 10px",
//             borderRadius: 4,
//             cursor: "pointer",
//             fontWeight: 600,
//         }}
//     >
//         {children}
//     </button>
// );
