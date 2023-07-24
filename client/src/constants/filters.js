import dayjs from "dayjs"



export const filters = {
    all: [
        task => task.projectId === "inbox",
        task => task.date && task.date <= dayjs().format("YYYY-MM-DD"),
        task => task.date && task.date >= dayjs().format("YYYY-MM-DD")
    ],
    toDo: [
        task => task.projectId === "inbox" && !task.done,
        task => task.date && task.date <= dayjs().format("YYYY-MM-DD") && !task.done,
        task => task.date && task.date > dayjs().format("YYYY-MM-DD") && !task.done
    ],
    done: [
        task => task.projectId === "inbox" && task.done,
        task => task.date && task.date <= dayjs().format("YYYY-MM-DD") && task.done,
        task => task.date && task.date > dayjs().format("YYYY-MM-DD") && task.done
    ]
};