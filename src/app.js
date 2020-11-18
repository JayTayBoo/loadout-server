require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");

const app = express();

const morganOption = NODE_ENV === "production";

// MiddleWare
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

// Routes
app.get("/loadout", (req, res) => {
  res.json({
    primary: {primaryName: 'Kilo 141', primaryImg: 'ara.png', attachments: ['Tac Laser', 'Operator Reflex Sight', 'No Stock', '60 Round Mags', 'Fast Melee']},
    secondary: {secondaryName: 'X16', secondaryImg: 'handguna.png', attachments: ['Tac Laser', 'Operator Reflex Sight', 'Lightweight Trigger', '21 Round Mags', 'Fast Melee']},
    perk1: {perk1Name: 'Double Time', perk1Img: 'perk1a.png'},
    perk2: {perk2Name: 'Restock', perk2Img: 'perk2a.png'},
    perk3: {perk3Name: 'Tune Up', perk3Img: 'perk3a.png'},
    lethal: {lethalName: 'Claymore', lethalImg: 'lethala.png'},
    tactical: {tacticalName: 'Flash Grenade', tacticalImg: 'tacticala.png'}
  });
});

// Error Handler
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
