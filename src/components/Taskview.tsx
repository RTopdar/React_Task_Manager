import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Button, MenuItem, TextField, Typography } from "@mui/material";
import useIsMobile from "../hooks/useIsMobile";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";

type Task = {
  _id: string;
  CREATED_BY: string;
  CREATED_AT: string;
  TASK_NAME: string;
  TASK_DESC: string;
  TASK_TIME: string;
  DONE: boolean | string;
  CATEGORY: string;
};

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
type TaskviewProps = {
  task?: Task | null;
  setdisplayTaskModal?: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAllTasks?: () => Promise<void>;
};

const Taskview: React.FC<TaskviewProps> = ({
  task,
  setdisplayTaskModal,
  fetchAllTasks,
}) => {
  const handleTaskUpdate = async () => {
    const res = await axios.patch(
      `${import.meta.env.VITE_BASE_URL}/tasks/${task?._id}`,
      {
        TASK_NAME: taskName,
        TASK_DESC: taskDesc,
        TASK_TIME: taskTime?.toISOString(),
        DONE: done,
        CATEGORY: category,
        CREATED_AT: createdAt?.toISOString(),
        CREATED_BY: JSON.parse(localStorage.getItem("user")!),
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (res.status === 200 || res.status === 201) {
      fetchAllTasks!();
      setdisplayTaskModal!(false);
    }
  };

  if (!task) {
    return <div>No task selected</div>;
  }

  const isMobile = useIsMobile();
  const user = JSON.parse(localStorage.getItem("user")!);

  const [taskName, settaskName] = useState("");
  const [taskDesc, settaskDesc] = useState("");
  const [taskTime, settaskTime] = useState<Dayjs | null>(null);
  const [done, setdone] = useState("");
  const [category, setcategory] = useState("");

  const [createdAt, setcreatedAt] = useState<Dayjs | null>(null);

  useEffect(() => {
    console.log(taskTime);
  }, [taskTime]);

  useEffect(() => {
    settaskName(task.TASK_NAME);
    settaskDesc(task.TASK_DESC);
    settaskTime(dayjs(task.TASK_TIME));
    setdone(task.DONE.toString());
    setcategory(task.CATEGORY);
    setcreatedAt(dayjs(task.CREATED_AT));
  }, []);

  return (
    <main className="container mx-auto w-full h-full flex flex-col items-center justify-center ">
      <div className=" md:w-1/3 lg:w-1/3 mx-auto bg-white flex flex-col items-center justify-center">
        <div className="w-full flex justify-between">
          <div className="ml-2">
            <Typography variant={isMobile ? "h5" : "h4"}>
              View and Edit Tasks
            </Typography>
          </div>
          <div className="mr-2 flex items-center">
            <CloseIcon
              className="cursor-pointer"
              onClick={() => setdisplayTaskModal!(false)}
            />
          </div>
        </div>
        <div className="flex flex-col w-full p-2 gap-y-2">
          <TextField
            label="Task Name"
            fullWidth
            onChange={(e) => {
              settaskName(e.target.value);
            }}
            value={taskName}
          />
          <TextField
            label="Task Description"
            fullWidth
            onChange={(e) => {
              settaskDesc(e.target.value);
            }}
            multiline
            maxRows={2}
            value={taskDesc}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateTimePicker"]}>
              <DateTimePicker
                label="Task Time"
                value={taskTime}
                onChange={(newValue) => {
                  settaskTime(newValue);
                }}
              />
            </DemoContainer>
          </LocalizationProvider>

          <TextField
            label="Category"
            fullWidth
            required
            select
            onChange={(e) => {
              setcategory(e.target.value);
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
              onClick={ () => {
                handleTaskUpdate();
                
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Taskview;
