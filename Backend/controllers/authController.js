import bcrypt from "bcrypt";
import { createUser,findUserByEmail} from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";

export const register = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password
    } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const profile_image = null;
    const is_active = 1;
    const created_at = new Date();
    const updated_at = new Date();

    const result = await createUser(
      full_name,
      email,
      hashedPassword,
      profile_image,
      is_active,
      created_at,
      updated_at
    );

    res.status(201).json({
      message: "User registered successfully",
      result
    });

  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // 2. Check password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // 3. Generate JWT
    const token = generateToken(user);

    // 4. Send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
};