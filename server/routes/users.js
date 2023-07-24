const authenticate = require("../middlewares/authenticate");
const express = require("express");
const router = express.Router();
const { login, register, getData, updateEmail, updatePassword, deleteUser } =  require("../controllers/users")



router.post("/login", login);
router.post("/register", register);
router.get("/", authenticate, getData);
router.put("/email", authenticate, updateEmail);
router.put("/password", authenticate, updatePassword);
router.put("/delete", authenticate, deleteUser);

module.exports = router;