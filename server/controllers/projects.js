const ProjectModel = require("../models/projects");
const TaskModel = require("../models/tasks");



const create = async (req, res) => {
    try
    {
        let project = req.body;
        project.userId = req.body.user._id;

        const newProject = new ProjectModel(project);
        await newProject.save();

        res.status(201).json({id: newProject._id});
    }
    catch(error)
    {
        return res.status(500).json({message: "Something went wrong"});
    }
}



const get = async (req, res) => {
    try
    {
        const projects = await ProjectModel.find({userId: req.body.user._id}).exec();

        res.status(200).json({projects: projects});
    }
    catch(error)
    {
        return res.status(500).json({message: "Something went wrong"});
    }
}



const edit = async (req, res) => {
    try
    {
        const {id} = req.params;

        await ProjectModel.findByIdAndUpdate(id, req.body).exec();

        res.status(200).json({});
    }
    catch(error)
    {
        return res.status(500).json({message: "Something went wrong"});
    }
}



const replace = async (req, res) => {
    try
    {
        const {projects} = req.body;

        await projects.forEach(project => {
            ProjectModel.findByIdAndUpdate(project._id, {index: project.index}).exec();
        });

        res.status(200).json({});
    }
    catch(err)
    {
        return res.status(500).json({message: "Something went wrong"});
    }
}



const remove = async (req, res) => {
    try
    {
        const {id} = req.params;
        await ProjectModel.findByIdAndDelete(id).exec();
        await TaskModel.deleteMany({projectId: id}).exec();

        res.status(200).json({});
    }
    catch(err)
    {
        return res.status(500).json({message: "Something went wrong"});
    }
}

module.exports = {create, get, edit, replace, remove};