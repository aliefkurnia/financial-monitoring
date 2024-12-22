import Link from "next/link";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800">
        Aplikasi Penghitung Pengeluaran dan Pemasukan
      </h1>
      <p className="text-lg text-center text-gray-600 mb-6">
        Kelola pengeluaran dan pemasukan Anda dengan mudah.
      </p>

      <Link href="/login">
        <span className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
          Masuk
        </span>
      </Link>
    </div>
  );
};

export default Home;
