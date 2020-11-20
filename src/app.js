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

async function getAttachNames(filteredAttach){
  let attachNames=[]

  // This gets each attachment object from the database
  let attachItem1 = await pool.query (`SELECT * FROM attachments WHERE attachment_id = ${filteredAttach[0]}`)
  let attachItem2 = await pool.query (`SELECT * FROM attachments WHERE attachment_id = ${filteredAttach[1]}`)
  let attachItem3 = await pool.query (`SELECT * FROM attachments WHERE attachment_id = ${filteredAttach[2]}`)
  let attachItem4 = await pool.query (`SELECT * FROM attachments WHERE attachment_id = ${filteredAttach[3]}`)
  let attachItem5 = await pool.query (`SELECT * FROM attachments WHERE attachment_id = ${filteredAttach[4]}`)
  
  // This takes the attachment name out of the response object and puts it in an array
  attachNames[0] = attachItem1.rows[0].attachment_name
  attachNames[1] = attachItem2.rows[0].attachment_name
  attachNames[2] = attachItem3.rows[0].attachment_name
  attachNames[3] = attachItem4.rows[0].attachment_name
  attachNames[4] = attachItem5.rows[0].attachment_name

  return attachNames
}

// This function filters through the results from getAttach
function filterAttach(attach){
  let filteredAttach;
  // This filters out null values
  filteredAttach = attach.filter((obj) => obj );
  // This removes random attachments until there are 5 left
  for (i=filteredAttach.length; i > 5; i--){
    filteredAttach.splice(Math.floor(Math.random() * (filteredAttach.length)), 1)
  } 
  return getAttachNames(filteredAttach)
}

// This function gets one random attachment of every type
function getAttach(attachments){
  let attach = [];
  // Returns "No attachments" if there is not a result
  if (!attachments){
    return (["No Attachments!"])
  }
  else {
    attach.push(attachments.compatible_muzzle[Math.floor(Math.random() * (attachments.compatible_muzzle.length))])
    attach.push(attachments.compatible_barrel[Math.floor(Math.random() * (attachments.compatible_barrel.length))])
    attach.push(attachments.compatible_laser[Math.floor(Math.random() * (attachments.compatible_laser.length))])
    attach.push(attachments.compatible_optic[Math.floor(Math.random() * (attachments.compatible_optic.length))])
    attach.push(attachments.compatible_stock[Math.floor(Math.random() * (attachments.compatible_stock.length))])
    attach.push(attachments.compatible_underbarrel[Math.floor(Math.random() * (attachments.compatible_underbarrel.length))])
    attach.push(attachments.compatible_ammunition[Math.floor(Math.random() * (attachments.compatible_ammunition.length))])
    attach.push(attachments.compatible_grip[Math.floor(Math.random() * (attachments.compatible_grip.length))])
    attach.push(attachments.compatible_perk[Math.floor(Math.random() * (attachments.compatible_perk.length))])
    // Filter results down to 5 and return
    return filterAttach(attach);
  }
};

// Routes

// This route gets a Random Loadout from the Database and responds with a json file
app.get("/loadout", async (req, res) => {
  // This gets a primary weapon and attachments
  const primaryWeapon = await pool.query(`SELECT * FROM weapons WHERE id = ${Math.floor(Math.random() * 45) + 1}`)
  const primaryCompatible = await pool.query (`SELECT * FROM compatibility WHERE weapon_id = '${primaryWeapon.rows[0].weapon_id}'`)
  const primaryAttach = await getAttach(primaryCompatible.rows[0])

  // This gets a secondary weapon and attachments
  const secondaryWeapon = await pool.query(`SELECT * FROM weapons WHERE id = ${(Math.floor(Math.random() * 13) + 1) + 45}`)
  const secondaryCompatible = await pool.query (`SELECT * FROM compatibility WHERE weapon_id = '${secondaryWeapon.rows[0].weapon_id}'`)
  const secondaryAttach = await getAttach(secondaryCompatible.rows[0])


  // This gets 3 random perks
  const perk1 = await pool.query (`SELECT * FROM perks WHERE id = '${Math.floor(Math.random() * 6) + 1}'`)
  const perk2 = await pool.query (`SELECT * FROM perks WHERE id = '${(Math.floor(Math.random() * 6) + 1) + 6}'`)
  const perk3 = await pool.query (`SELECT * FROM perks WHERE id = '${(Math.floor(Math.random() * 6) + 1) + 12}'`)

  // This gets a random lethal and tactical
  const lethal = await pool.query (`SELECT * FROM equipment WHERE id = '${Math.floor(Math.random() * 8) + 1}'`)
  const tactical = await pool.query (`SELECT * FROM equipment WHERE id = '${(Math.floor(Math.random() * 8) + 1) + 8}'`)

  // This takes all the data above and formats it for the front-end 
  res.json( {
    primary: {primaryName: `${primaryWeapon.rows[0].weapon_name}`, primaryImg: `${primaryWeapon.rows[0].weapon_id}.png`, attachments: primaryAttach},
    secondary: {secondaryName: `${secondaryWeapon.rows[0].weapon_name}`, secondaryImg: `${secondaryWeapon.rows[0].weapon_id}.png`, attachments: secondaryAttach},
    perk1: {perk1Name: `${perk1.rows[0].perk_name}`, perk1Img: `${perk1.rows[0].perk_id}.png`},
    perk2: {perk2Name: `${perk2.rows[0].perk_name}`, perk2Img: `${perk2.rows[0].perk_id}.png`},
    perk3: {perk3Name: `${perk3.rows[0].perk_name}`, perk3Img: `${perk3.rows[0].perk_id}.png`},
    lethal: {lethalName: `${lethal.rows[0].equipment_name}`, lethalImg: `${lethal.rows[0].equipment_id}.png`},
    tactical: {tacticalName: `${tactical.rows[0].equipment_name}`, tacticalImg: `${tactical.rows[0].equipment_id}.png`}
    }
  );
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
