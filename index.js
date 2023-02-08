const express = require('express')
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const config = require("config");
//const bodyParser = require('body-parser');
const cors = require("cors");

//routes
const authRoutes = require('./routes/auth')
const adminRoutes = require("./routes/admin/auth")
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const homepageBannerRoutes = require('./routes/homepageBanner')

const Slider = require("./routes/Slider");

const initialDataRoutes = require('./routes/admin/initialData')



const pageRoutes = require("./routes/admin/page");
const addressRoutes = require("./routes/address");
const orderRoutes = require("./routes/order");
const adminOrderRoute = require("./routes/admin/order.routes");






//environment variable or constants
dotenv.config();



// connecting to mongoDB and then running server on port 4000
const dbURI = config.get("dbURI");
const port = process.env.PORT || 5000;
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((result) => console.log("DB Connected Successfully"))
  .catch((err) => console.log(err));



app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: false }));

//app.use("/uploads", express.static("uploads"));
//app.use(express.urlencoded({ extended: true }));


app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", initialDataRoutes);
app.use("/api", pageRoutes);
app.use("/api", addressRoutes);
app.use("/api", orderRoutes);
app.use("/api", adminOrderRoute);


app.use("/api", homepageBannerRoutes);

app.use("/api", Slider);










app.listen(port, () => {
  console.log("Backend server is running at port", port);
});




