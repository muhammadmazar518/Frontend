import React from "react";
import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div style={styles.wrapper}>
      <Sidebar />
      <div style={styles.main}>
        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
      background: "#1B1464",
  },
  main: {
    marginLeft: "220px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    overflow: "hidden",
  },
  content: {
    padding: "36px 32px",
    flex: 1,
    boxSizing: "border-box",
    width: "100%",
  },
};

export default Layout;