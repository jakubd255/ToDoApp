import dayjs from "dayjs"



const date = (days = 0) => {
    return dayjs().add(days, "days").format("YYYY-MM-DD");
}

export {date};