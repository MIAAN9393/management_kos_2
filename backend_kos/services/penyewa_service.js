const Penyewa = require("../model/penyewa")
const sequelize = require("../config/database")
const { throwError } = require("../utils/error")

exports.ambil_penyewa = async (pemilik_id)=>{
   
    //VALIDASI
    if(!pemilik_id){
        throwError("pemilik tidak ditemukan",401,"UNAUTHORIZED")
    }

    //AMBIL DATA PENYEWA
    const penyewa = await Penyewa.findAll({where:{pemilik_id:pemilik_id,status:"aktif"}})

    return penyewa
}

exports.buat_penyewa = async (pemilik_id,body) => {

    const { nama, no_telpon} = body

    // VALIDASI

    if (!nama || !no_telpon) {
        throwError("data tidak lengkap", 400, "VALIDATION_ERROR")
    }

    // BUAT PENYEWA
    const penyewa = await Penyewa.create({
        pemilik_id:pemilik_id,
        nama,
        no_telpon,
    })

    return penyewa
}

exports.edit_penyewa = async (pemilik_id,penyewa_id,body)=>{

    const {nama,no_telpon} = body
    
    //VALIDASI
    if(!pemilik_id){
        throwError("pemilik tidak ditemukan",401,"UNAUTHORIZED")
    }

    if(!penyewa_id){
        throwError("penyewa tidak ditemukan",401,"UNAUTHORIZED")
    }

    if(!nama||!no_telpon){
        throwError("data tidak lengkap",400,"VALIDATION_ERROR")
    }

    //AMBIL DATA PENYEWA
    const penyewa = await Penyewa.findOne({where:{id:penyewa_id,pemilik_id:pemilik_id,status:"aktif"}})

    if(!penyewa){   
        throwError("data penyewa tidak di temukan atau bukan milik anda",400,"PENYEWA_NOT_FOUND")
    }

    //UPDATE DATA PENYEWA
    await penyewa.update({
        nama,
        no_telpon
    })

    return penyewa
}

exports.shapus_penyewa = async (pemilik_id,penyewa_id)=>{
    
    //VALIDASI
    if(!pemilik_id){
        throwError("pemilik tidak ditemukan",401,"UNAUTHORIZED")
    }

    if(!penyewa_id){
        throwError("penyewa tidak ditemukan",401,"UNAUTHORIZED")
    }

    //AMBIL DATA PENYEWA    
    const penyewa = await Penyewa.findOne({where:{id:penyewa_id,pemilik_id:pemilik_id,status:"aktif"}})

    if(!penyewa){   
        throwError("data penyewa tidak di temukan atau bukan milik anda",400,"PENYEWA_NOT_FOUND")
    }

    //UPDATE DATA PENYEWA
    await penyewa.update({
        status:"nonaktif"
    })

    return penyewa
}
