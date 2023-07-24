const authenticate = require("../middlewares/authenticate");
const express = require("express");
const router = express.Router();
const { create, get, edit, replace, remove } = require("../controllers/projects");



router.post("/", authenticate, create);
router.get("/", authenticate, get);
router.put("/replace", replace);
router.put("/:id", edit);
router.delete("/:id", authenticate, remove);

module.exports = router;