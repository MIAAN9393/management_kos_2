
const User = require("./user")
const Kos = require("./kos")
const Kamar = require("./kamar")
const Penyewa = require("./penyewa")

User.hasMany(Kos,{
    foreignKey:"pemilik_id"
})
Kos.belongsTo(User,{
    foreignKey:"pemilik_id"
})

Kos.hasMany(Kamar,{
    foreignKey:"kos_id"
})
Kamar.belongsTo(Kos,{
    foreignKey:"kos_id"
})

User.hasMany(Penyewa,{
    foreignKey:"pemilik_id"
})
Penyewa.belongsTo(User,{
    foreignKey:"pemilik_id"
})