const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Kontrak = sequelize.define("Kontrak", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  penyewa_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  kamar_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  tanggal_mulai: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  tanggal_selesai: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },

  harga_sewa: {
    type: DataTypes.BIGINT,
    allowNull: false
  },

  siklus: {
    type: DataTypes.ENUM("bulanan", "mingguan", "harian"),
    defaultValue: "bulanan"
  },

  status: {
    type: DataTypes.ENUM("aktif", "selesai", "dibatalkan"),
    defaultValue: "aktif"
  },

  dibuat_pada: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },

  diperbarui_pada: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }

}, {
  tableName: "kontrak",
  timestamps: false
});

module.exports = Kontrak;