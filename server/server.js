const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const server = express();

server.use(express.json());
server.use(cors());

const users = require("./routes/users");
const projects = require("./routes/projects");
const tasks = require("./routes/tasks");

server.use("/users", users);
server.use("/projects", projects);
server.use("/tasks", tasks);

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI).then(console.log("Database connected"));

server.get("/", async (req, res) => {
    res.send("Hello world!");
})

const port = process.env.PORT || 8000;
server.listen(port, () => {
    console.log(`Server runs on port ${port}`);
});