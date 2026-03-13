const express = require("express");
require("dotenv").config();
const sequelize = require("./config/database");

const app = express();
app.use(express.json());

// Test route
app.use('/api/user',require("./routes/user_routes"))
app.use('/api/kamar',require("./routes/kamar_routes"))
app.use('/api/kos',require("./routes/kos_routes"))

app.use(require("./middleware/error_middleware"))
// Test koneksi DB
sequelize.authenticate()
  .then(() => {
    console.log("Database connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error("Unable to connect:", err);
  });