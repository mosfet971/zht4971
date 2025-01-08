

export let processText = async (textToProcess, semanticDateNumber) => {
  let inpText = textToProcess;
  let outText = inpText;
  let hubHtml;
  for (const j of inpText.matchAll(/\{\{(.*?)\}\}/g)) {
    let i = j[0];
    let hubName = i.replaceAll(/\{|\}|/g, "").trim();
    let displayText;
    let subsectionName = "";

    if (!hubName.includes("/")) {
      displayText = hubName.trim();
    } else {
      displayText = hubName.split("/")[0].trim();
      subsectionName = hubName.split("/")[1].trim();
      hubName = displayText;
    }

    if (!(subsectionName == "")) {
      hubHtml = `<a onclick="window.openNoteByName('` + displayText + `',` + semanticDateNumber + `)">Хаб: ` + displayText + " Подсекция: " + subsectionName + "</a><br/>";
    } else {
      hubHtml = `<a onclick="window.openNoteByName('` + displayText + `',` + semanticDateNumber + `)">Хаб: ` + displayText + "</a><br/>";
    }

    outText = outText.replace(i, hubHtml);
  }
  return outText;
};