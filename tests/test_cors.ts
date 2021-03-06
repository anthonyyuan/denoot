import Denoot from "../mod.ts";

const app = Denoot.app(8000, "0.0.0.0", ({ localhostURL }) => console.log(`Listening on ${localhostURL}`))

app.use(Denoot.cors([
    "https://www.google.se",
    "http://app.localhost:8080",
    "http://api.localhost:8080"
]));

app.get("/what", (req, res) => {
    res.send("woah");
});