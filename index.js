const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const { connectDB } = require("./config/db");
const {
  notFound,
  errorHandler,
} = require("./common-middleware/errorMiddleware");

const cors = require("cors");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin/auth");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const homepageBannerRoutes = require("./routes/homepageBanner");
const Slider = require("./routes/Slider");
const initialDataRoutes = require("./routes/admin/initialData");
const pageRoutes = require("./routes/admin/page");
const addressRoutes = require("./routes/address");
const orderRoutes = require("./routes/order");
const adminOrderRoute = require("./routes/admin/order.routes");
const tagsRoute = require("./routes/tags");
const couponRoute = require("./routes/coupon");
const paymentRoute = require("./routes/payment");
const homepageCarousel = require("./routes/homepageCarousel");
const homepageCategorySlider = require("./routes/homepageCategorySlider");
const homepageTwoBanner = require("./routes/homepageTwoBanner");
const homepageShopByOccasion = require("./routes/homepageShopByOccasion");
const homepagePamperZone = require("./routes/homepagePamperZone");
const users = require("./routes/user");
const vendor = require("./routes/vendor");

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: false }));

const welcomeMessage =
  "<h1 style='color: #801317;display:flex;justify-content:center; padding-top:30px';>Welcome to Vibezter Backend! <br/> Author - Preetam Kr.</h1>";

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
app.use("/api", tagsRoute);
app.use("/api", couponRoute);
app.use("/api", paymentRoute);
app.use("/api", homepageCarousel);
app.use("/api", homepageCategorySlider);
app.use("/api", homepageTwoBanner);
app.use("/api", homepageShopByOccasion);
app.use("/api", homepagePamperZone);
app.use("/api", users);
app.use("/api", vendor);

app.get("/", (req, res) => {
  res.send(welcomeMessage);
});

app.get("/api", (req, res) => {
  res.send(welcomeMessage);
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log("Backend server is running at port", port);
});

// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

// // Passport configuration
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: 'YOUR_GOOGLE_CLIENT_ID',
//       clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
//       callbackURL: 'http://localhost:3000/auth/google/callback',
//     },
//     (accessToken, refreshToken, profile, done) => {
//       // You can handle user data here
//       return done(null, profile);
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((obj, done) => {
//   done(null, obj);
// });

// // Express middleware
// app.use(require('express-session')({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
// app.use(passport.initialize());
// app.use(passport.session());

// // Routes
// app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/' }),
//   (req, res) => {
//     res.redirect('/');
//   }
// );
