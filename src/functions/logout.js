export default function logout() {
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("expiresIn");
  window.localStorage.removeItem("userId");
  window.open("/", "_self");
}
