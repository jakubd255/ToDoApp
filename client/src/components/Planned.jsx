import React from "react";
import Task from "./Task";
import { Button, Empty, Divider } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { date } from "../constants/date";
import { useHomeContext } from "../context/HomeContext";
import { lists } from "../constants/const";



const Planned = () => {
    const {projects, tasks, taskForm} = useHomeContext();

    const handleShowForm = () => taskForm.setShowForm({
        projectId: "inbox",
        date: date(1)
    });

    return(
        <div>
            {!tasks.getTodo(projects.chosen._id) &&
                <Empty
                    className="no-tasks"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="You have nothing to do"
                />
            }

            <div>
                {tasks.filter(task => task.date > date() && !task.done).map(task => {
                    const list = projects.find(project => project._id === task.projectId) || lists[0];
                    return(
                        <div className="list-draggable">
                            <Task
                                task={task}
                                color={projects.chosen.color}
                                list={list}
                            />
                        </div>
                    )}
                )}
            </div>

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

export default Planned;