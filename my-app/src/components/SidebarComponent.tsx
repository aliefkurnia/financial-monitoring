import { useRouter } from "next/router";
import Link from "next/link";

const Sidebar = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Hapus token dari sessionStorage
    sessionStorage.removeItem("authToken");

    // Arahkan pengguna kembali ke halaman login
    router.push("/login");
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-6">
      <h2 className="text-xl font-bold mb-4">Aplikasi Penghitung</h2>
      <ul>
        <li className="mb-4">
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>
        </li>
        <li className="mb-4">
          <Link href="/transactions" className="hover:underline">
            Transaksi
          </Link>
        </li>
        <li className="mb-4">
          <Link href="/settings" className="hover:underline">
            Pengaturan
          </Link>
        </li>
        {/* Tombol Logout */}
        <li className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
