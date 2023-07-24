import React from "react";
import { Button, Space, DatePicker } from "antd";
import dayjs from "dayjs";
import { date } from "../constants/date";



const DateInput = ({name, value, onChange, reference}) => {
    const updateDate = (value, dateString) => {
        if(dateString === "Yesterday")
            dateString = date(-1);
        else if(dateString === "Today")
            dateString = date();
        else if(dateString === "Tomorrow")
            dateString = date(1);
        
        const event = {target: {name: "date", value: dateString}}
        onChange(event);
    }

    const updateDateMenu = value => {
        reference.current.blur();

        if(value !== null && value !== "")
            value = date(value);

        const event = {target: {name: "date", value: value}}
        onChange(event);
    }

    const format = value => {
        value = value.format("YYYY-MM-DD");
        switch(value)
        {
            case date(-1): return "Yesterday";
            case date(): return "Today";
            case date(1): return "Tomorrow";
            default: return value;
        }
    }

    const disabledDate = current => {
        const newCurrent = current.subtract(-1, "days");
        return newCurrent && newCurrent < dayjs().endOf("day");
      };

    const Footer = () => (
        <Space direction="vertical" style={{width: "100%"}} size={0}>
            {value !== date() &&
                <Button
                    type="text"
                    icon={<i className="bi bi-calendar-event"/>}
                    style={{textAlign: "left"}}
                    onClick={() => updateDateMenu(0)}
                    block
                >
                    Today
                </Button>
            }
            {value !== date(1) &&
                <Button
                    type="text"
                    icon={<i className="bi bi-sun"/>}
                    style={{textAlign: "left"}}
                    onClick={() => updateDateMenu(1)}
                    block
                >
                    Tomorrow
                </Button>
            }
            {value !== date(7) &&
                <Button
                    type="text"
                    icon={<i className="bi bi-calendar-week"/>}
                    style={{textAlign: "left"}}
                    onClick={() => updateDateMenu(7)}
                    block
                >
                    Next week
                </Button>
            }
            {value &&
                <Button
                    type="text"
                    icon={<i className="bi bi-slash-circle"/>}
                    style={{textAlign: "left"}}
                    onClick={() => updateDateMenu("")}
                    block
                >
                    No date
                </Button>
            }
        </Space>
    );

    return(
        <DatePicker
            showToday={false}
            name={name}
            value={value ? dayjs(value, "YYYY-MM-DD") : null}
            renderExtraFooter={Footer}
            onChange={updateDate}
            ref={reference}
            format={format}
            disabledDate={disabledDate}
        />
    );
}

export default DateInput;