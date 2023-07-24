const mongoose = require("mongoose");

const TasksSchema = new mongoose.Schema({
    text: {type: String, required: true},
    note: {type: String, required: false},
    link: {type: String, required: false},
    done: {type: Boolean, required: true},
    date: {type: String, required: false},
    //hour: {type: String, required: false},
    userId: {type: mongoose.Schema.ObjectId, ref: "users", required: true},
    projectId: {type:mongoose.Schema.Types.Mixed, ref: "projects", required: false},
    index: {type: Number, required: false}
})

const TaskModel = mongoose.model("tasks", TasksSchema);
module.exports = TaskModel;