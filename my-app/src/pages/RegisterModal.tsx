import { useState } from "react";
import { useRouter } from "next/router";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: () => void;
  onRegisterError: (message: string) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess,
  onRegisterError,
}) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onRegisterSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        const message = errorData.message || "Terjadi kesalahan, coba lagi.";
        setErrorMessage(message);
        onRegisterError(message);
      }
    } catch (error) {
      console.log(error);

      setErrorMessage("Terjadi kesalahan saat menghubungi server.");
      onRegisterError("Terjadi kesalahan saat menghubungi server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-lg">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md mb-4"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-lg">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md mb-4"
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
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md mb-4"
              required
            />
          </div>

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Mendaftar..." : "Daftar"}
          </button>
        </form>

        <button
          className="absolute top-2 right-2 text-gray-600"
          onClick={onClose}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default RegisterModal;
