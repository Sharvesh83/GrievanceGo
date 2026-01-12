require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const connectDB = require("./DB/DB");
const cors = require("cors");
const { Grievance } = require("./Models/model");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.get("/api/info", async (req, res) => {
  try {
    const { userId } = req.query;
    let query = {};
    if (userId) {
      query = { userId: userId };
    }
    const comp = await Grievance.find(query).sort({ createdAt: -1 });
    // console.log("comp", comp); 
    res.status(200).json(comp);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error: "Something went wrong",
    });
  }
});

app.post("/api/addinfo", async (req, res) => {
  const {
    name,
    wardno,
    phoneno,
    arealimit,
    subject,
    department,
    address,
    description,
    userId,
    createdBy
  } = req.body;

  const dta = await Grievance.create({
    name,
    wardno,
    phoneno,
    arealimit,
    subject,
    department,
    address,
    description,
    userId,
    createdBy,
    createdOn: new Date(),
    resolvedOn: null,
    status: "In progress",
  });
  const bdta = await Grievance.find();
  res.status(201).json(bdta);
});

app.post("/api/addchat", async (req, res) => {
  const { id, chat } = req.body;

  const dta = await Grievance.updateOne(
    {
      _id: id,
    },
    {
      $push: { chats: chat },
    }
  );

  const dta2 = await Grievance.find();

  res.status(200).send(dta2);
});

app.patch("/api/updatestatus", async (req, res) => {
  const { id } = req.body;

  const dta = await Grievance.updateOne(
    {
      _id: id,
    },
    {
      resolvedOn: new Date(),
      status: "Resolved",
    }
  );

  const dta2 = await Grievance.find();

  res.status(200).send(dta2);
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
