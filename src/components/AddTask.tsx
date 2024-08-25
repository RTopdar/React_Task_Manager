import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Button, MenuItem, TextField, Typography } from "@mui/material";
import useIsMobile from "../hooks/useIsMobile";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
const categories = [
  "Work",
  "Personal",
  "Urgent",
  "Important",
  "Low Priority",
  "Recurring",
  "Learning",
  "Health",
  "Finance",
  "Household",
  "Social",
  "Miscellaneous",
];
type AddTaskProps = {
  fetchAllTasks?: () => Promise<void>;
  setdisplayAddTaskModal?: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddTask: React.FC<AddTaskProps> = ({
  fetchAllTasks,
  setdisplayAddTaskModal,
}) => {
  const createdBy = JSON.parse(localStorage.getItem("user")!);
  const createdAt = dayjs().toISOString();
  const done = "false";
  const isMobile = useIsMobile();
  const [taskName, setTaskName] = useState<string>("");
  const [taskDesc, setTaskDesc] = useState<string>("");
  const [taskTime, setTaskTime] = useState<Dayjs | null>(null);
  const [category, setCategory] = useState<string>("");

  const handleDateChange = (newValue: Dayjs | null) => {
    setTaskTime(newValue);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (taskName === "" || taskTime === null || category === "") {
      alert("Please fill all the fields");
    } else {
      handleTaskAdd();
      fetchAllTasks!();
      setdisplayAddTaskModal!(false);
    }
  };

  const handleTaskAdd = async () => {
    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/tasks`,
      {
        CREATED_BY: createdBy,
        CREATED_AT: createdAt,
        TASK_NAME: taskName,
        TASK_DESC: taskDesc,
        TASK_TIME: taskTime?.toISOString(),
        CATEGORY: category,
        DONE: done,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  };

  return (
    <main className="container mx-auto w-full h-full flex flex-col items-center justify-center ">
      <div className=" md:w-1/3 lg:w-1/3 mx-auto bg-white flex flex-col items-center justify-center">
        <div className="w-full flex justify-between">
          <div className="ml-2">
            <Typography variant={isMobile ? "h5" : "h4"}>
              Add New Task
            </Typography>
          </div>
          <div className="mr-2 flex items-center">
            <CloseIcon
              className="cursor-pointer"
              onClick={() => setdisplayAddTaskModal!(false)}
            />
          </div>
        </div>
        <form
          className="flex flex-col w-full p-2 gap-y-2"
          onSubmit={handleSubmit}
        >
          <TextField
            label="Task Name"
            fullWidth
            onChange={(e) => {
              setTaskName(e.target.value);
            }}
            required
            value={taskName}
          />
          <TextField
            label="Task Description"
            fullWidth
            onChange={(e) => {
              setTaskDesc(e.target.value);
            }}
            multiline
            maxRows={2}
            value={taskDesc}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateTimePicker"]}>
              <DateTimePicker
                label="Task Time*"
                value={taskTime}
                onChange={handleDateChange}
              />
            </DemoContainer>
          </LocalizationProvider>

          <TextField
            label="Category"
            fullWidth
            select
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            value={category}
          >
            {categories.map((category: string) => {
              return (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              );
            })}
          </TextField>
          <div className="w-full flex justify-end pr-2">
            <Button
              variant="contained"
                type="submit"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddTask;
