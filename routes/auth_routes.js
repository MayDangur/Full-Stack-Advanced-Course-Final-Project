// routes/auth_routes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User"); // מייבא את המודל התקין שיצרת עכשיו!

// נתיב הרשמה אמיתי ומאובטח
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. בדיקה האם המשתמש כבר קיים במערכת (למניעת כפילויות)
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({ success: false, message: "אימייל זה כבר קיים במערכת" });
        }

        // 2. הצפנת הסיסמה באמצעות bcrypt (דרישת חובה!)
        const salt = await bcrypt.genSalt(12); // 12 סבבי הצפנה לעבודה מאובטחת
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. שמירת המשתמש החדש בבסיס הנתונים (MongoDB)
        const newUser = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        // 4. החזרת תשובה בפורמט אחיד ומאובטח (ללא הסיסמה)
        res.status(201).json({
            success: true,
            message: "המשתמש נרשם בהצלחה!",
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;