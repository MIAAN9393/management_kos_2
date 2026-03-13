const Kos = require("../model/kos")
const sequelize = require("../config/database")
const { throwError } = require("../utils/error")

exports.ambil_kos = async (pemilik_id)=>{
   
    //VALIDASI
    if(!pemilik_id){
        throwError("pemilik tidak ditemukan",401,"UNAUTHORIZED")
    }

    //AMBIL DATA KOS
    const kos = await Kos.findAll({where:{pemilik_id:pemilik_id,status:"aktif"}})

    return kos
}

exports.buat_kos = async (pemilik_id,body)=>{

    const { nama_kos, alamat, deskripsi } = body

    //VALIDASI
    if(!pemilik_id){
        throwError("pemilik tidak ditemukan",401,"UNAUTHORIZED")
    }

    if(!nama_kos || !alamat || !deskripsi){
        throwError("data tidak lengkap",400,"VALIDATION_ERROR")
    }

    const t = await sequelize.transaction()

    //BUAT DATA KOS
    try {
        
        const kos = await Kos.create({
            pemilik_id:pemilik_id,
            nama_kos:nama_kos,
            alamat:alamat,
            deskripsi:deskripsi
        },{transaction:t})

        await t.commit()

        return kos

    } catch (error) {
        await t.rollback()

        throw error

    } 

}

exports.edit_kos = async (pemilik_id,kos_id,body)=>{

    const {nama_kos,alamat,deskripsi} = body
    
    //VALIDASI
    if(!pemilik_id){
        throwError("pemilik tidak ditemukan",401,"UNAUTHORIZED")
    }

    if(!kos_id){
        throwError("kos tidak ditemukan",401,"UNAUTHORIZED")
    }

    if(!nama_kos||!alamat||!deskripsi){
        throwError("data tidak lengkap",400,"VALIDATION_ERROR")
    }

    //AMBIL DATA KOS
    const kos = await Kos.findOne({where:{id:kos_id,pemilik_id:pemilik_id}})

    if(!kos){
        throwError("data kos tidak di temukan atau bukan milik anda",400,"KOS_NOT_FOUND")
    }

    //UPDATE DATA KOS
    await kos.update(body)

    return kos
}

exports.shapus_kos = async (pemilik_id,kos_id)=>{
    
    //VALIDASI
    if(!pemilik_id){
        throwError("pemilik tidak ditemukan",401,"UNAUTHORIZED")
    }

    if(!kos_id){
        throwError("kos tidak ditemukan",401,"UNAUTHORIZED")
    }

    //AMBIL DATA KOS
    const kos = await Kos.findOne({where:{id:kos_id,pemilik_id:pemilik_id,status:"aktif"}})
    
    if(!kos){
        throwError("data kos tidak di temukan atau bukan milik anda",404,"KOS_NOT_FOUND")
    }

    //UPDATE DATA KOS
    await kos.update({status:"nonaktif"})

    return kos
}