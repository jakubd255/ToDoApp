import React from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import server from "../constants/server";
import useForm from "../hooks/useForm";
import { Input, Button, message, Space, Card } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";



const Register = () => {
    document.title = "Register to ToDo";
    
    const {form, setForm, updateForm, updateFormByName} = useForm({
        email: "",
        password: "",
        password2: "",
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

        if(!form.email.includes("@") || form.password.length < 8 || form.password !== form.password2)
            errorMessage("Invalid props");

        else
        {
            updateFormByName("loading", true);
            server.post("/users/register", {
                email: form.email,
                password: form.password
            }).then(response => {
                setCookie("token", response.data.token, {path: "/"});
                setCookie("email", form.email, { path: "/" });
                navigate("/home");
            }).catch(error => {
                if(error.response.data.taken)
                {
                    errorMessage("This e-mail adress is taken");
                    setForm({
                        email: form.email,
                        password: "",
                        password2: "",
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
                    Register
                </h1>

                {contextHolder}
                
                <Card size="small">
                    <Space direction="vertical" style={{width: "100%"}}>
                        <Input
                            placeholder="E-mail adress"
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
                        <Input.Password
                            placeholder="Confirm password"
                            name="password2"
                            value={form.password2}
                            onChange={updateForm}
                            required
                            addonBefore={<LockOutlined/>}
                        />

                        <Button
                            type="primary"
                            htmlType="submit"
                            fullWidth
                            loading={form.loading}
                            icon={<LoginOutlined/>}
                            block
                        >
                            {form.loading ? "Creating account" : "Register"}
                        </Button>
                    </Space>
                </Card>
                <Space>
                    <span>
                        Have already an account?
                    </span>
                    <Link to="/login">
                        Log in
                    </Link>
                </Space>
            </Space>
        </form>
    );
}

export default Register;