import React from "react";
import List from "./List";
import ProjectForm from "./ProjectForm";
import { Divider, Button, Modal } from "antd";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { PlusOutlined } from "@ant-design/icons";
import { useHomeContext } from "../context/HomeContext";
import { lists } from "../constants/const";



const Sider = ({showSider, toggleSider}) => {
    const {projects, tasks, projectForm} = useHomeContext();

    if(showSider) return(
        <aside className="sider">
            <nav>
                {lists.map((list) => 
                    <div className="list-draggable">
                        <List
                            list={list}
                            isChosen={list._id === projects.chosen._id}
                            toDo={tasks.getTodo(list._id)}
                            toggleSider={toggleSider}
                        />
                    </div>
                )}
            </nav>

            <Divider/>

            <nav>
                <Droppable droppableId="projects" type="projects">
                    {(provided) => (
                        <div 
                            ref={provided.innerRef} 
                            {...provided.droppableProps}
                        >
                            {projects.map((project, index) => 
                                <Draggable
                                    draggableId={"p"+index.toString()} 
                                    index={index}
                                >
                                    {(provided, snaphsot) => (
                                        <div 
                                            ref={provided.innerRef} 
                                            {...provided.dragHandleProps} 
                                            {...provided.draggableProps}
                                            className="list-draggable"
                                        >
                                            <List
                                                list={project}
                                                isChosen={project._id === projects.chosen._id}
                                                toDo={tasks.getTodo(project._id)}
                                                isDragging={snaphsot.isDragging}
                                                toggleSider={toggleSider}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            )}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </nav>

            {projects.length != 0 &&
                <Divider/>
            }

            <Button
                type="text"
                className="add-porject-button"
                onClick={projectForm.handleOpenForm}
                icon={<PlusOutlined/>}
            >
                Add Project
            </Button>

            <Modal
                open={projectForm.showForm}
                footer={null}
                closable={false}
                width={400}
                onCancel={projectForm.handleDisableForm}
                destroyOnClose
            >
                <ProjectForm/>
            </Modal>
        </aside>
    );
}

export default Sider;