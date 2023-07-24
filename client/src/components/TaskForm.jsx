import React, { useEffect, useRef } from "react";
import useForm from "../hooks/useForm";
import { Space, Button, Input, Divider } from "antd";
import DateInput from "./DateInput";
import { useHomeContext } from "../context/HomeContext";



const TaskForm = () => {
    const {tasks, taskForm} = useHomeContext();
    const editMode = taskForm.showForm.text ? true : false;

    const {form, setForm, updateForm} = useForm({
        text: editMode ? taskForm.showForm.text : "",
        note: editMode ? taskForm.showForm.note : "",
        link: editMode ? taskForm.showForm.link : "",
        date: taskForm.showForm.date
    });

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
            projectId: taskForm.showForm.projectId,
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
                date: taskForm.showForm.date
            });
        }
    }

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