import React, { useRef, useEffect } from "react";
import { Button, Input, Space, Divider, Select } from "antd";
import useForm from "../hooks/useForm";
import { useHomeContext } from "../context/HomeContext";
import { colors } from "../constants/const";



const ProjectForm = () => {
    const {projectForm, projects} = useHomeContext();
    const editMode = projectForm.showForm._id ? true : false;

    const {form, updateForm} = useForm({
        name: editMode ? projects.find(project => project._id === projectForm.showForm._id).name : "",
        color: editMode ? projects.find(project => project._id === projectForm.showForm._id).color : colors[0].value
    });

    const colorList = () => colors.map(color => {
        return {
            value: color.value,
            label: (
                <div className="color-choice">
                    <i className="bi bi-record-fill" style={{color: color.value}}/>
                    <span>{color.name}</span>
                </div>
            )
        }
    });
    
    const ref = useRef();
    useEffect(() => {
        ref.current.focus();
    }, []);

    const hanldeUpdateColor = (value) => {
        const event = {target: {name: "color", value: value}};
        updateForm(event);
    }

    const handleConfirm = () => {
        if(editMode)
            projectForm.showForm.editProject({name: form.name, color: form.color});
        else
            projects.addProject({name: form.name, color: form.color});

        projectForm.handleDisableForm();
    }

    const handlePressEnter = () => {
        if(form.name)
            handleConfirm();
    }

    return(
        <Space direction="vertical" style={{width: "100%"}}>
            <Input
                placeholder="Project name"
                name="name"
                required
                ref={ref}
                value={form.name}
                onChange={updateForm}
                onPressEnter={handlePressEnter}
            />

            <Select
                style={{width: "100%"}} 
                options={colorList()} 
                defaultValue={form.color}
                onChange={hanldeUpdateColor}
                value={form.color}
            />

            <Divider/>

            <Space size={15}>
                <Button
                    type="primary"
                    onClick={handleConfirm}
                    disabled={!form.name}
                >
                    Confirm
                </Button>
                <Button onClick={projectForm.handleDisableForm}>
                    Cancel
                </Button>
            </Space>
        </Space>
    );
}

export default ProjectForm