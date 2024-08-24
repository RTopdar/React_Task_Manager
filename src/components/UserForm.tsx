import { Button, FormControl, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import HttpsIcon from "@mui/icons-material/Https";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface UserFormProps {
  type: string;
}

const UserForm: React.FC<UserFormProps> = ({ type }) => {
  const navigate = useNavigate();
  const [userName, setuserName] = useState("");
  const [password, setpassword] = useState("");
  const [showPass, setshowPass] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordChange = (e: any) => {
    const value = e.target.value;
    setpassword(value);
    if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
    } else {
      setPasswordError("");
    }
  };
  const loginUser = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/login`,
        {
          email: userName,
          password: password,
        }
      );
      if (res.status === 200) {
        toast.success("User logged in successfully");
        alert("User logged in successfully");
        console.log(res.data);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.userId));
        localStorage.setItem("expiresIn", res.data.expiresIn);
        setuserName("");
        setpassword("");
        navigate("/tasks");
      } else {
        toast.info(res.data.error);
        alert(res.data.error);
        console.log(res.data);
      }
    } catch (error) {
      if (error.response) {
        toast.error(`Error: ${error.response.data.error}`);
        alert(`Error: ${error.response.data.error}`);
        console.log(error.response.data.error);
      } else if (error) {
        toast.error("No response received from the server");
        alert("No response received from the server");
        console.log(error);
      } else {
        toast.error("An error occurred during registration");
        alert("An error occurred during registration");
        console.log("Error", error);
      }
    }
  };
  const registerUser = async () => {
    console.log("registering user");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/register`,
        {
          email: userName,
          password: password,
        }
      );
      if (res.status === 200 || res.status === 201) {
        toast.success("User registered successfully");
        alert("User registered successfully");
        loginUser();
      } else {
        toast.info(res.data.error);
        alert(res.data.error);
        console.log(res.data);
      }
    } catch (error) {
      if (error.response) {
        toast.error(`Error: ${error.response.data.error}`);
        alert(`Error: ${error.response.data.error}`);
        console.log(error.response.data.error);
      } else if (error) {
        toast.error("No response received from the server");
        alert("No response received from the server");
        console.log(error);
      } else {
        toast.error("An error occurred during registration");
        alert("An error occurred during registration");
        console.log("Error", error);
      }
    }
  };

  return (
    <section className="w-full h-full flex flex-col items-center justify-center">
      <div className="flex flex-col w-full max-w-md px-4 py-8 bg-white rounded-lg shadow -800 sm:px-6 md:px-8 lg:px-10">
        <div className="self-center mb-6 text-xl font-light text-gray-600 sm:text-2xl ">
          {type === "register" ? (
            <Typography variant="h4" color="primary">
              Create an account
            </Typography>
          ) : (
            <Typography variant="h4" color="primary">
              Login
            </Typography>
          )}
        </div>
        <form
          className="mt-8 "
          onSubmit={(e) => {
            e.preventDefault();
            console.log("submitting form");
            if (type === "register") {
              registerUser();
            } else {
              loginUser();
            }
          }}
        >
          <FormControl variant="standard" fullWidth>
            <TextField
              id="outlined-basic"
              label="Email ID"
              type="email"
              value={userName}
              onChange={(e) => setuserName(e.target.value)}
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
              margin="normal"
            />
            <TextField
              id="outlined-basic"
              label="Password"
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => handlePasswordChange(e)}
              variant="outlined"
              fullWidth
              margin="normal"
              error={passwordError.length > 0}
              helperText={passwordError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HttpsIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {showPass ? (
                      <VisibilityIcon onClick={() => setshowPass(false)} />
                    ) : (
                      <VisibilityOffIcon onClick={() => setshowPass(true)} />
                    )}
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" color="primary" fullWidth type="submit">
              {type === "register" ? "Register" : "Login"}
            </Button>
          </FormControl>
        </form>
      </div>
    </section>
  );
};

export default UserForm;
