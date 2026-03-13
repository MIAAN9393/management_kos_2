const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  nama: {
    type: DataTypes.STRING(100),
    allowNull: false
  },

  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },

  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },

  refresh_token: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  role: {
    type: DataTypes.ENUM("pemilik", "admin"),
    defaultValue: "pemilik"
  },

  status: {
    type: DataTypes.ENUM("aktif", "nonaktif", "diblokir"),
    defaultValue: "aktif"
  },

  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },

  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }

}, {
  tableName: "users",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at"
});

module.exports = User;