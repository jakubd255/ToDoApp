import React from "react";
import Task from "./Task";
import NotFound from "./NotFound";
import { Button, Empty, Divider } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useHomeContext } from "../context/HomeContext";
import { Draggable, Droppable } from "react-beautiful-dnd";



const TaskList = ({showDone}) => {
    const {projects, tasks, taskForm} = useHomeContext();

    const handleShowForm = () => taskForm.setShowForm({
        projectId: projects.chosen._id,
        date: ""
    });

    if(projects.chosen === 404) return <NotFound/>;

    else if(tasks && projects.chosen) return(
        <div>
            {!tasks.getTodo(projects.chosen._id) &&
                <Empty
                    className="no-tasks"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="You have nothing to do"
                />
            }

            <Droppable droppableId="tasks" type="tasks">
                {(provided) => (
                    <div 
                        ref={provided.innerRef} 
                        {...provided.droppableProps}
                        className="list-droppable"
                    >
                        {tasks.getFromList(projects.chosen._id, showDone).map((task, index) =>
                            <Draggable
                                draggableId={task._id+index.toString()}
                                index={index}
                            >
                                {(provided, snaphsot) => (
                                    <div
                                        ref={provided.innerRef} 
                                        {...provided.dragHandleProps} 
                                        {...provided.draggableProps}
                                        className="list-draggable"
                                    >
                                        <Task
                                            task={task}
                                            color={projects.chosen.color}
                                            isDragging={snaphsot.isDragging}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

            <Divider/>

            <Button
                type="text"
                onClick={handleShowForm}
                icon={<PlusOutlined/>}
            >
                Add task
            </Button>
        </div>
    );
}

export default TaskList;