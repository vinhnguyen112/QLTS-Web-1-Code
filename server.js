require("dotenv").config();
const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");
const db = require("./src/config/db");

const app = express();

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "src/views/layouts"),

    partialsDir: [
      path.join(__dirname, "src/views/partials"),
      path.join(__dirname, "src/views/assets"),
      path.join(__dirname, "src/views/categories"),
      path.join(__dirname, "src/views/departments"),
      path.join(__dirname, "src/views/employees"),
    ],

    helpers: {
      eq: (a, b) => a === b,
      addOne: (index) => index + 1,
      formatCurrency: (value) => {
      return Number(value).toLocaleString("vi-VN");
      }
    },
  }),
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "src/public")));
app.use(express.static(path.join(__dirname, "public")));

const indexRouter = require("./src/routes/index");
app.use("/", indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server dang chay tai http://localhost:" + PORT);
});
