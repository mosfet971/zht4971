

export let processText = async (textToProcess, semanticDateNumber) => {
  let inpText = textToProcess;
  let outText = inpText;
  let hubHtml;
  for (const j of inpText.matchAll(/\{\{(.*?)\}\}/g)) {
    let i = j[0];
    let noteName = i.replaceAll(/\{|\}|/g, "").trim();
    let displayText;
    let subsectionName = "";

    if (!noteName.includes("/")) {
      displayText = noteName.trim();
    } else {
      displayText = noteName.split("/")[0].trim();
      subsectionName = noteName.split("/")[1].trim();
      noteName = displayText;
    }

    displayText = displayText.replaceAll("->", "");

    if (!(subsectionName == "")) {
      hubHtml = `<a onclick="window.openNoteByName('` + noteName + `',` + semanticDateNumber + `)">Хаб: ` + displayText + " Подсекция: " + subsectionName + "</a>";
    } else {
      hubHtml = `<a onclick="window.openNoteByName('` + noteName + `',` + semanticDateNumber + `)">Хаб: ` + displayText + "</a>";
    }

    outText = outText.replace(i, hubHtml);
  }
  return outText;
};