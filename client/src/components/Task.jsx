import React from "react";
import { Checkbox, ConfigProvider, Dropdown, Space} from "antd";
import Icon from "@ant-design/icons";
import { date } from "../constants/date";
import { useHomeContext } from "../context/HomeContext";



const Task = ({task, color, isDragging, today = false, list}) => {
    const {taskForm} = useHomeContext();

    const checkboxTheme = {
        token: {
            colorPrimary: color,
            colorPrimaryHover: color,
            motionDurationSlow: "0s",
            motionDurationFast: "0s",
            motionDurationMid: "0s"
        }
    };

    const menu = {
        items: [
            {
                key: "3",
                label: "Today",
                icon: <Icon component={() => <i className="bi bi-calendar-event"/>}/>,
                disabled: task.date === date()
            },
            {
                key: "4",
                label: "Tomorrow",
                icon: <Icon component={() => <i className="bi bi-sun"/>}/>,
                disabled: task.date === date(1)
            },
            {
                key: "5",
                label: "Next week",
                icon: <Icon component={() => <i className="bi bi-calendar-week"/>}/>,
                disabled: task.date === date(7)
            },
            {
                key: "6",
                label: "No date",
                icon: <Icon component={() => <i className="bi bi-slash-circle"/>}/>,
                disabled: task.date === ""
            },
            {type: "divider"},
            {
                key: "7",
                label: "Edit",
                icon: <Icon component={() => <i className="bi bi-pencil-square"/>}/>
            },
            {
                key: "8",
                label: "Delete",
                icon: <Icon component={() => <i className="bi bi-trash"/>}/>,
                danger: true
            },
        ],
        onClick: e => {
            switch(e.key)
            {
                case "3": task.editTask({date: date()}); break;
                case "4": task.editTask({date: date(1)}); break;
                case "5": task.editTask({date: date(7)}); break;
                case "6": task.editTask({date: ""}); break;
                case "7": taskForm.setShowForm(task); break;
                case "8": task.deleteTask(); break;
            }
        }
    }

    const formatDate = () => {
        switch(task.date)
        {
            case date(-1): return "Yesterday";
            case date(): return "Today";
            case date(1): return "Tomorrow";
            default: return task.date;
        }
    }

    return(
        <Dropdown menu={menu} trigger={["contextMenu"]}>
            <div className={isDragging ? "task task-dragging" : "task"}>
                <div>
                    <ConfigProvider theme={checkboxTheme}>
                        <Checkbox
                            checked={task.done}
                            onClick={task.toggleTaskDone}
                        />
                    </ConfigProvider>
                </div>
                
                <div className="task-details">
                    <div className="task-text-list">
                        <span>
                            {task.text}
                        </span>

                        {list &&
                            <Space size={5}>
                                <span>
                                    {list.name}
                                </span>
                                <i
                                    className={list.icon || "bi bi-record-fill"}
                                    style={{color: list.color, fontSize: list.icon && "12px"}}
                                />
                            </Space>
                        }
                    </div>
                    
                    {task.note && 
                        <span className="task-note">
                            {task.note}
                        </span>
                    }

                    {task.link &&
                        <div>
                            <a href={task.link} target="_blank">
                                {task.link}
                            </a>
                        </div>
                    }

                    {(task.date && !today) && 
                        <span style={{color: task.date < date() ? "red" : "black"}}>
                            {formatDate()}
                        </span>
                    }
                </div>
            </div>
        </Dropdown>
    );
}

export default Task;