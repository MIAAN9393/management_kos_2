const UserService = require("../services/user_service")

exports.register = async (req,res,next)=>{

    try {
        const data = await UserService.register(req.body)
        
        res.status(200).json({
            success:true,
            code: "REGISTER_SUCCESS",
            pesan:"registrasi berhasil",
            data
        })

    } catch (error) {
        next(error)
    }
}

exports.login = async (req,res,next) => {

    try {
        const token = await UserService.login(req.body)
        
        res.status(200).json({
            success:true,
            code: "LOGIN_SUCCESS",
            pesan:"login berhasil",
            data: token
        })

    } catch (error) {
        next(error)
    }
}

exports.refresh_token = async (req,res,next) => {

    try {
        const data = await UserService.refresh_token(req.body)
        
        res.status(200).json({
            success:true,
            code: "LOGOUT_SUCCESS",
            pesan:"refresh berhasil",
            data
        })

    } catch (error) {
        next(error)
    }
}

exports.logout = async (req,res,next) => {

    try {
        const data = await UserService.logout(req.body)
        
        res.status(200).json({
            success:true,
            code: "LOGOUT_SUCCESS",
            pesan:"logout berhasil",
            data
        })

    } catch (error) {
        next(error)
    }
}