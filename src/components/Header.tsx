import { AppBar, Typography } from "@mui/material";
import React from "react";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { useNavigate } from "react-router-dom";


const Header = () => {
  const navigate = useNavigate();
  return (
    <main className="w-full h-full">
      <AppBar
        position="static"
        sx={{
          height: "50px",
          backgroundColor: "white",
          boxShadow: "none",
        }}
      >
        <div className="w-full h-full flex items-center">
          <div className="w-4/5 flex  items-center gap-x-2" onClick={()=>{
            navigate("/");
          }}>
          <AddTaskIcon sx={{
            color: "black",
            fontSize: "30px"
          }} />
            <Typography
              variant="body2"
              component="div"
              sx={{
                color: "black",
              }}
            >
              Task Management Application
            </Typography>
          </div>
        </div>
      </AppBar>
    </main>
  );
};

export default Header;
