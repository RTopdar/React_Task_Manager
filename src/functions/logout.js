export default function logout() {
    const expiresIn = localStorage.getItem("expiresIn");
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
  
    console.log("expiresIn:", expiresIn);
    console.log("token:", token);
    console.log("userId:", userId);
  
    // Check if all values are present
    if (expiresIn && token && userId) {
      const currentTime = Math.floor(Date.now() / 1000);
      console.log("currentTime:", currentTime);
      console.log("expiresIn < currentTime:", parseInt(expiresIn) < currentTime);
  
      // Check if expiresIn is less than the current time
      if (parseInt(expiresIn) < currentTime) {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("expiresIn");
        window.localStorage.removeItem("userId");
        window.location.href("/", "_self");
      }
    } else {
      // If any value is missing, log out
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("expiresIn");
      window.localStorage.removeItem("userId");
      window.location.href("/", "_self");
    }
  }