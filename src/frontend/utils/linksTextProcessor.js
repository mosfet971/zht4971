

export let processText = async (textToProcess, semanticDateNumber) => {
  let inpText = textToProcess;
  let outText = inpText;
  let linkHtml;
  for (const j of inpText.matchAll(/\[\[(.*?)\]\]/g)) {
    let i = j[0];
    let noteName = i.replaceAll(/\[|\]|/g, "");
    let displayText;

    if (noteName.includes("|")) {
      let parts = noteName.split("|");
      noteName = parts[0];
      displayText = parts[1];
    } else {
      displayText = noteName;
    }

    displayText = displayText.replaceAll("->", "");

    linkHtml = `<a onclick="window.openNoteByName('` + noteName + `',` + semanticDateNumber + `)">` + displayText + "</a>";

    outText = outText.replace(i, linkHtml);
  }
  return outText;
};