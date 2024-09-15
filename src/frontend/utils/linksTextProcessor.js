

export let processText = async (textToProcess) => {
  let inpText = textToProcess;
  let outText = inpText;
  let linkHtml;
  for (const j of inpText.matchAll(/\[\[(.*?)\]\]/g)) {
    let i = j[0];
    let noteName = i.replaceAll(/\[|\]|/g, "");

    linkHtml = `<a onclick="window.openNoteByName('` + noteName + `')">` + noteName + "</a>";

    outText = outText.replace(i, linkHtml);
  }
  return outText;
};