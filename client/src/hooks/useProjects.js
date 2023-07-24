import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { lists } from "../constants/const";
import server from "../constants/server";



const useProjects = () => {
    const [projects, setProjects] = useState([]);
    const [chosen, setChosen] = useState(null);
    const [loaded, setLoaded] = useState(false);

    const navigate = useNavigate();
    const {list, projectId} = useParams();
    const [cookies] = useCookies("token");
    const header = {headers: {"authorization": "Bearer "+cookies.token}};

    const editProjectRef = useRef();
    const deleteProjectRef = useRef();


    const swapProjects = result => {
        const [draggedItem] = projects.splice(result.source.index, 1);
        projects.splice(result.destination.index, 0, draggedItem);

        projects.forEach((project, index) => project.index = index);
        setProjects(projects);

        const projectsReq = projects.map(project => ({_id: project._id, index: project.index}));
        server.put("/projects/replace", {projects: projectsReq});
    }


    const addProject = project => {
        const index = projects.length > 0 ? projects[projects.length-1].index + 1 : 0;
        project.index = index;

        server.post("/projects", project, header).then(response => {
            project._id = response.data.id;
            project.editProject = toEdit => editProjectRef.current(project._id, toEdit);
            project.deleteProject = () => deleteProjectRef.current(project._id);

            setProjects([...projects, project]);
            navigate("/home/projects/"+response.data.id);
        });
    }


    const editProject = (id, toEdit) => {
        const newArr = projects.map(project => {
            if(project._id === id)
                project = {...project, ...toEdit}
            return project;
        });
        
        setProjects(newArr);
        server.put("/projects/"+id, toEdit, header);
    }


    const deleteProject = id => {
        const newArr = projects.filter(project => project._id !== id);

        setProjects(newArr);
        server.delete("/projects/"+id, header);

        if(id === chosen._id)
        {
            if(projects.length <= 1)
                navigate("/home/today");
            else
            {
                const index = projects.findIndex(project => project._id == id);
                if(index === 0)
                    navigate("/home/projects/"+projects[index+1]._id);
                else
                    navigate("/home/projects/"+projects[index-1]._id);
            }
        }
    }


    useEffect(() => {
        editProjectRef.current = editProject;
        deleteProjectRef.current = deleteProject;
    });


    useEffect(() => {
        server.get("/projects", header).then(response => {
            setProjects(response.data.projects.sort((a, b) => a.index - b.index).map(project => {
                project.editProject = toEdit => editProjectRef.current(project._id, toEdit);
                project.deleteProject = () => deleteProjectRef.current(project._id);

                return project;
            }));
            setLoaded(true);
        });
    }, []);


    useEffect(() => {
        if(loaded)
        {
            if(projectId)
            {
                const project = projects.find(project => project._id === projectId);
                if(!project)
                {
                    setChosen(404);
                    document.title = "ToDo - Not found";
                }
                else
                {
                    setChosen(project);
                    document.title = "ToDo : "+project.name;
                }
            }
            else
            {
                if(["inbox", "today", "planned"].includes(list))
                {
                    setChosen(lists.find(l => l._id === list));
                    document.title = "ToDo : "+lists.find(l => l._id === list).name;
                }
                else
                {
                    setChosen(404);
                    document.title = "ToDo - Not found";
                }
            }
        }
    }, [list, projectId, projects]);


    const getClass = (isDraggingOver, isDragging, isChosen) => {
        const chosenClass =  isChosen ? "list list-chosen" : "list";
        const draggingClass = isDragging ? "list list-dragging" : chosenClass;
        const draggingOverClass = isDraggingOver ? "list list-draggingOver" : draggingClass;

        return draggingOverClass;
    }
    
    

    projects.swapProjects = swapProjects;
    projects.addProject = addProject;
    projects.getClass = getClass;
    projects.chosen = chosen;

    return projects;
}

export default useProjects;