import { Outlet } from "react-router-dom";
import Header from "../components/common/Header/Header";
import Footer from "../components/common/Footer";

function Roots() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "100vh",
      }}
    >
      <Header />
      <Outlet />
      {/* <Footer /> */}
    </div>
  );
}
export default Roots;
