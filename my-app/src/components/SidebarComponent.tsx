import { useRouter } from "next/router";
import Link from "next/link";
import { FaBars, FaTachometerAlt, FaExchangeAlt, FaCogs } from "react-icons/fa";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    router.push("/login");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`bg-gray-800 text-white h-screen p-6 fixed top-0 left-0 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <FaBars size={20} />
        </button>
      </div>
      <ul>
        <li className="mb-4" title="Dashboard">
          <Link href="/dashboard">
            <div className="flex items-center space-x-4 cursor-pointer hover:underline">
              <FaTachometerAlt size={20} />
              {isOpen && <span>Dashboard</span>}
            </div>
          </Link>
        </li>
        <li className="mb-4" title="Transaksi">
          <Link href="/transactions">
            <div className="flex items-center space-x-4 cursor-pointer hover:underline">
              <FaExchangeAlt size={20} />
              {isOpen && <span>Transaksi</span>}
            </div>
          </Link>
        </li>
        <li className="mb-4" title="Pengaturan">
          <Link href="/settings">
            <div className="flex items-center space-x-4 cursor-pointer hover:underline">
              <FaCogs size={20} />
              {isOpen && <span>Pengaturan</span>}
            </div>
          </Link>
        </li>
      </ul>
      {isOpen && (
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
