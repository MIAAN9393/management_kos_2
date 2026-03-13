const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth_middleware')

const userController = require("../controller/user_controller");

router.get("/cek",authMiddleware.cek_token_and_role(["pemilik"]),(req,res)=>{
    res.status(200).json({
        pesan:"tembus"
    })
})

router.post("/register", userController.register);

router.post("/login", userController.login);

router.post("/refresh_token", userController.refresh_token)

router.put("/logout", userController.logout);

module.exports = router;