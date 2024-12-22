import { useState } from "react";
import RegisterModal from "./RegisterModal";
import { useRouter } from "next/router";

const Login = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const router = useRouter();

  const toggleRegisterModal = () => {
    setShowRegisterModal(!showRegisterModal);
  };

  const handleRegisterSuccess = () => {
    setStatusMessage("Registrasi berhasil! Silakan login.");
    toggleRegisterModal();
  };

  const handleRegisterError = (message: string) => {
    setStatusMessage(`Error: ${message}`);
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = (e.target as HTMLFormElement).email.value;
    const password = (e.target as HTMLFormElement).password.value;

    try {
      const response = await fetch(`/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token && data.userId) {
          sessionStorage.setItem("authToken", data.token);
          sessionStorage.setItem("userId", data.userId);
          setStatusMessage("Login berhasil!");
          router.push("/dashboard");
        } else {
          setStatusMessage("Response API tidak mengandung userId atau token.");
        }
      } else {
        const errorData = await response.json();
        setStatusMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setStatusMessage("Terjadi kesalahan saat login.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6">Login</h1>

      <form onSubmit={handleLoginSubmit} className="w-full max-w-md space-y-4">
        <div>
          <label htmlFor="email" className="block text-lg">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-lg">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          Login
        </button>
      </form>

      {statusMessage && (
        <div
          className={`mt-4 text-center text-lg ${
            statusMessage.includes("berhasil")
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {statusMessage}
        </div>
      )}

      <div className="mt-4">
        <p className="text-sm text-gray-500">
          Belum punya akun?{" "}
          <button
            onClick={toggleRegisterModal}
            className="text-blue-600 hover:text-blue-800"
          >
            Daftar di sini
          </button>
        </p>
      </div>

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={toggleRegisterModal}
        onRegisterSuccess={handleRegisterSuccess}
        onRegisterError={handleRegisterError}
      />
    </div>
  );
};

export default Login;
