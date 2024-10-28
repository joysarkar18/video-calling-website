let express = require("express");
let fs = require("fs");
let https = require("https");
let path = require("path");
let favicon = require("serve-favicon");
let stream = require("./ws/stream");
let socketIO = require("socket.io");

// SSL options
const sslOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/server.mgplugins.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/server.mgplugins.com/fullchain.pem')
};

// Create an Express app
let app = express();

// Favicon and static assets
app.use(favicon(path.join(__dirname, "favicon.ico")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Main route to serve HTML
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Create an HTTPS server with SSL certificates
let server = https.createServer(sslOptions, app);

// Attach socket.io to the HTTPS server
let io = socketIO(server);

// Handle WebSocket connection in the "stream" namespace
io.of("/stream").on("connection", stream);

// Start the server
server.listen(3000, () => {
  console.log("Running on port 3000 with SSL");
});