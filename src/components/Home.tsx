import { Button, Typography } from "@mui/material";
import React from "react";
import useIsMobile from "../hooks/useIsMobile";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const Home = () => {
  const isMobile = useIsMobile();
  return (
    <section className="w-full h-full flex flex-col items-center justify-center gap-y-5">
      <div className="container  flex flex-col items-center justify-center ">
        <Typography
          variant={isMobile ? "h4" : "h2"}
          color="primary"
          sx={{
            fontWeight: "bold",
          }}
        >
          Task Management App
        </Typography>
        <Typography variant={isMobile ? "h6" : "h4"} color="primary">
          Manage your tasks with ease
        </Typography>
      </div>
      <div className="container mx-auto flex flex-row justify-evenly">
        <Button variant="contained" color="primary" href="/login">
          Login
        </Button>
        <Button variant="contained" color="primary" href="/register">
          Register
        </Button>
      </div>
    </section>
  );
};

export default Home;
