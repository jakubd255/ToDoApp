import { useState, useContext, createContext } from "react";
import useProjects from "../hooks/useProjects";
import useTasks from "../hooks/useTasks";
import Home from "../pages/Home";



const Context = createContext();

export const useHomeContext = () => useContext(Context);



const HomeProvider = () => {
    const projects = useProjects();
    const tasks = useTasks();

    const [projectForm, setProjectForm] = useState(false);
    const [taskForm, setTaskForm] = useState(false);

    const contextValue = {
        projects: projects,
        tasks: tasks,
        projectForm: {
            showForm: projectForm,
            setShowForm: setProjectForm,
            handleOpenForm: () => setProjectForm(true),
            handleDisableForm: () => setProjectForm(false)
        },
        taskForm: {
            showForm: taskForm,
            setShowForm: setTaskForm,
            handleDisableForm: () => setTaskForm(false)
        },
    }

    return(
        <Context.Provider value={contextValue}>
            <Home/>
        </Context.Provider>
    );
}

export default HomeProvider;