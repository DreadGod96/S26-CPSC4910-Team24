import bcrypt from 'bcrypt';
import { findUser } from '../models/login_model.js';
import { add_user } from '../../../../../shared/lib/storedProcedures.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUser(email);

    if (!user) {
      return res.status(401).json({ error: "Invalid email and/or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email and/or password." });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.user_ID,
        email: user.user_email,
        role: user.user_role
      }
    });

  }catch (err) {
    console.error("Login Controller Error:", err.message);
    res.status(500).json({ 
        error: "Internal server error.",
        details: err.message
    });
  }
};

export const register = async (req, res) => {
  const { username, password, first_name, last_name, role, phone, email, company_ID } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user_ID = await add_user(
      username,
      hashedPassword,
      first_name,
      last_name,
      role,
      phone,
      email,
      company_ID
    );

    res.status(201).json({
      message: "User registered successfully",
      user_ID
    });
  } catch (err) {
    console.error("Registration Controller Error:", err.message);
    res.status(500).json({ error: "Failed to create account." });
  }
};

  
