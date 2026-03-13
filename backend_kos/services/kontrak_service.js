const Penyewa = require("../model/penyewa")
const sequelize = require("../config/database")
const { Op } = require("sequelize")
const { throwError } = require("../utils/error")
const Kos = require("../model/kos")
const Kamar = require("../model/kamar")
const Kontrak = require("../model/kontrak")

exports.buat_kontrak = async (pemilik_id,body) => {
    const { 
        penyewa_id, 
        kamar_id, 
        tanggal_mulai, 
        tanggal_selesai, 
        harga_sewa, 
        siklus } = body

    // VALIDASI
    if (!kamar_id) {
        throwError("kamar_id tidak ditemukan", 400, "VALIDATION_ERROR")
    }

    if (!penyewa_id) {
        throwError("penyewa_id tidak ditemukan", 400, "VALIDATION_ERROR")
    }

    if (!tanggal_mulai || !tanggal_selesai || !harga_sewa || !siklus) {
        throwError("data tidak lengkap", 400, "VALIDATION_ERROR")
    }

    const mulai = new Date(tanggal_mulai)
    const selesai = new Date(tanggal_selesai)
    const harga = Number(harga_sewa)

    if(isNaN(harga) || harga <= 0){
        throwError("format harga sewa tidak valid", 400, "VALIDATION_ERROR")
    }

    if(isNaN(mulai.getTime())||isNaN(selesai.getTime())){
        throwError("format tanggal tidak valid", 400, "VALIDATION_ERROR")
    }

    if (selesai <= mulai) {
        throwError("tanggal selesai harus setelah tanggal mulai", 400, "VALIDATION_ERROR")
    }

    const siklusValid = ["bulanan","mingguan","harian"]

    if(!siklusValid.includes(siklus)){
        throwError("siklus tidak valid",400,"VALIDATION_ERROR")
    }

    //CEK KEPEMILIKAN
    const t = await sequelize.transaction()

    const kamar = await Kamar.findOne({where:{
        id:kamar_id,
        status:"aktif",
    },transaction:t,lock:t.LOCK.UPDATE})

    if (!kamar) {
        await t.rollback()
        throwError("kamar tidak ditemukan atau bukan milik anda", 400, "VALIDATION_ERROR")
    }

    const kos = await Kos.findOne({where:{
        id:kamar.kos_id,
        pemilik_id:pemilik_id,
        status:"aktif"
    },transaction:t})

    if (!kos) {
        await t.rollback()
        throwError("kos tidak ditemukan atau bukan milik anda", 400, "VALIDATION_ERROR")
    }

    const kontrakAktif = await Kontrak.findOne({
        where:{
            kamar_id:kamar_id,
            status:"aktif"
        },transaction:t
    })

    if(kontrakAktif){
        await t.rollback()
        throwError("kamar sedang dikontrak",400,"KAMAR_SUDAH_TERISI")
    }

    const penyewa = await Penyewa.findOne({where:{
        id:penyewa_id,
        pemilik_id:pemilik_id,
        status:"aktif"
    },transaction:t})

    if (!penyewa) {
        await t.rollback()
        throwError("penyewa tidak ditemukan atau bukan milik anda", 400, "VALIDATION_ERROR")
    }

    //BUAT DATA KONTRAK
    // const t = await sequelize.transaction()

    try {
        const kontrak = await Kontrak.create({
        penyewa_id, 
        kamar_id, 
        tanggal_mulai, 
        tanggal_selesai, 
        harga_sewa:harga, 
        siklus
    },{transaction:t})

    await kamar.update({

        status: "terisi"

    },{transaction:t})

    await t.commit()

        return kontrak

    } catch (error) {
        await t.rollback()
        throw error
    }

}

exports.edit_kontrak = async (pemilik_id,kontrak_id,body) => {

        const { 
        penyewa_id, 
        kamar_id, 
        tanggal_mulai, 
        tanggal_selesai, 
        harga_sewa, 
        siklus } = body

    // VALIDASI
    if (!kamar_id) {
        throwError("kamar_id tidak ditemukan", 400, "VALIDATION_ERROR")
    }

    if (!penyewa_id) {
        throwError("penyewa_id tidak ditemukan", 400, "VALIDATION_ERROR")
    }

    if (!tanggal_mulai || !tanggal_selesai || !harga_sewa || !siklus) {
        throwError("data tidak lengkap", 400, "VALIDATION_ERROR")
    }

    const mulai = new Date(tanggal_mulai)
    const selesai = new Date(tanggal_selesai)
    const harga = Number(harga_sewa)

    if(isNaN(harga) || harga <= 0){
        throwError("format harga sewa tidak valid", 400, "VALIDATION_ERROR")
    }

    if(isNaN(mulai.getTime())||isNaN(selesai.getTime())){
        throwError("format tanggal tidak valid", 400, "VALIDATION_ERROR")
    }

    if (selesai <= mulai) {
        throwError("tanggal selesai harus setelah tanggal mulai", 400, "VALIDATION_ERROR")
    }

    const siklusValid = ["bulanan","mingguan","harian"]

    if(!siklusValid.includes(siklus)){
        throwError("siklus tidak valid",400,"VALIDATION_ERROR")
    }

    //CEK KEPEMILIKAN

    const t = await sequelize.transaction()

    try {

            const kamar = await Kamar.findOne({
        where:{
            id:kamar_id,
            status:"aktif"
        },transaction:t
    })

    if (!kamar) {
        throwError("kamar tidak ditemukan atau bukan milik anda", 400, "VALIDATION_ERROR")
    }

    const kos = await Kos.findOne({
        where:{
            id:kamar.kos_id,
            pemilik_id:pemilik_id,
            status:"aktif"
        },transaction:t
    })

    if (!kos) {
        throwError("kos tidak ditemukan atau bukan milik anda", 400, "VALIDATION_ERROR")
    }

    const penyewa = await Penyewa.findOne({
        where:{
            id:penyewa_id,
            pemilik_id:pemilik_id
        },transaction:t
    })

    if (!penyewa) {
        throwError("penyewa tidak ditemukan atau bukan milik anda", 400, "VALIDATION_ERROR")
    }

    const kontrak = await Kontrak.findOne({
        where:{
            id:kontrak_id,
            status:"aktif",
        },transaction:t,lock:true
    })

    if (!kontrak) {
    throwError("kontrak tidak ditemukan", 404, "NOT_FOUND")
    }

    const konflik = await Kontrak.findOne({
    where:{
        kamar_id:kamar_id,
        status:"aktif",
        id:{ [Op.ne]: kontrak_id },
        tanggal_mulai:{ [Op.lte]: tanggal_selesai },
        tanggal_selesai:{ [Op.gte]: tanggal_mulai }
    },transaction:t
    })
    
    if(konflik){
        throwError("periode kontrak bertabrakan", 400, "VALIDATION_ERROR")
    }

    await kontrak.update({
        penyewa_id, 
        kamar_id, 
        tanggal_mulai, 
        tanggal_selesai, 
        harga_sewa, 
        siklus
    },{transaction:t})

    await t.commit()

    return kontrak
        
    } catch (error) {
        await t.rollback()
        throw error
    }
}

exports.batalkan_kontrak = async (pemilik_id, kontrak_id) => {

    // VALIDASI
    if (!kontrak_id) {
        throwError("kontrak_id tidak ditemukan", 400, "VALIDATION_ERROR")
    }

    // MULAI TRANSAKSI
    const t = await sequelize.transaction()

    try {

        // AMBIL KONTRAK + LOCK ROW
        const kontrak = await Kontrak.findOne({
            where:{
                id:kontrak_id,
                status:"aktif"
            },
            transaction:t,
            lock:true
        })

        if (!kontrak) {
            throwError("kontrak tidak ditemukan",404,"NOT_FOUND")
        }

        // CEK KAMAR TERKAIT
        const kamar = await Kamar.findOne({
            where:{
                id:kontrak.kamar_id,
                status:"aktif"
            },
            transaction:t
        })

        if (!kamar) {
            throwError("kamar tidak ditemukan",404,"NOT_FOUND")
        }

        // CEK KEPEMILIKAN KOS
        const kos = await Kos.findOne({
            where:{
                id:kamar.kos_id,
                pemilik_id:pemilik_id,
                status:"aktif"
            },
            transaction:t
        })

        if (!kos) {
            throwError("kos tidak ditemukan atau bukan milik anda",403,"FORBIDDEN")
        }

        // UPDATE STATUS KONTRAK MENJADI DIBATALKAN
        await kontrak.update({
            status:"dibatalkan"
        },{transaction:t})

        // COMMIT TRANSAKSI
        await t.commit()

        return kontrak

    } catch (error) {

        // JIKA TERJADI ERROR MAKA ROLLBACK
        await t.rollback()
        throw error

    }
}