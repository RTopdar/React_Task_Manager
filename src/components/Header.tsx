import { AppBar, Button, Typography } from "@mui/material";
import React from "react";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { useNavigate } from "react-router-dom";
import logout from "../functions/logout";

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
        <div className="w-full h-full flex items-center justify-between">
          <div
            className="w-3/5 flex  items-center gap-x-2"
            onClick={() => {
              navigate("/");
            }}
          >
            <AddTaskIcon
              sx={{
                color: "black",
                fontSize: "30px",
              }}
            />
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
          {window.location.pathname.includes("task") && (
            <div className="mr-2">
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  logout();
                }}
                size="small"
              >
                Log Out
              </Button>
            </div>
          )}
        </div>
      </AppBar>
    </main>
  );
};

export default Header;
