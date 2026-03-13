const PenyewaService = require("../services/penyewa_service");

exports.ambil_penyewa = async (req,res,next) => {

  const pemilik_id = req.user.id

    try {
        
        const data = await PenyewaService.ambil_penyewa(pemilik_id)

        res.status(200).json({
            success:true,
            code: "PENYEWA_LIST_SUCCESS",
            pesan: "ini daftar penyewa kamu",
            data
        })

    } catch (error) {
        next(error)
    }
}

exports.buat_penyewa = async (req,res,next) => {

  const pemilik_id = req.user.id
  const body = req.body

  try {
    
    const data = await PenyewaService.buat_penyewa(pemilik_id,body)

        res.status(200).json({
            success:true,
            code: "PENYEWA_CREATED",
            pesan:"penyewa berhasil di buat",
            data
        })
    
  } catch (error) {
    next(error)
  }

}

exports.edit_penyewa = async (req,res,next) => {

  const pemilik_id = req.user.id
  const penyewa_id = req.params.id
  const body = req.body

    try {

        const data = await PenyewaService.edit_penyewa(pemilik_id,penyewa_id,body)

        res.status(200).json({
            success:true,
            code: "PENYEWA_UPDATED",
            pesan:"penyewa berhasil di update",
            data
        })

    } catch (error) {
        next(error)
    }
}

exports.shapus_penyewa = async (req,res,next) => {

  const pemilik_id = req.user.id
  const penyewa_id = req.params.id

    try {

        const data = await PenyewaService.shapus_penyewa(pemilik_id,penyewa_id)

        res.status(200).json({
            success:true,
            code: "PENYEWA_DELETED",
            pesan:"penyewa berhasil di hapus",
            data
        })

    } catch (error) {
        next(error)
    }
}
