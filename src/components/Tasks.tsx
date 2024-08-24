import React, { useEffect, useLayoutEffect, useState } from "react";
import loginValidator from "../functions/loginValidator";
import axios from "axios";
import { Button, Typography } from "@mui/material";
import useIsMobile from "../hooks/useIsMobile";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";

const Tasks = () => {
  interface Task {
    CATEGORY: string;
    CREATED_AT: string;
    CREATED_BY: string;
    DONE: boolean;
    TASK_DESC: string;
    TASK_NAME: string;
    TASK_TIME: string;
    _id: string;
  }

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
  const categoryColors: { [key: string]: string } = {
    Work: "bg-blue-200",
    Personal: "bg-green-200",
    Urgent: "bg-red-200",
    Important: "bg-yellow-200",
    "Low Priority": "bg-gray-200",
    Recurring: "bg-purple-200",
    Learning: "bg-indigo-200",
    Health: "bg-pink-200",
    Finance: "bg-teal-200",
    Household: "bg-orange-200",
    Social: "bg-lime-200",
    Miscellaneous: "bg-cyan-200",
  };
  const [tasks, settasks] = useState<Task[]>([]);
  const [recentTasks, setrecentTasks] = useState<Task[]>([]);
  const [upcomingTasks, setupcomingTasks] = useState<Task[]>([]);

  const isMobile = useIsMobile();
  const fetchAllTasks = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/tasks`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    settasks(res.data);
    const now = new Date();
    const upcoming = res.data
      .filter((task: Task) => new Date(task.TASK_TIME) > now)
      .sort(
        (a: Task, b: Task) =>
          new Date(b.TASK_TIME).getTime() - new Date(a.TASK_TIME).getTime()
      );
    setupcomingTasks(upcoming.slice(0, 3));
    const recent = res.data.sort(
      (a: Task, b: Task) =>
        new Date(b.CREATED_AT).getTime() - new Date(a.CREATED_AT).getTime()
    );
    setrecentTasks(recent.slice(0, 3));
  };
  useEffect(() => {
    loginValidator();
    fetchAllTasks();
  }, []);
  useEffect(() => {
    console.log(upcomingTasks);
  }, [upcomingTasks]);
  useEffect(() => {
    console.log(tasks);
  }, [tasks]);
  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };
  useEffect(() => {
    console.log(recentTasks);
  }, [recentTasks]);
  const colums: GridColDef[] = [
    {
      field: "TASK_NAME",
      headerName: "Task Name",
      width: 200,
    },
    {
      field: "TASK_DESC",
      headerName: "Task Description",
      width: 200,
    },
    {
      field: "TASK_TIME",
      headerName: "Task Time",
      width: 200,
    },
    {
      field: "CREATED_AT",
      headerName: "Created At",
      width: 200,
    },
    {
      field: "DONE",
      headerName: "Done",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => { 
        if(params.value === true){
          return (
            <div className={`p-1  w-full h-full  `}>
              <span
                className={`w-max h-max bg-green-200 inline-flex items-center px-3 py-1  text-sm font-medium rounded-full`}
              >
                Done
              </span>
            </div>
          );
        }
        else{
          return (
            <div className={`p-1  w-full h-full  `}>
              <span
                className={`w-max h-max bg-yellow-200 inline-flex items-center px-3 py-1  text-sm font-medium rounded-full`}
              >
                Pending
              </span>
            </div>
          );
        }
      }
    },
    {
      field: "CATEGORY",
      headerName: "Category",
      align: "center",
      headerAlign: "center",
      width: 200,

      type: "singleSelect",
      valueOptions: categories,

      renderCell: (params) => {
        return (
          <div className={`p-1  w-full h-full  `}>
            <span
              className={`w-max h-max ${
                categoryColors[params.value]
              } inline-flex items-center px-3 py-1  text-sm font-medium rounded-full`}
            >
              {params.value}
            </span>
          </div>
        );
      },
    },
    {
      field: "View",
      headerName: "",
      width: 200,
      align: "center",

      renderCell: () => {
        return (
          <div className="">
            <Button variant="outlined">View</Button>
          </div>
        );
      },
    },
    {
      field: "Edit",
      headerName: "",
      width: 200,
      align: "center",

      renderCell: () => {
        return (
          <div className="">
            <Button variant="outlined">Edit</Button>
          </div>
        );
      },
    },
    {
      field: "Delete",
      headerName: "",
      width: 200,
      align: "center",

      renderCell: () => {
        return (
          <div className="">
            <Button variant="outlined" color="error">
              Delete
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <section className="h-full flex flex-col items-center mb-2  ">
      <div className="md:h-1/5 lg:h-1/5 h-[20%] p-1 container ">
        <div className="h-full flex flex-col">
          <Typography
            variant={isMobile ? "h6" : "h4"}
            sx={{
              fontWeight: "bold",
            }}
          >
            Upcoming Tasks
          </Typography>
          <div className="w-full h-full overflow-x-auto flex flex-row gap-x-2 p-1 md:p-2 lg:p-2 ">
            {upcomingTasks.map((task: Task) => {
              return (
                <div className=" w-1/3 h-full bg-white border border-solid border-gray-400 rounded-lg p-1 ">
                  <div className="font-bold text-md md:text-lg lg:text-lg mb-2 h-[35%] md:h-[30%] ">
                    {task.TASK_NAME}
                  </div>
                  <p className="text-gray-700 text-base text-[10px] md:text-xl lg:text-xl truncate tracking-tighter md:tracking-normal lg:tracking-normal mb-2 h-[25%] md:h-[25%]">
                    {task.TASK_DESC}
                  </p>
                  <div className="flex h-[20%] md:h-[30%] md:gap-x-2 lg:gap-x-2">
                    <span className="bg-gray-200 p-2 rounded-full w-1/2  text-[9px] md:text-xl lg:text-xl flex flex-col items-center justify-center">
                      {formatDate(task.TASK_TIME).split(",")[0]}
                    </span>
                    <span className="bg-gray-200 p-2 rounded-full  w-1/2 text-[9px] md:text-xl lg:text-xl flex flex-col items-center justify-center">
                      {formatDate(task.TASK_TIME).split(",")[1]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="md:h-1/5 lg:h-1/5 h-[20%] p-1 container ">
        <div className="h-full flex flex-col">
          <Typography
            variant={isMobile ? "h6" : "h4"}
            sx={{
              fontWeight: "bold",
            }}
          >
            Recently Added
          </Typography>
          <div className="w-full h-full overflow-x-auto flex flex-row gap-x-2 p-1 md:p-2 lg:p-2 ">
            {recentTasks.map((task: Task) => {
              return (
                <div className=" w-1/3 h-full bg-white border border-solid border-gray-400 rounded-lg p-1 ">
                  <div className="font-bold text-md md:text-lg lg:text-lg mb-2 h-[35%] md:h-[30%] ">
                    {task.TASK_NAME}
                  </div>
                  <p className="text-gray-700 text-base text-[10px] md:text-xl lg:text-xl truncate tracking-tighter md:tracking-normal lg:tracking-normal mb-2 h-[25%] md:h-[25%]">
                    {task.TASK_DESC}
                  </p>
                  <div className="flex h-[20%] md:h-[30%] md:gap-x-2 lg:gap-x-2">
                    <span className="bg-gray-200 p-2 rounded-full w-1/2  text-[9px] md:text-xl lg:text-xl flex flex-col items-center justify-center gap-x-0 ">
                      {formatDate(task.TASK_TIME).split(",")[0]}
                    </span>
                    <span className="bg-gray-200 p-2 rounded-full  w-1/2 text-[9px] md:text-xl lg:text-xl flex flex-col items-center justify-center">
                      {formatDate(task.TASK_TIME).split(",")[1]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="h-[55%] container  pb-2">
        <div className="h-full ">
          <Typography
            variant={isMobile ? "h6" : "h4"}
            sx={{
              fontWeight: "bold",
            }}
          >
            All Tasks
          </Typography>
          <div className="h-[450px] md:">
            <DataGrid
              rows={tasks}
              columns={colums}
              getRowId={(tasks) => {
                return tasks._id;
              }}
              hideFooter
              slots={{
                toolbar: GridToolbar,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tasks;
