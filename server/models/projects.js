const mongoose = require("mongoose");

const ProjectsSchema = new mongoose.Schema({
    name: {type: String, required: true},
    color: {type: String, required: true},
    userId: {type: mongoose.Schema.ObjectId, ref: "users", required: true},
    index: {type: Number, required: false}
});

const ProjectModel = mongoose.model("projects", ProjectsSchema);
module.exports = ProjectModel;