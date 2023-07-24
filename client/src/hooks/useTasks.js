import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import server from "../constants/server";
import { date } from "../constants/date"



const useTasks = () => {
    const [tasks, setTasks] = useState([]);

    const [cookies] = useCookies("token");
    const header = {headers: {"authorization": "Bearer "+cookies.token}};

    const editTaskRef = useRef();
    const toggleTaskDoneRef = useRef();
    const deleteTaskRef = useRef();


    const swapTasks = (result, chosen, showDone) => {
        const list = tasks.getFromList(chosen, showDone);

        const sourceId = list[result.source.index]._id;
        const destId = list[result.destination.index]._id;

        const source = tasks.findIndex(task => task._id === sourceId);
        const dest = tasks.findIndex(task => task._id === destId);

        const [draggedItem] = tasks.splice(source, 1);
        tasks.splice(dest, 0, draggedItem);

        tasks.forEach((task, index) => task.index = index);
        setTasks(tasks);

        const tasksReq = tasks.map(task => ({_id: task._id, index: task.index}));
        server.put("/tasks/replace", {tasks: tasksReq});
    }


    const addTask = task => {
        const index = tasks.length > 0 ? tasks[tasks.length-1].index + 1 : 0;
        task.index = index;

        server.post("/tasks", task, header).then(response => {
            task._id = response.data.id;
            task.editTask = toEdit => editTaskRef.current(task._id, toEdit);
            task.toggleTaskDone = () => toggleTaskDoneRef.current(task._id);
            task.deleteTask = () => deleteTaskRef.current(task._id);

            setTasks([...tasks, task]);
        });
    }


    const editTask = (id, toEdit) => {
        const newArr = tasks.map(task => {
            if(task._id === id)
                task = {...task, ...toEdit};
            return task;
        });
        
        setTasks(newArr);
        server.put("/tasks/"+id, toEdit);
    }


    const toggleTaskDone = (id) => {
        const done = tasks.find(task => task._id === id).done;

        const newArr = tasks.map(task => {
            if(task._id === id)
                task.done = !done;
            return task;
        });

        setTasks(newArr);
        server.put("/tasks/"+id, {done: !done});
    }


    const deleteTask = id => {
        setTasks(tasks.filter(task => task._id !== id));
        server.delete("/tasks/"+id, header);
    }


    const getFromList = (list, showDone = false) => {
        switch(list)
        {
            case "today": return tasks.filter(task => task.date && task.date <= date() && !task.done);
            case "planned": return tasks.filter(task => task.date && task.date > date() && !task.done);
            default: return tasks.filter(task => showDone ? (task.projectId === list) : (task.projectId === list && !task.done));
        }
    }


    const getTodo = list => {
        switch(list)
        {
            case "today": return tasks.filter(task => task.date && task.date <= date() && !task.done).length;
            case "planned": return tasks.filter(task => task.date && task.date > date() && !task.done).length;
            default: return tasks.filter(task => task.projectId === list && !task.done).length;
        }
    }


    useEffect(() => {
        editTaskRef.current = editTask;
        toggleTaskDoneRef.current = toggleTaskDone;
        deleteTaskRef.current = deleteTask;
    });


    useEffect(() => {
        server.get("/tasks", header).then(response => {
            setTasks(response.data.tasks.sort((a, b) => a.index - b.index).map(task => {
                task.editTask = toEdit => editTaskRef.current(task._id, toEdit);
                task.toggleTaskDone = () => toggleTaskDoneRef.current(task._id);
                task.deleteTask = () => deleteTaskRef.current(task._id);

                return task;
            }));
        });
    }, []);



    tasks.swapTasks = swapTasks;
    tasks.addTask = addTask;
    tasks.getTodo = getTodo;
    tasks.getFromList = getFromList;

    return tasks;
}

export default useTasks;