import React from "react";
import Header from "./components/Header";
import AppRoute from "./AppRoute";

const App = () => {
  return (
    <main className="w-full h-screen flex flex-col gap-y-1">
      <div className="h-[50px] md:h-[60px] lg:h-[60px] border border-solid">
        <Header />
      </div>
      <div className="w-full flex-grow">
        <AppRoute />
      </div>
    </main>
  );
};

export default App;
