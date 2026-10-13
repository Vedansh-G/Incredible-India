import Navbar from "./Navbar";

function Layout({ children, transparentNav = false, className = "" }) {
  return (
    <div className={`page-shell flex flex-col ${className}`}>
      <Navbar transparent={transparentNav} />
      <main className="min-h-0 flex-1">{children}</main>
    </div>
  );
}

export default Layout;
