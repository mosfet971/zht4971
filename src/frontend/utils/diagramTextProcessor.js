import { D2 } from "@terrastruct/d2";

const d2 = new D2();

export let processText = async (textToProcess, semanticDateNumber) => {
    let inpText = textToProcess;
    let outText = inpText;
    for (const j of inpText.matchAll(/```d2((.|\n)*)```/g)) {
        let i = j[0];
        try {
            const result = await d2.compile(i.replaceAll("```d2", "").replaceAll("```", ""));
            const svg = await d2.render(result.diagram, result.renderOptions);

            let objectUrl = URL.createObjectURL(new File([new Blob([svg])], "diagram.svg", {type: "image/svg+xml"}));
            outText = outText.replace(i, '<img src="' + objectUrl + '"></img>');
        } catch (error) {
            outText = outText.replace(i, error);
        }
    }
    return outText;
};