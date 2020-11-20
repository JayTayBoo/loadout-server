require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const pool = require("./db")

const app = express();

const morganOption = NODE_ENV === "production";

// MiddleWare
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

function getAttach(attachments){
  let attach = [];
  // if (!attachments.compatible_barrel){
  //   return (attachments)
  // }
  // else {
    attach.push(Math.floor(Math.random() * (attachments.compatible_muzzle.length)))
    return attach;
  // }
};

// Routes
app.get("/loadout", async (req, res) => {
  try{
    // get primary weapon and attachments
    const primaryWeapon = await pool.query(`SELECT * FROM weapons WHERE id = ${Math.floor(Math.random() * 45) + 1}`)
    const primaryCompatible = await pool.query (`SELECT * FROM compatibility WHERE weapon_id = '${primaryWeapon.rows[0].weapon_id}'`)
    // const primaryAttach = getAttach(primaryCompatible.rows[0])
    // get secondary weapon and attachments
    const secondaryWeapon = await pool.query(`SELECT * FROM weapons WHERE id = ${(Math.floor(Math.random() * 13) + 1) + 45}`)
    const secondaryCompatible = await pool.query (`SELECT * FROM compatibility WHERE weapon_id = '${secondaryWeapon.rows[0].weapon_id}'`)
    // get random perks
    const perk1 = await pool.query (`SELECT * FROM perks WHERE id = '${Math.floor(Math.random() * 6) + 1}'`)
    const perk2 = await pool.query (`SELECT * FROM perks WHERE id = '${(Math.floor(Math.random() * 6) + 1) + 6}'`)
    const perk3 = await pool.query (`SELECT * FROM perks WHERE id = '${(Math.floor(Math.random() * 6) + 1) + 12}'`)
    // get random equipment
    const lethal = await pool.query (`SELECT * FROM equipment WHERE id = '${Math.floor(Math.random() * 8) + 1}'`)
    const tactical = await pool.query (`SELECT * FROM equipment WHERE id = '${(Math.floor(Math.random() * 8) + 1) + 8}'`)
  res.json( {
    primary: {primaryName: `${primaryWeapon.rows[0].weapon_name}`, primaryImg: `${primaryWeapon.rows[0].weapon_id}.png`, attachments: [`Tac Laser`, `Operator Reflex Sight`, `No Stock`, `60 Round Mags`, `Fast Melee`]},
    secondary: {secondaryName: `${secondaryWeapon.rows[0].weapon_name}`, secondaryImg: `${secondaryWeapon.rows[0].weapon_id}.png`, attachments: [`Tac Laser`, `Operator Reflex Sight`, `Lightweight Trigger`, `21 Round Mags`, `Fast Melee`]},
    perk1: {perk1Name: `${perk1.rows[0].perk_name}`, perk1Img: `${perk1.rows[0].perk_id}.png`},
    perk2: {perk2Name: `${perk2.rows[0].perk_name}`, perk2Img: `${perk2.rows[0].perk_id}.png`},
    perk3: {perk3Name: `${perk3.rows[0].perk_name}`, perk3Img: `${perk3.rows[0].perk_id}.png`},
    lethal: {lethalName: `${lethal.rows[0].equipment_name}`, lethalImg: `${lethal.rows[0].equipment_id}.png`},
    tactical: {tacticalName: `${tactical.rows[0].equipment_name}`, tacticalImg: `${tactical.rows[0].equipment_id}.png`} 
  }
  );
  } catch (err) {
    console.error(err.message)
  }
});

    // `
    // primary: {primaryName: '${primaryWeapon.rows[0].weapon_name}', primaryImg: '${primaryWeapon.rows[0].weapon_id}.png', attachments: ['Tac Laser', 'Operator Reflex Sight', 'No Stock', '60 Round Mags', 'Fast Melee']},
    // secondary: {secondaryName: '${secondaryWeapon.rows[0].weapon_name}', secondaryImg: '${secondaryWeapon.rows[0].weapon_id}.png', attachments: ['Tac Laser', 'Operator Reflex Sight', 'Lightweight Trigger', '21 Round Mags', 'Fast Melee']},
    // perk1: {perk1Name: '${perk1.rows[0].perk_name}', perk1Img: '${perk1.rows[0].perk_id}.png'},
    // perk2: {perk2Name: '${perk2.rows[0].perk_name}', perk2Img: '${perk2.rows[0].perk_id}.png'},
    // perk3: {perk3Name: '${perk3.rows[0].perk_name}', perk3Img: '${perk3.rows[0].perk_id}.png'},
    // lethal: {lethalName: '${perk3.rows[0].perk_name}', lethalImg: '${perk1.rows[0].perk_id}.png'},
    // tactical: {tacticalName: '${perk3.rows[0].perk_name}', tacticalImg: '${perk1.rows[0].perk_id}.png'}
    // `

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
