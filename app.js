const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const session = require("express-session"); // Import express-session
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const morgan = require("morgan");
const helmet = require("helmet");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const schoolRoutes = require("./routes/schoolRoutes");
const locationRoutes = require("./routes/locationRoutes");
const disableRoutes = require("./routes/disableRoutes");
const sendResponse = require("./utils/responseHandler"); // Utility function

require("./database/database");

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin:"*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(morgan("dev"));

// Set up express-session
app.use(
  session({
    secret: "your-secret-key", // Replace with your secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set 'secure: true' in production with HTTPS
  })
);

// Passport setup (must be after session setup)
app.use(passport.initialize());
app.use(passport.session()); // Enables session-based authentication

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);
app.use("/product", productRoutes);
app.use("/school", schoolRoutes);
app.use("/location", locationRoutes);
app.use("/disable", disableRoutes);
app.get("/", async (req, res) => {
  return sendResponse(res, 200, true, "Welcome to the Home Page");
});
// Initialize socket.io with the HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // Replace '' with your client URL for better security
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Set up event listeners for socket.io
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Example event listener for receiving messages
  socket.on("message", (msg) => {
    console.log("Message received:", msg);
    // Broadcast the message to all connected clients
    io.emit("message", msg);
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});
// 404 handler
app.use((req, res, next) => {
  return sendResponse(res, 404, false, "Route not found");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  return sendResponse(res, 500, false, "Internal Server Error", {
    error: err.stack,
  });
});

// Start the server
const PORT = process.env.PORT || 3010;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});