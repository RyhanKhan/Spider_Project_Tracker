import express from "express";
import bodyParser from "body-parser";
import _ from "lodash";
import mongoose from "mongoose";
const app = express();
const port = 3000;
let projects = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

await mongoose.connect('mongodb://localhost:27017/projectTrackerDB');
console.log("Database Connected");

const Schema = mongoose.Schema;

const projectSchema = new Schema({
  name: String,
  leader: String,
  description: String
});

const projectModel = mongoose.model("projects", projectSchema);


app.get("/", (req, res)=>{
  res.render("index.ejs", {
    ourProjects: projects
  });
});

app.get("/projects/:titleName", (req, res) => {
  const requestedTitleName = _.lowerCase(req.params.titleName);

  projects.forEach((project) => {
    const storedTitleName = _.lowerCase(project.ourProjectName);
    if (requestedTitleName === storedTitleName) {
      res.render("project.ejs", {
        projectTitle: project.ourProjectName,
        projectLeader: project.ourLeaderName,
        projectDescription: project.ourProjectDescription
      });
    }
  });
});

app.get("/compose", (req, res)=>{
  res.render("compose.ejs");
});
app.post("/compose", (req, res) => {
  const ourData = {
    ourProjectName: req.body.projectName,
    ourLeaderName: req.body.leaderName,
    ourProjectDescription: req.body.projectDescription
  };

  projects.push(ourData);
  console.log(ourData);

  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
