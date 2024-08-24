import logout from "./logout";

export default function loginValidator() {
  const expiresIn = localStorage.getItem("expiresIn");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user");

  if (expiresIn && token && userId) {
    const currentTime = Math.floor(Date.now() / 1000);

    if (parseInt(expiresIn) < currentTime) {
      logout();
    }
  } else {
    logout();
  }
}
