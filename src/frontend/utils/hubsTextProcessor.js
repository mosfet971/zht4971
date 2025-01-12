import * as linksTextProcessor from "./linksTextProcessor";

export let processText = async (textToProcess, semanticDateNumber) => {
  let inpText = textToProcess;
  let outText = inpText;
  for (const j of inpText.matchAll(/\{\{(.*?)\}\}/g)) {
    let i = j[0];
    let hubName = i.replaceAll(/\{|\}|/g, "").trim();
    let displayText;
    let hubHtml = "";
    let subsectionName = "";

    if (!hubName.includes("/")) {
      displayText = hubName.trim();
    } else {
      displayText = hubName.split("/")[0].trim();
      subsectionName = hubName.split("/")[1].trim();
      hubName = displayText;
    }

    let hubObject = await ipcRenderer.invoke("getHubByName", displayText);

    if (hubObject == "err") {
      outText = outText.replace(i, hubHtml);
      continue;
    }

    for (const k in hubObject) {
      for (const l in hubObject[k]) {
        hubObject[k][l] = (await ipcRenderer.invoke("getNoteObject", hubObject[k][l])).name;
      }
    }

    hubHtml += "<table style='width: 50em;'><tbody>";
    hubHtml += `<th colspan="2"><a onclick="window.openNoteByName('` + displayText + `',` + semanticDateNumber + `)">` + displayText + "</a></th>";

    let keys = [];
    for (const i in hubObject) {
      if (i == "") {
        keys.unshift(i);
      } else {
        keys.push(i);
      }
    }

    for (const k of keys) {
      if (hubObject[k].length > 0) {
        if (k == "") {
          hubHtml += `<tr><td colspan="2">\n<ul>`;
          for (const l of hubObject[k]) {
            hubHtml += `<li style="margin: 0.3em;">[[` + l + `]]</li>\n`;
          }
          hubHtml += "<ul></td></tr>";
        } else {
          hubHtml += `<tr><th>` + k + `</th><td>\n<ul>`;
          for (const l of hubObject[k]) {
            hubHtml += `<li style="margin: 0.3em;">[[` + l + `]]</li>\n`;
          }
          hubHtml += "</ul></td></tr>";
        }
      } else {
        continue;
      }
    }


    hubHtml += "</tbody></table>";

    hubHtml = await linksTextProcessor.processText(hubHtml, semanticDateNumber);

    /*
    if (!(subsectionName == "")) {
      hubHtml = `<a onclick="window.openNoteByName('` + displayText + `',` + semanticDateNumber + `)">Хаб: ` + displayText + " Подсекция: " + subsectionName + "</a><br/>" + JSON.stringify(hubObject) + "<br/>";
    } else {
      hubHtml = `<a onclick="window.openNoteByName('` + displayText + `',` + semanticDateNumber + `)">Хаб: ` + displayText + "</a><br/>" + JSON.stringify(hubObject) + "<br/>";
    }
    */

    outText = outText.replace(i, hubHtml);
  }
  return outText;
};