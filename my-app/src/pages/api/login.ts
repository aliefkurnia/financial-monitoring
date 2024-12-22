import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import User from "@/models/UserModel";
import dbConnect from "../../lib/mongodb";
import jwt from "jsonwebtoken";

const JWT_SECRET = "your_secret_key";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  try {
    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login berhasil",
      token,
      userId: user._id,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
}
