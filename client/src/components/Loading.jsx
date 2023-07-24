import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';



const Loading = () => (
    <div className="loading-animation">
        <Spin indicator={<LoadingOutlined style={{fontSize: 100}} spin/>}/>
    </div>
);

export default Loading;