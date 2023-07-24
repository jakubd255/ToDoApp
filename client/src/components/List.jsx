import React from "react";
import Icon from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Dropdown } from "antd";
import { Droppable } from "react-beautiful-dnd";
import { useHomeContext } from "../context/HomeContext";



const List = ({list, isChosen, toDo, isDragging, toggleSider}) => {
    const {projectForm} = useHomeContext();
    
    const link = list.special ? "/home/"+list._id : "/home/projects/"+list._id;

    const menu = {
        items: [
            {
                key: "3",
                label: "Edit",
                icon: <Icon component={() => <i className="bi bi-pencil-square"/>}/>
                
            },
            {
                key: "4",
                label : "Delete",
                icon: <Icon component={() => <i className="bi bi-trash"/>}/>,
                danger: true
            }
        ],
        onClick: e => {
            switch(e.key)
            {
                case "3": projectForm.setShowForm(list); break;
                case "4": list.deleteProject(); break;
            }
        }
    }

    const handleDisableSider = () => {
        if(window.innerWidth < 650) toggleSider();
    }

    const getClass = (isChosen, isDragging, isDraggingOver = false) => {
        if(isDraggingOver)
            return "list list-draggingOver";
        else if(isDragging)
            return "list list-dragging";
        else if(isChosen)
            return "list list-chosen";
        else 
            return "list";
    }

    return(
        <Droppable droppableId={list._id} type="tasks">
            {(provided, snaphsot) => (
                <div
                    ref={provided.innerRef} 
                    {...provided.droppableProps}
                >
                    <Dropdown
                        menu={menu}
                        disabled={["inbox", "today", "planned"].includes(list._id)}
                        trigger={["contextMenu"]}
                    >
                        <Link
                            className={getClass(isChosen, isDragging, snaphsot.isDraggingOver)}
                            onClick={handleDisableSider}
                            to={link}
                        >
                            <div className="list-name">
                                <i
                                    className={list.icon || "bi bi-record-fill"}
                                    style={{color: list.color}}
                                />
                                <span>
                                    {list.name}
                                </span>
                            </div>
                            <span>
                                {toDo}
                            </span>
                        </Link>
                    </Dropdown>
                </div>
            )}
        </Droppable>
    );
}

export default List;