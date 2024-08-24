import React, { useEffect, useLayoutEffect } from "react";
import logout from "../functions/logout";

const Tasks = () => {
  useEffect(() => {
    logout();
  }, []);
  return (
    <section className="h-full flex flex-col items-center ">
      <div className="h-2/5 container">Recent Tasks</div>
      <div className="h-3/5 container">All Tasks</div>
    </section>
  );
};

export default Tasks;
