const Kamar = require("../model/kamar")
const sequelize = require("../config/database")
const { throwError } = require("../utils/error")
const Kos = require("../model/kos")

exports.ambil_kamar = async (pemilik_id, kos_id)=>{
   
    //VALIDASI
    if(!pemilik_id){
        throwError("pemilik tidak ditemukan",401,"UNAUTHORIZED")
    }

    //CEK KEPEMILIKAN
    const kos = await Kos.findOne({where:{id:kos_id,pemilik_id:pemilik_id}})

    if (!kos) {
        throwError("kos tidak ditemukan atau bukan milik anda", 404, "KOS_NOT_FOUND")
    }
    
    //AMBIL DATA KAMAR
    const kamar = await Kamar.findAll({where:{kos_id:kos.id,status:"aktif"}})

    return kamar
}

exports.buat_kamar = async (pemilik_id, kos_id, body) => {

    const { nomor, harga, kapasitas } = body

    // VALIDASI
    if (!pemilik_id) {
        throwError("user tidak terautentikasi", 401, "UNAUTHORIZED")
    }

    if (!kos_id) {
        throwError("kos_id tidak ditemukan", 400, "VALIDATION_ERROR")
    }

    if (!nomor || !harga || !kapasitas) {
        throwError("data tidak lengkap", 400, "VALIDATION_ERROR")
    }

    // CEK KEPEMILIKAN
    const kos = await Kos.findOne({
        where: {
            id: kos_id,
            pemilik_id: pemilik_id
        }
    })

    if (!kos) {
        throwError("kos tidak ditemukan atau bukan milik anda", 404, "KOS_NOT_FOUND")
    }

    // BUAT KAMAR
    const kamar = await Kamar.create({
        kos_id,
        nomor,
        harga,
        kapasitas
    })

    return kamar
}

exports.edit_kamar = async (pemilik_id, kamar_id, body) => {

    const { nomor, harga, kapasitas } = body

    // VALIDASI
    if (!pemilik_id) {
        throwError("user tidak terautentikasi", 401, "UNAUTHORIZED")
    }

    if (!kamar_id) {
        throwError("kamar_id tidak ditemukan", 400, "VALIDATION_ERROR")
    }

    if (!nomor || !harga || !kapasitas) {
        throwError("data tidak lengkap", 400, "VALIDATION_ERROR")
    }

    // AMBIL DATA KAMAR
    const kamar = await Kamar.findByPk(kamar_id)

    if (!kamar) {
        throwError("kamar tidak ditemukan", 404, "KAMAR_NOT_FOUND")
    }

    // CEK KEPEMILIKAN
    const kos = await Kos.findOne({
        where:{
            id:kamar.kos_id,
            pemilik_id:pemilik_id
        }
    })

    if (!kos) {
        throwError("kos tidak ditemukan atau bukan milik anda", 404, "KOS_NOT_FOUND")
    }

    // UPDATE DATA
    await kamar.update({
        nomor,
        harga,
        kapasitas
    })

    return kamar
}

exports.shapus_kamar = async (pemilik_id, kamar_id) => {

    //VALIDASI
    if (!pemilik_id) {
        throwError("user tidak terautentikasi", 401, "UNAUTHORIZED")
    }

    if (!kamar_id) {
        throwError("kamar_id tidak ditemukan", 400, "VALIDATION_ERROR")
    }

    //AMBIL DATA KAMAR
    const kamar = await Kamar.findOne({where:{id:kamar_id,status:"aktif"}})

    if (!kamar) {
        throwError("kamar tidak ditemukan", 404, "KAMAR_NOT_FOUND")
    }

    // CEK KEPEMILIKAN
    const kos = await Kos.findOne({
        where:{
            id:kamar.kos_id,
            pemilik_id:pemilik_id
        }
    })

    if (!kos) {
        throwError("kos tidak ditemukan atau bukan milik anda", 404, "KOS_NOT_FOUND")
    }

    //UPDATE DATA KAMAR
    await kamar.update({

        status:"nonaktif"
    })

    return kamar

}