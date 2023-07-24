const TaskModel = require("../models/tasks");



const create = async (req, res) => {
    try
    {
        let task = req.body;
        task.userId = req.body.user._id;

        const newTask = new TaskModel(task);
        await newTask.save();

        res.status(201).json({id: newTask._id});
    }
    catch(error)
    {
        return res.status(500).json({message: "Something went wrong"});
    }
}



const get = async (req, res) => {
    try
    {
        const tasks = await TaskModel.find({userId: req.body.user._id}).exec();

        res.status(200).json({tasks: tasks});
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

        const task = await TaskModel.findByIdAndUpdate(id, req.body);
        if(!task)
            return res.status(404);

        return res.status(200).json({});
    }
    catch(error)
    {
        return res.status(500).json({message: "Something went wrong"});
    }
}



const replace = async (req, res) => {
    try
    {
        const {tasks} = req.body;

        await tasks.forEach(task => {
            TaskModel.findByIdAndUpdate(task._id, {index: task.index}).exec();
        });

        return res.status(200).json({});
    }
    catch(err)
    {
        return res.status(500).json({message: "Something went wrong"});
    }
}



const remove = async(req, res) => {
    try
    {
        const {id} = req.params;
        await TaskModel.findByIdAndDelete(id).exec();
        
        res.status(200).json({});
    }
    catch(err)
    {
        return res.status(500).json({message: "Something went wrong"});
    }
}

module.exports = {create, get, edit, replace, remove};