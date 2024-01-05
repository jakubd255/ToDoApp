const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/users");
const TaskModel = require("../models/tasks");
const ProjectModel = require("../models/projects");



//Register new user
const register = async (req, res) => {
    try
    {
        const user = req.body;

        const userTaken = await UserModel.findOne({email: req.body.email}).exec();
        if(userTaken)
            return res.status(409).json({taken: true});

        else
        {
            const {password} = user;

            //Hash password
            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(password, salt);
            user.password = hash;

            const newUser = new UserModel(user);
            await newUser.save();

            //Create JSON Web Token
            const payload = {_id: newUser._id, email: newUser.email};
            const token = jwt.sign({payload}, process.env.ACCESS_TOKEN);
            return res.status(201).json({token: token});
        }
    }
    catch(error)
    {
        return res.status(500).json({message: "Something went wrong"});
    }
}



//Log in to your account
const login = async (req, res) => {
    try
    {
        const {email, password} = req.body;

        const user = await UserModel.findOne({email: email}).exec();
        if(!user) 
            return res.status(403).json({invalid: true});

        const hash = user.password;
        const isCorrect = bcrypt.compareSync(password, hash);

        if(isCorrect)
        {
            const payload = user;
            const token = jwt.sign({payload}, process.env.ACCESS_TOKEN);

            return res.status(200).json({token: token});
        }
        else
            return res.status(403).json({invalid: true});
    }
    catch(error)
    {
        return res.status(500).json({message: "Something went wrong"});
    }
}



//Get your date by token
const getData = async (req, res) => {
    try
    {
        const projects = await ProjectModel.find({userId: req.body.user._id}).exec();
        const tasks = await TaskModel.find({userId: req.body.user._id}).exec();

        projects.sort((p1, p2) => p1.index - p2.index);
        tasks.sort((t1, t2) => t1.index - t2.index);

        res.status(200).json({
            user: req.body.user,
            projects: projects,
            tasks: tasks
        });
    }
    catch(error)
    {
        return res.status(500).json({message: "Something went wrong"});
    }
}




//Update your e-mail adress
const updateEmail = async (req, res) => {
    try
    {
        const {user, email} = req.body;

        const emailTaken = await UserModel.findOne({email: email}).exec();
        if(emailTaken)
            return res.status(403).json({taken: true});

        await UserModel.findByIdAndUpdate(user._id, {email: email}).exec();
        
        const payload = {_id: user._id, email: email};
        const token = jwt.sign({payload}, process.env.ACCESS_TOKEN);
        return res.status(200).json({token: token});
    }
    catch(error)
    {
        return res.status(500).json({message: "Something went wrong"});
    }
}



//Update your password
const updatePassword = async (req, res) => {
    try
    {
        const {user, actualPassword, newPassword} = req.body;

        const hash = (await UserModel.findById(user._id).exec()).password;
        const isCorrect = bcrypt.compareSync(actualPassword, hash);

        if(isCorrect)
        {
            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const newHash = bcrypt.hashSync(newPassword, salt);
            await UserModel.findByIdAndUpdate(user._id, {password: newHash}).exec();

            return res.status(200);
        }
        else return res.status(403).json({invalid: true});
    }
    catch(error)
    {
        return res.status(500).json({message: "Something went wrong"});
    }
}



//Delete your account
const deleteUser = async (req, res) => {
    try
    {
        const {user, password} = req.body;

        const hash = (await UserModel.findById(user._id).exec()).password;
        const isCorrect = bcrypt.compareSync(password, hash);

        if(isCorrect)
        {
            await UserModel.findByIdAndDelete(user._id).exec();
            res.status(200);
        }
        else res.status(403).json({invalid: true});
    }
    catch(error)
    {
        return res.status(500).json({message: "Something went wrong"});
    }
}

module.exports = {login, register, getData, updateEmail, updatePassword, deleteUser};