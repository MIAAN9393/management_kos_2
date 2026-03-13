const User = require("../model/user")
const Bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {throwError} = require("../utils/error")
const {validasiEmail,validasiNama} = require("../validator/auth_validator")
require("dotenv").config()

exports.register = async (body)=>{
    
    //VALIDASI INPUT
    if(!body.nama||!body.email||!body.password){
        throwError("data tidak lengkap",400,"VALIDATION_ERROR")
    }
    
    if(!validasiEmail(body.email)){
        throwError("email tidak valid",400,"VALIDATION_ERROR")
    }
    
    if(!validasiNama(body.nama)){
        throwError("nama hanya boleh huruf dan spasi",400,"VALIDATION_ERROR")
    }

    const cek_email = await User.findOne({
        where:{email:body.email}
    })

    if(cek_email){
        throwError("email sudah di gunakan",400,"EMAIL_ALREADY_EXIST")
    }

    //HASPASWORD
    const hashpassword = await Bcrypt.hash(body.password,10)
    
    //SIMPAN USER
    const user = await User.create({
        nama:body.nama,
        email:body.email,
        password:hashpassword
    })
    return user 
}

exports.login = async (body) => {
    
    //VALIDASI
    if(!body.email||!body.password){
        throwError("email dan password wajib diisi",400,"VALIDATION_ERROR")
    }
    
    //AMBIL DATA USER
    const user = await User.findOne({
        where:{
            email:body.email
        }
    })

    if(!user){
        throwError("email atau password salah",401,"INVALID_CREDENTIALS")
    }
    
    //CEK HASPASSWORD
    const cocok = await Bcrypt.compare(body.password,user.password)

    if(!cocok){
        throwError("email atau password salah",401,"INVALID_CREDENTIALS")
    }

    //BUAT TOKEN
    const access_token = jwt.sign(
        {id:user.id,email:user.email,role:user.role},
        process.env.JWT_SECRET,{expiresIn:"2d"}
    )

    const refresh_token = jwt.sign(
        {id:user.id},
        process.env.JWT_SECRET,{expiresIn:"7d"}
    )

    //UPDATE DATA USER
    await user.update({refresh_token:refresh_token})
    
    return {
        access_token,
        refresh_token
    }
}

exports.refresh_token = async (body) => {

    const {refresh_token} = body

    //VALIDASI
    if(!refresh_token){
        throwError("refresh token tidak ada",400,"INVALID_CREDENTIAL")
    }

    //CEK REFRESHTOKEN
    try {

        jwt.verify(refresh_token,process.env.JWT_SECRET)

    } catch (error) {
        throwError("refresh token tidak valid silahkan login ulang",401,"INVALID_TOKEN")
    }

    //AMBIL DATA USER
    const user = await User.findOne({where:{refresh_token:refresh_token}})

    if(!user){
        throwError("refresh token tidak valid",401,"INVALID_TOKEN")
    }

    //BUAT TOKEN
    const access_token = jwt.sign({id:user.id,email:user.email,role:user.role},process.env.JWT_SECRET,{"expiresIn":"2d"})
    const new_refresh_token = jwt.sign({id:user.id},process.env.JWT_SECRET,{"expiresIn":"7d"})

    //UPDATE DATA USER
    await user.update({refresh_token:new_refresh_token})

    return {
        access_token:access_token,
        refresh_token:new_refresh_token
    }

}

exports.logout = async (body) => {
    
    const {refresh_token} = body

    //VALIDASI
    if(!refresh_token){
        throwError("user belum di tentukan",400,"INVALID_CREDENTIAL")
    }

    //AMBIL DATA USER
    const user = await User.findOne({where:{refresh_token:refresh_token}})

    if(!user){
        throwError("user tidak valid",401,"INVALID_CREDENTIALS")
    }

    //UPDATE DATA USER
    await user.update({refresh_token:null})

    return user
}