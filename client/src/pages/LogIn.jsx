import React from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import server from "../constants/server";
import useForm from "../hooks/useForm";
import { Input, Button, message, Space, Card } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";



const LogIn = () => {
    document.title = "Log in to ToDo";
    
    const {form, setForm, updateForm, updateFormByName} = useForm({
        email: "",
        password: "",
        loading: false,
    });
    const [, setCookie] = useCookies(["token", "email"]);
    const navigate = useNavigate();
    
    const [messageApi, contextHolder] = message.useMessage();
    const errorMessage = message => {
        messageApi.open({
            type: "error",
            content: message,
        });
    };

    const handleSubmit = e => {
        e.preventDefault();

        if(!form.email.includes("@") || form.password.length < 8)
            errorMessage("Invalid props");

        else if(form.email && form.password)
        {
            updateFormByName("loading", true);
            server.post("/users/login", {
                email: form.email,
                password: form.password
            }).then(response => {
                setCookie("token", response.data.token, { path: "/" });
                setCookie("email", form.email, { path: "/" });
                navigate("/home/today");
            }).catch(error => {
                if(error.response.data.invalid)
                {
                    errorMessage("Invalid e-mail or password");
                    setForm({
                        email: form.email,
                        password: "",
                        loading: false
                    });
                }
            });
        }
    }

    const enterDownHandler = event => {
        if(event.key === "Enter") handleSubmit();
    }

    return(
        <form
            className="sign-form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
            onKeyDown={enterDownHandler}
        >
            <Space direction="vertical" style={{width: "400px", marginTop: "100px"}}>
                <h1>
                    Log in
                </h1>

                {contextHolder}

                <Card size="small">
                    <Space direction="vertical" style={{width: "100%"}}>
                        <Input
                            placeholder="E-mail address"
                            name="email"
                            value={form.email}
                            onChange={updateForm}
                            autoFocus
                            required
                            addonBefore={<UserOutlined/>}
                        />
                        <Input.Password
                            placeholder="Password"
                            name="password"
                            value={form.password}
                            onChange={updateForm}
                            required
                            addonBefore={<LockOutlined/>}
                        />
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<LoginOutlined/>}
                            loading={form.loading}
                            block
                        >
                            {form.loading ? "Logging in" : "Log in"}
                        </Button>
                    </Space>
                </Card>
                <Space>
                    <span>
                        Don't have an account?
                    </span>
                    <Link to="/register">
                        Register
                    </Link>
                </Space>
            </Space>
        </form>
    );
}

export default LogIn;