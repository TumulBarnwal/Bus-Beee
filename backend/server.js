const app = require("./src/app.js");
const connectDB = require("./src/config/db.js");

connectDB();

app.listen(3000, () => {
    console.log("server is running on port 3000");
});