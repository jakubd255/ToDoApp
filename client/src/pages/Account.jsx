import React, { useState } from "react";
import useForm from "../hooks/useForm";
import { useCookies } from "react-cookie";
import server from "../constants/server";
import { useNavigate, Link } from "react-router-dom";
import { Input, Button, Modal, message, Space, Card } from "antd";



const Account = () => {
    document.title = "ToDo account settings";

    const [cookies, setCookies, deleteCookies] = useCookies(["token", "email"]);
    const {form, updateForm, updateFormByName} = useForm({
        email: cookies.email,
        actualPassword: "",
        newPassword: "",
        confirmPassword: "",
        deletePassword: ""
    });
    const [showDeleteConfirm, setDeleteConfirm] = useState(false);
    const header = {headers: {"authorization": `Bearer ${cookies.token}`}}
    const navigate = useNavigate();

    const [messageApi, contextHolder] = message.useMessage();
    const errorMessage = message => {
        messageApi.open({
            type: "error",
            content: message,
        });
    };

    const cantUpdateEmail = () => {
        if(form.email === cookies.email || !form.email.includes("@"))
            return true;
        else return false;
    }

    const cantUpdatePassword = () => {
        if(form.actualPassword.length >= 8 && form.newPassword === form.confirmPassword && form.newPassword.length >= 8) 
            return false;
        else return true;
    }

    const updateEmail = () => {
        server.put("users/email", {email: form.email}, header).then(response => {
            setCookies("token", response.data.token, { path: "/" });
            setCookies("email", form.email, { path: "/" });
            window.location.reload(false);
        }).catch(error => {
            if(error.response.data.taken)
                errorMessage("This email adress is taken");
        });
    }

    const updatePassword = () => {
        server.put("/users/password", {
            actualPassword: form.actualPassword,
            newPassword: form.newPassword
        }, header).then(() => {
            window.location.reload(false);
        }).catch(error => {
            if(error.response.data.invalid) 
                errorMessage("Invalid password");
        });
    }

    const deleteAccount = () => {
        server.put("/users/delete", {
            password: form.deletePassword
        }, header).then(() => {
            deleteCookies("token", {path: "/"});
            deleteCookies("email", {path: "/"});
            navigate("/login");
        }).catch(error => {
            if(error.response.data.invalid)
            {
                updateFormByName("deletePassword", "");
                errorMessage("Invalid password");
            }
                
        });
    }

    const cancelDeleteAccount = () => {
        updateFormByName("deletePassword", "");
        setDeleteConfirm(false);
    }

    return(
        <Space direction="vertical" style={{width: "400px", marginTop: "50px"}} size={20}>
            <h1>
                Account settings
            </h1>

            {contextHolder}

            <Card title="Edit e-mail adress" size="small">
                <Space direction="vertical" style={{width: "100%"}}>
                    <Input
                        placeholder="E-mail adress"
                        name="email"
                        value={form.email}
                        onChange={updateForm}
                    />
                    <Button
                        type="primary"
                        disabled={cantUpdateEmail()}
                        onClick={updateEmail}
                        block
                    >
                        Update
                    </Button>
                </Space>
            </Card>

            <Card title="Edit password" size="small">
                <Space direction="vertical" style={{width: "100%"}}>
                    <Input.Password
                        placeholder="Actual password"
                        name="actualPassword"
                        value={form.actualPassword}
                        onChange={updateForm}
                    />
                    <Input.Password
                        placeholder="New password"
                        name="newPassword"
                        value={form.newPassword}
                        onChange={updateForm}
                    />
                    <Input.Password
                        placeholder="Confirm new password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={updateForm}
                    />
                    <Button
                        type="primary"
                        disabled={cantUpdatePassword()}
                        onClick={updatePassword}
                        block
                    >
                        Update password
                    </Button>
                </Space>
            </Card>
            
            <Card title="Delete account" size="small">
                <Space direction="vertical" style={{width: "100%"}}>
                    <span style={{alignItems: "left"}}>
                        You will lose all your data once your deletion request has been submitted. 
                    </span>

                    <Button
                        type="primary"
                        danger
                        onClick={() => setDeleteConfirm(true)}
                        block
                    >
                        Delete account
                    </Button>
                </Space>
            </Card>

            <Link to="/home/today">Return</Link>

            <Modal
                open={showDeleteConfirm}
                footer={null}
                onCancel={cancelDeleteAccount}
                style={{animationDuration: "0s"}}
                closable={false}
            >
                    <h3>
                        Delete account?
                    </h3>

                    <Space direction="vertical" style={{width: "100%"}}>
                        <span>
                            Type your password to confirm.
                        </span>

                        <Input.Password
                            name="deletePassword"
                            value={form.deletePassword}
                            onChange={updateForm}
                        />

                        <Space size={15}>
                            <Button 
                                type="primary"
                                onClick={deleteAccount}
                                danger
                            >
                                Delete
                            </Button>
                            <Button onClick={cancelDeleteAccount}>
                                Cancel
                            </Button>
                        </Space>
                    </Space>
            </Modal>
        </Space>
    );
}

export default Account;