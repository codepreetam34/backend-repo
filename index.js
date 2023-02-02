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











app.listen(port, () => {
  console.log("Backend server is running at port", port);
});




























// const express = require("express");
// const mongoose = require("mongoose");
// const path = require("path");
// const config = require("config");
// const dotenv = require("dotenv");
// const productRoute = require("./routes/product");
// const userRoutes = require("./routes/users");
// const firebaseAuthRoutes = require("./routes/firebaseAuth");
// const middleware = require('./middleware/firebaseAuth');

// const cors = require("cors");

// const app = express();
// app.use(express.json());
// app.use(cors());



// // used in production to serve client files

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

// // connecting to mongoDB and then running server on port 4000
// const dbURI = config.get("dbURI");
// console.log("dburi", dbURI);
// const port = process.env.PORT || 5000;
// mongoose
//   .connect(dbURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//   })
//   .then((result) => console.log("DB Connected Successfully"))
//   .catch((err) => console.log(err));

// dotenv.config();
// app.use("/uploads", express.static("uploads"));
// app.use(express.urlencoded({ extended: false }));
// app.use("/api/products", productRoute);
// app.use("/api/users", userRoutes);
// app.use("/api/auth", firebaseAuthRoutes);

// app.use(middleware.decodeToken);





// // const express = require("express");
// // const app  = express();
// // const mongoose = require("mongoose");
// // const dotenv = require("dotenv");
// // const userRoute = require("./routes/user");
// // const productRoute = require("./routes/product");
// // const addtocartRoute = require("./routes/addtocart");
// // const cartRoute = require("./routes/cart");

// // const cors = require("cors");
// // //const uploadImg = multer({ dest: 'uploads/' })
// // const bodyParser = require('body-parser')

// // //const path = require('path');

// // dotenv.config();

// // mongoose.connect(process.env.MONGO_URL)
// // .then(() => console.log("DB Connection Successfull"))
// // .catch((err) => {console.log(err)});

// // // app.get("/api/test", () => {
// // // console.log("test is successfull");
// // // });

// // app.use(cors());
// // app.use(express.json());
// // app.use("/uploads",express.static('uploads'))

// // //app.use(bodyParser.json())
// // //app.use(express.static());
// // //app.use("/api/auth", authRoute);
// // //console.log("paath",upload.path);

// // //app.set('view engine', 'ejs');
// // //app.set('views' , __dirname);

// // app.use("/uploads",express.static('uploads'))
// // app.use(express.urlencoded({extended:false}))

// // app.use("/api/users", userRoute);
// // app.use("/api/products", productRoute);
// // app.use("/api/addtocart", addtocartRoute);
// // app.use("/api/cart", cartRoute);

// app.listen(port, () => {
//   console.log("Backend server is running at port", port);
// });
