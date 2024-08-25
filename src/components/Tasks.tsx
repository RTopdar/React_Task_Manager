import React, { useEffect, useLayoutEffect, useState } from "react";
import loginValidator from "../functions/loginValidator";
import axios from "axios";
import { Button, MenuItem, Modal, TextField, Typography } from "@mui/material";
import useIsMobile from "../hooks/useIsMobile";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Taskview from "./Taskview";
import AddTask from "./AddTask";

const Tasks = () => {
  interface Task {
    CATEGORY: string;
    CREATED_AT: string;
    CREATED_BY: string;
    DONE: boolean | string;
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
  const [displayTaskModal, setdisplayTaskModal] = useState(false);
  const [displayAddTaskModal, setdisplayAddTaskModal] = useState(false);
  const [selectedTask, setselectedTask] = useState<Task | null>(null);
  const [category, setcategory] = useState("");
  const [status, setstatus] = useState("");

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
  const deleteTask = async(id: string)=>{
    
    await axios.delete(`${import.meta.env.VITE_BASE_URL}/tasks`,{
      params: {
        id: id
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(()=>{
      fetchAllTasks()
      alert("Task Deleted")
    }).catch((err)=>{
      console.log(err)
    })
  }
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
  useEffect(() => {
    console.log(selectedTask);
  }, [selectedTask]);

  const colums: GridColDef[] = [
    {
      field: "TASK_NAME",
      headerName: "Task Name",
      width: 200,
      renderCell: (params) => {
        return (
          <div
            className=""
            onClick={() => {
              setselectedTask(params.row);
              setdisplayTaskModal(true);
            }}
          >
            {params.value}
          </div>
        );
      },
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
      renderCell: (params) => {
        return <div className="">{formatDate(params.value)}</div>;
      },
    },

    {
      field: "CREATED_AT",
      headerName: "Created At",
      width: 200,
      renderCell: (params) => {
        console.log(params.row);
        return <div className="">{formatDate(params.value)}</div>;
      },
    },
    {
      field: "DONE",
      headerName: "Done",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (params.value === true) {
          return (
            <div className={`p-1  w-full h-full  `}>
              <span
                className={`w-max h-max bg-green-200 inline-flex items-center px-3 py-1  text-sm font-medium rounded-full`}
              >
                Done
              </span>
            </div>
          );
        } else {
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
      },
    },
    {
      field: "MARK_DONE",
      headerName: "",
      width: 200,
      align: "center",
      renderCell: (params) => {
        return (
          <div className="">
            <Button
              variant="outlined"
              disabled={params.row.DONE === true}
              onClick={() => {
                axios
                  .post(
                    `${import.meta.env.VITE_BASE_URL}/tasks/mark`,
                    {
                      id: params.row._id,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                    }
                  )
                  .then(() => {
                    if (category === "" && status === "") {
                      fetchAllTasks();
                    } else {
                      fetchFilterData();
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
            >
              Mark Done
            </Button>
          </div>
        );
      },
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
      field: "Edit",
      headerName: "",
      width: 200,
      align: "center",

      renderCell: (params) => {
        return (
          <Button variant="outlined"
           
            onClick={() => {
              setselectedTask(params.row);
              setdisplayTaskModal(true);
            }}
          >
            Edit
          </Button>
        );
      },
    },
    {
      field: "Delete",
      headerName: "",
      width: 200,
      align: "center",

      renderCell: (params) => {
        return (
          <div className="">
            <Button variant="outlined" color="error" onClick={()=>{
              
              deleteTask(params.row._id)
            }}>
              Delete
            </Button>
          </div>
        );
      },
    },
  ];
  const fetchFilterData = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/tasks/filter`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          category: category,
          done: status,
        },
      }
    );
    settasks(res.data);
  };

  return (
    <section className="h-full flex flex-col items-center mb-2  ">
      <Modal open={displayTaskModal} onClose={() => setdisplayTaskModal(false)}>
        <Taskview
          task={selectedTask}
          setdisplayTaskModal={setdisplayTaskModal}
          fetchAllTasks={fetchAllTasks}
        />
      </Modal>
      <Modal open={displayAddTaskModal} onClose={() => setdisplayAddTaskModal(false)}>
        <AddTask setdisplayAddTaskModal={setdisplayAddTaskModal} fetchAllTasks={fetchAllTasks} />
      </Modal>

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
          <div className="w-full h-full overflow-x-auto flex flex-row gap-x-2 px-1 md:p-2 lg:p-2 ">
            {upcomingTasks.map((task: Task, index: number) => {
              return (
                <div
                  className=" w-1/3 h-full bg-white border border-solid border-gray-400 rounded-lg p-1 "
                  key={index}
                  onClick={()=>{
                    setselectedTask(task)
                    setdisplayTaskModal(true)
                  }}
                >
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
          <div className="w-full h-full overflow-x-auto flex flex-row gap-x-2 px-1 md:p-2 lg:p-2 ">
            {recentTasks.map((task: Task, index: number) => {
              return (
                <div
                  className=" w-1/3 h-full bg-white border border-solid border-gray-400 rounded-lg p-1 "
                  key={index}
                  onClick={()=>{
                    setselectedTask(task)
                    setdisplayTaskModal(true)
                  }}
                >
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
      <div className="h-[55%] container p-1 pb-2">
        <div className="h-full ">
          <div className="w-full mb-1 flex justify-between">
            <Typography
              variant={isMobile ? "h6" : "h4"}
              sx={{
                fontWeight: "bold",
              }}
            >
              All Tasks
            </Typography>
            <Button
              variant="contained"
              onClick={() => setdisplayAddTaskModal(true)}
            >
              Add Task
            </Button>
          </div>
          <div className="w-full flex gap-x-1 justify-evenly">
            <TextField
              select
              label="Category"
              variant="outlined"
              fullWidth
              value={category}
              onChange={(e) => {
                setcategory(e.target.value);
              }}
            >
              {categories.map((category) => {
                return (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                );
              })}
            </TextField>
            <TextField
              select
              label="Status"
              variant="outlined"
              value={status}
              fullWidth
              onChange={(e) => {
                setstatus(e.target.value);
              }}
            >
              <MenuItem value={"true"}>Done</MenuItem>
              <MenuItem value={"false"}>Pending</MenuItem>
            </TextField>
            <Button
              variant="contained"
              onClick={() => {
                fetchFilterData();
              }}
            >
              Filter
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                fetchAllTasks();
                setcategory("");
                setstatus("");
              }}
            >
              Clear
            </Button>
          </div>
          <div className="h-[450px] mt-1 md:mt-2 lg:mt-2">
            <DataGrid
              rows={tasks}
              columns={colums}
              getRowId={(tasks) => {
                return tasks._id;
              }}
              hideFooter
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tasks;
