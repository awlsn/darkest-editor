const fs = require("fs");
const cheerio = require("cheerio");
var path = require("path");

function saveJson(jsonObj, saveLocation) {
  fs.writeFile(saveLocation, JSON.stringify(jsonObj), (err) => {
    if (err) {
      return console.log(err);
    }
    return console.log("The file was saved to " + path.resolve(saveLocation));
  });
}

let buffsOutputFile = "./output/buffs.json";
let trinketsOutputFile = "./output/trinkets.json";
//let trinketsOutputFile = "../../client/public/data/trinkets.json";
//let buffsOutputFile = "../../client/public/data/buffs.json";

let data;
data = fs.readFileSync("data/miscellaneous.string_table.xml", "utf8");
const $ = cheerio.load(data);

data = fs.readFileSync("data/buffsbase.buffs.json");
const buffs = JSON.parse(data);

data = fs.readFileSync("data/base.entries.trinkets.json");
const trinkets = JSON.parse(data);

if (!fs.existsSync(buffsOutputFile)) {
  buffs.forEach((buff, i) => {
    let thisId = `#buff_stat_tooltip_${buff.stat_type}`;
    if (buff.stat_sub_type !== "") {
      thisId = `#buff_stat_tooltip_${buff.stat_type}_${buff.stat_sub_type}`;
    }

    if ($(thisId).length > 0) {
      let thisStr = $(thisId)[0].children[0].data;
      let cdataStr = thisStr.replace(/(CDATA)|[\<\!\[\]]/g, "");
      let subStr;

      if (buff.amount > 0) {
        subStr = cdataStr.replace(
          /\%\+d\%/g,
          "+" + Math.round(buff.amount * 100)
        );
        subStr = subStr.replace(/\%\+d/g, "+" + Math.round(buff.amount));
      } else {
        subStr = cdataStr.replace(/\%\+d\%/g, Math.round(buff.amount * 100));
        subStr = subStr.replace(/\%\+d/g, Math.round(buff.amount));
      }

      // let htmlStr = subStr.replace(
      //   /(\{)|(\})|(colour_start\|)|(colour_end)/,
      //   "$1<$2>$3span class=$4/span"
      // );
      let htmlStr = subStr.replace(/\{colour_start/, "&nbsp;<span");
      htmlStr = htmlStr.replace(/\{colour_end\}/, "</span>&nbsp;");
      htmlStr = htmlStr.replace(/\|(\w*)\}/, ' class="$1">');
      //console.log(htmlStr);
      buff.htmlText = htmlStr;
      //console.log(i + " / " + buffs.length, "buffs completed.");
      let percentComplete = (i / buffs.length) * 100;
      percentComplete = percentComplete.toFixed(2);
      process.stdout.write(
        i +
          " / " +
          buffs.length +
          " (" +
          percentComplete +
          "%) buffs completed. \r"
      );
    }
  });
  saveJson(buffs, buffsOutputFile);
}

//save the new buffs.json file

//console.log(buffs);

// let thisStr = $("#buff_stat_tooltip_stress_dmg_received_percent_hunger")[0]
//   .children[0].data;
// console.log(thisStr.replace(/(CDATA)|[\<\!\[\]]/g, ""));

//%+d%% {colour_start|stress}Stress{colour_end} from hunger
// need to convert this to an object? or just a span?
/*
    htmlText: `${amount}% <span class="color-stress">Stress</span> from hunger`
*/
// example buff object
/* {
    "id": "never_again_affliction",
    "stat_type": "resolve_check_percent",
    "stat_sub_type": "",
    "amount": -0.25,
    "duration_type": "quest_end",
    "duration": 1,
    "remove_if_not_active": false,
    "rule_type": "always",
    "is_false_rule": false,
    "rule_data": {
      "float": 0,
      "string": ""
} */
if (!fs.existsSync(trinketsOutputFile)) {
  trinkets.forEach((trinket, i) => {
    //console.log(trinket);
    let thisId = `#str_inventory_title_trinket${trinket.id}`;
    //get each title by id and save new file
    if ($(thisId).length > 0) {
      let thisStr = $(thisId)[0].children[0].data;
      let cdataStr = thisStr.replace(/(CDATA)|[\<\!\[\]]/g, "");
      trinket.title = cdataStr;
      //console.log(cdataStr);
    }
    //console.log(i + " / " + trinkets.length, "trinkets completed.");

    let percentComplete = (i / trinkets.length) * 100;
    percentComplete = percentComplete.toFixed(2);
    process.stdout.write(
      i +
        " / " +
        trinkets.length +
        " (" +
        percentComplete +
        "%) buffs completed. \r"
    );
  });
  saveJson(trinkets, trinketsOutputFile);
}

// kickstarter items have a special localization file

// how to get it back into original format?
// may want to avoid changing names for now. parsing and reparsing that giant xml file may be a nightmare
// consider making a desktop app?
