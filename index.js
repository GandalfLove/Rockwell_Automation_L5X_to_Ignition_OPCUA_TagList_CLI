#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner";
import fs from "fs";
import csvtojson from "csvtojson";
import path from "path";

// Initialize Variables

let paramOne;
let paramTwo;
let paramThree;
let paramFour;
let jsonData;
let fileName;
let ext;
let file;
let csvPath;

//Wait Function
const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

// Displays animated banner with instructions to user

async function welcome() {
  const rainbowTitle = chalkAnimation.rainbow(
    "Rockwell Automation L5X CSV to Ignition OPC Tag List JSON Converter \n"
  );
  await sleep();
  rainbowTitle.stop();
  console.log(`${chalk.blue("HOW TO USE:")}
  This program converts aL5X format CSV file to an ignition OPC format JSON tag list.
  Enter .csv path and necessary ignition parameters when prompted.
  JSON file will be generated in the same parent directory as index.js.`);
}

await welcome();

//Prompts user to enter a csv file path

async function askPath() {
  const pathAnswer = await inquirer.prompt({
    name: "csv_path",
    type: "input",
    message: "Enter L5X CSV File Path:",
  });
  csvPath = pathAnswer.csv_path.toString();
  file = path.basename(pathAnswer.csv_path);
  ext = path.extname(pathAnswer.csv_path);
  fileName = path.basename(file, ext); //File path is trimmed to filename only
}

await askPath();

//Converts csv data to json format using library
await csvtojson()
  .fromFile(csvPath)
  .then((jsonObj) => {
    jsonData = jsonObj;
  });

//converts json data to string

const jsonText = JSON.stringify(jsonData);

//Generates new JSON file in directory housing index.js

async function handleFile() {
  const spinner = createSpinner("Creating File...").start();
  await sleep();
  fs.writeFile(`${fileName}.json`, jsonText, (err) => {
    if (!err) {
      spinner.success();
      console.log(`${chalk.blueBright("File Created!")}`);
    }
  });
}

await handleFile();
