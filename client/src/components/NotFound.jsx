import React from "react";
import { Link } from "react-router-dom";
import { Space } from "antd";



const NotFound = () => {
    return(
        <Space direction="vertical">
            <h1 className="not-found-header">
                404
            </h1>
            <p>
                Sorry, the page you have visited does not exist
            </p>
            <Link to="/home/today">
                Go back home
            </Link>
        </Space>
    );
}

export default NotFound;