module.exports = (err,req,res,next)=>{

  const status = err.status || 500
  const code = err.code || "INTERNAL_SERVER_ERROR"

  console.error(err.stack)

  res.status(status).json({
    success:false,
    code: code,
    message: err.message || "internal server error"
  })

}