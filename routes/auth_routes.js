// routes/auth_routes.js
const express = require("express");
const router = express.Router();

// נתיב זמני לבדיקת הרשמה
router.post("/register", (req, res) => {
    console.log(req.body);
    res.send("הבקשה הגיעה לשרת! בשלב הבא נצפין ונשמור בבסיס הנתונים");
});

module.exports = router;