import React, { useState } from "react";
import Header from "../components/Header";
import Sider from "../components/Sider";
import TaskList from "../components/TaskList";
import { DragDropContext } from "react-beautiful-dnd";
import { Divider, Modal } from "antd";
import TaskForm from "../components/TaskForm";
import { useHomeContext } from "../context/HomeContext";
import Loading from "../components/Loading";
import { date } from "../constants/date";
import Planned from "../components/Planned";
import Today from "../components/Today";



const Home = () => {
    const {projects, tasks, taskForm} = useHomeContext();

    const [showSider, setShowSider] = useState(true);
    const handleToggleSider = () => setShowSider(!showSider);

    const [showDone, setShowDone] = useState(false);

    const handleOnDragEnd = result => {
        if(!result.destination) return;

        const {droppableId} = result.destination;

        if(result.type === "projects" && droppableId === "projects")
            projects.swapProjects(result);

        else
        {
            const draggableId = result.draggableId.slice(0, -1);

            if(droppableId === "tasks")
                tasks.swapTasks(result, projects.chosen._id, showDone);

            else if(droppableId === "today")
                tasks.find(task => task._id == draggableId).editTask({date: date()});

            else if(droppableId === "planned")
                tasks.find(task => task._id == draggableId).editTask({date: date(1)});

            else
                tasks.find(task => task._id == draggableId).editTask({projectId: droppableId});
        }
    }

    if(projects.chosen) return(
        <main className="home">
            <Header
                showDone={showDone}
                setShowDone={setShowDone}
                handleToggleSider={handleToggleSider}
            />
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <div className="sider-and-tasks">
                    <Sider
                        showSider={showSider}
                        toggleSider={handleToggleSider}
                    />
                    <div className="home-inner">
                        <div className="task-list">
                            <h1 className="task-list-header">
                                {projects.chosen.name}
                            </h1>

                            <Divider style={{marginTop: "5px"}}/>

                            {(() => {
                                switch(projects.chosen._id)
                                {
                                    case "planned": return <Planned/>;
                                    case "today": return <Today/>;
                                    default: return <TaskList showDone={showDone}/>
                                }
                            })()}
                        </div>
                    </div>
                </div>
            </DragDropContext>
            <Modal
                footer={null}
                closable={false}
                open={taskForm.showForm}
                onCancel={taskForm.handleDisableForm}
                destroyOnClose
            >
                <TaskForm/>
            </Modal>
        </main>
    );

    else return <Loading/>
}

export default Home;