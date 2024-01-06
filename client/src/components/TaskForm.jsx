import React, { useEffect, useRef } from "react";
import useForm from "../hooks/useForm";
import { Space, Button, Input, Divider, Select } from "antd";
import DateInput from "./DateInput";
import { useHomeContext } from "../context/HomeContext";
import { lists } from "../constants/const";



const TaskForm = () => {
    const {tasks, taskForm, projects} = useHomeContext();
    const editMode = taskForm.showForm.text ? true : false;

    const {form, setForm, updateForm} = useForm({
        text: editMode ? taskForm.showForm.text : "",
        note: editMode ? taskForm.showForm.note : "",
        link: editMode ? taskForm.showForm.link : "",
        date: taskForm.showForm.date,
        projectId: taskForm.showForm.projectId
    });

    const hanldeUpdateProjectId = value => {
        const event = {target: {name: "projectId", value: value}};
        updateForm(event);
    }

    const textRef = useRef(null);
    const dateRef = useRef(null);

    const handlePressEnter = () => {
        if(form.text)
            handleConfirm();
    }

    useEffect(() => {
        textRef.current.focus();
    }, []);

    const checkHTTPS = link => {
        if (!/^https?:\/\//i.test(link))
            link = "https://" + link;
        return link;
    }

    const handleConfirm = () => {
        let task = {
            text: form.text,
            note: form.note,
            done: editMode ? taskForm.showForm.done : false,
            date: form.date,
            link: form.link ? checkHTTPS(form.link) : "",
            projectId: form.projectId,
        };

        if(editMode)
        {
            tasks.find(task => task._id === taskForm.showForm._id).editTask(task);
            taskForm.handleDisableForm();
        }
        else
        {
            tasks.addTask(task);
            textRef.current.focus();
            setForm({
                text: editMode ? taskForm.showForm.text : "",
                note: editMode ? taskForm.showForm.note : "",
                date: taskForm.showForm.date,
                projectId: taskForm.showForm.projectId
            });
        }
    }

    const projectsList = () => [lists[0], ...projects].map(project => {
        return {
            value: project._id,
            label: (
                <Space size={5}>
                    <i
                        className={project.icon || "bi bi-record-fill"} 
                        style={{color: project.color, fontSize: project.icon && "12px"}}
                    />
                    <span>{project.name}</span>
                </Space>
            )
        }
    });

    return(
        <Space
            direction="vertical"
            style={{width: "100%"}}
        >
            <Input
                placeholder="Task name"
                name="text"
                value={form.text}
                onChange={updateForm}
                ref={textRef}
                onPressEnter={handlePressEnter}
            />
            <Input.TextArea
                placeholder="Description"
                name="note"
                value={form.note}
                onChange={updateForm}
                autoSize
            />
            <Input
                placeholder="Link"
                name="link"
                value={form.link}
                onChange={updateForm}
            />
            <DateInput
                name="date"
                value={form.date}
                onChange={updateForm}
                reference={dateRef}
            />

            <Divider/>

            <Select
                options={projectsList()}
                defaultValue={form.projectId}
                value={form.projectId}
                onChange={hanldeUpdateProjectId}
                style={{width: "100%"}}
            />

            <Divider/>

            <Space size={15}>
                <Button
                    type="primary"
                    onClick={handleConfirm}
                    disabled={!form.text}
                >
                    Confirm
                </Button>
                <Button onClick={taskForm.handleDisableForm}>
                    Cancel
                </Button>
            </Space>
        </Space>
    );
}

export default TaskForm;