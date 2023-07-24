import React from "react";
import Icon from "@ant-design/icons";
import { Button, Avatar, Dropdown, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";



const Header = ({showDone, setShowDone, handleToggleSider}) => {
    const [cookies,, deleteCookies] = useCookies(["token", "email"]);
    const navigate = useNavigate();

    const handleNavigateToday = () => navigate("/home/today");

    const handleLogout = () => {
        deleteCookies("token", {path: "/"});
        deleteCookies("email", {path: "/"});
        navigate("/login");
    }

    const avatarStyle = {
        backgroundColor: "gray",
        cursor: "pointer"
    };

    const menu = {
        items: [
            {
                key: "1",
                icon: <Icon component={() => <i className="bi bi-person-gear"/>}/>,
                label: <Link to="/account">Account settings</Link>
            },
            {
                key: "2",
                icon: <Icon component={() => <i className="bi bi-check-all"/>}/>,
                label: showDone ? "Hide done" : "Show done"
            },
            {
                key: "3",
                danger: true,
                icon: <Icon component={() => <i className="bi bi-box-arrow-right"/>}/>,
                label: "Log out"
            },
        ],
        onClick: e => {
            switch(e.key)
            {
                case "2": setShowDone(!showDone); break;
                case "3": handleLogout(); break;
            }
        }
    }

    return(
        <header className="header">
            <Space size={2}>
                <Button
                    type="text"
                    onClick={handleToggleSider}
                    icon={<i className="bi bi-list"/>}
                />
                <Button
                    type="text"
                    onClick={handleNavigateToday}
                    icon={<i className="bi bi-house-door"/>}
                />
            </Space>

            <Space>
                <Dropdown
                    menu={menu}
                    trigger={["click"]}
                    placement="topRight"
                    arrow
                >
                    <Avatar style={avatarStyle} size={28}>
                        {cookies.email.charAt(0).toUpperCase()}
                    </Avatar>
                </Dropdown>
            </Space>
        </header>
    );
}

export default Header;