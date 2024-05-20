import initApp from "./app";
import http from "http";

initApp().then((app) => {
  http.createServer(app).listen(process.env.PORT);
});
