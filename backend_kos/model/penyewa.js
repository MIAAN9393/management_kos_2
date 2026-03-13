const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // sesuaikan dengan path koneksi kamu

const Penyewa = sequelize.define("Penyewa", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  pemilik_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  nama: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  no_telpon: {
    type: DataTypes.STRING(20),
    allowNull: true
  },

  status: {
    type: DataTypes.ENUM("aktif", "nonaktif"),
    defaultValue: "aktif"
  },

  dibuat_pada: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }

}, {
  tableName: "penyewa",
  timestamps: false
});

module.exports = Penyewa;
