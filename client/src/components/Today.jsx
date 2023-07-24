import React from "react";
import Task from "./Task";
import { Button, Empty, Divider } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { date } from "../constants/date";
import { useHomeContext } from "../context/HomeContext";
import { lists } from "../constants/const";



const Today = () => {
    const {projects, tasks, taskForm} = useHomeContext();

    const overdue = tasks.filter(task => task.date && task.date < date(0) && !task.done);
    const today = tasks.filter(task => task.date === date(0) && !task.done);

    const handleShowForm = () => taskForm.setShowForm({
        projectId: "inbox",
        date: date()
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

            {overdue.map(task => {
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
            
            {overdue.length !== 0 && 
                <Divider/>
            }

            {today.map(task => {
                const list = projects.find(project => project._id === task.projectId) || lists[0];
                return(
                    <div className="list-draggable">
                        <Task
                            task={task}
                            color={projects.chosen.color}
                            list={list}
                            today
                        />
                    </div>
                )}
            )}

            {(today.length !== 0 || (today.length === 0 && overdue.length === 0)) && 
                <Divider/>
            }

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

export default Today;