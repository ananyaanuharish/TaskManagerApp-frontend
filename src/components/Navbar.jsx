import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Task Manager</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:text-blue-500">Home</Link>
        <Link to="/login" className="hover:text-blue-500">Login</Link>
        <Link to="/register" className="hover:text-blue-500">Register</Link>
        <Link to="/dashboard" className="hover:text-blue-500">Dashboard</Link>
        <Link to="/recycle-bin" className="hover:text-red-500">Recycle Bin</Link> {/* NEW */}
      </div>
    </nav>
  );
}

export default Navbar;
