import fs from "fs";

function cosinesim(A, B) {
    var dotproduct = 0;
    var mA = 0;
    var mB = 0;

    for (var i = 0; i < A.length; i++) {
        dotproduct += A[i] * B[i];
        mA += A[i] * A[i];
        mB += B[i] * B[i];
    }

    mA = Math.sqrt(mA);
    mB = Math.sqrt(mB);
    var similarity = dotproduct / (mA * mB);

    return similarity;
}

function dicesim(a, b) {
    const getBigrams = (str) => {
        const bigrams = [];
        for (let i = 0; i < str.length - 1; i++) {
            bigrams.push(str.slice(i, i + 2));
        }
        return bigrams;
    };

    const bigramsA = getBigrams(transliterateLatToCyr(a));
    const bigramsB = getBigrams(transliterateLatToCyr(b));
    //console.log(bigramsA, bigramsB);
    const setB = new Set(bigramsB);
    let intersection = [];
    for (const i of bigramsA) {
        if (setB.has(i)) {
            intersection.push(i);
        }
    }
    //const intersection = bigramsA.filter(bigram => setB.has(bigram));

    let out = (2 * intersection.length) / (bigramsA.length + bigramsB.length);

    return out ? (out > 1 ? 1 : out) : 0;
}

function transliterateLatToCyr(text) {
    const translitMap = {
        // Латинские символы (только базовый английский)
        'A': 'А', 'a': 'а',
        'B': 'Б', 'b': 'б',
        'C': 'К', 'c': 'к',
        'D': 'Д', 'd': 'д',
        'E': 'Е', 'e': 'е',
        'F': 'Ф', 'f': 'ф',
        'G': 'Г', 'g': 'г',
        'H': 'Х', 'h': 'х',
        'I': 'И', 'i': 'и',
        'J': 'Дж', 'j': 'дж',
        'K': 'К', 'k': 'к',
        'L': 'Л', 'l': 'л',
        'M': 'М', 'm': 'м',
        'N': 'Н', 'n': 'н',
        'O': 'О', 'o': 'о',
        'P': 'П', 'p': 'п',
        'Q': 'К', 'q': 'к',
        'R': 'Р', 'r': 'р',
        'S': 'С', 's': 'с',
        'T': 'Т', 't': 'т',
        'U': 'У', 'u': 'у',
        'V': 'В', 'v': 'в',
        'W': 'В', 'w': 'в',
        'X': 'Кс', 'x': 'кс',
        'Y': 'И', 'y': 'и',
        'Z': 'З', 'z': 'з',
    };

    return text.split('').map(char => translitMap[char] || char).join('');
}


class TagSearchToolkit {
    modelBigramsArrays = [];
    modelBigramsLengths = [];
    model = [[], []];
    getAllTagsEmbeddingsFunction = () => { };
    setAllTagsEmbeddingsFunction = () => { };
    getIndexListByTagStringFunction = () => { };
    setIndexListForTagStringFunction = () => { };

    constructor(/*fullJsonModelPath,*/ getAllTagsEmbeddingsFunction, setAllTagsEmbeddingsFunction, getIndexListByTagStringFunction, setIndexListForTagStringFunction) {
        //this.model = JSON.parse(fs.readFileSync(fullJsonModelPath, { encoding: "utf-8" }));
        this.model[0].push("");
        this.model[1].push([0, 0, 0]);

        for (const word of this.model[0]) {
            const bigrams = [];
            for (let i = 0; i < word.length - 1; i++) {
                bigrams.push(word.slice(i, i + 2));
            }
            this.modelBigramsArrays.push(bigrams);
            this.modelBigramsLengths.push(bigrams.length);
        }
        this.getAllTagsEmbeddingsFunction = getAllTagsEmbeddingsFunction;
        this.setAllTagsEmbeddingsFunction = setAllTagsEmbeddingsFunction;
        this.getIndexListByTagStringFunction = getIndexListByTagStringFunction;
        this.setIndexListForTagStringFunction = setIndexListForTagStringFunction;
    }

    getEmbedding = (inputString) => {
        let string1 = inputString.toLowerCase().trim();
        let strings = [];
        if (string1.includes(" ")) {
            strings = string1.split(" ");
        } else {
            strings = [string1];
        }

        let tempObjects = [];

        for (const string of strings) {
            const getBigrams = (str) => {
                const bigrams = [];
                for (let i = 0; i < str.length - 1; i++) {
                    bigrams.push(str.slice(i, i + 2));
                }
                return bigrams;
            };

            const word1Bigrams = getBigrams(string);

            const word1Set = new Set(word1Bigrams);
            const word1Length = word1Bigrams.length;

            let bestValue1 = 0, bestIndex1 = 0;

            for (let i = 0; i < this.model[0].length; i++) {
                const modelBigrams = this.modelBigramsArrays[i];
                const modelLen = this.modelBigramsLengths[i];

                let intersection1 = 0;
                for (let j = 0; j < modelLen; j++) {
                    if (word1Set.has(modelBigrams[j])) intersection1++;
                }

                const total1 = modelLen + word1Length;
                const value1 = total1 ? Math.min(1, (2 * intersection1) / total1) : 0;
                if (value1 > bestValue1) {
                    bestValue1 = value1;
                    bestIndex1 = i;
                }

            }

            tempObjects.push({ embedding: this.model[1][bestIndex1], quality: bestValue1 });
        }

        let finalObject = { embedding: [], quality: 1, string: string1 }

        if (tempObjects.length > 1) {
            let middleEmbedding = new Array(300).fill(0);
            for (const obj of tempObjects) {
                for (let i = 0; i < 300; i++) {
                    middleEmbedding[i] += obj.embedding[i];
                }
            }
            for (let i = 0; i < 300; i++) {
                middleEmbedding[i] /= tempObjects.length;
            }
            finalObject.embedding = middleEmbedding;

            let middleQuality = 0;
            for (const obj of tempObjects) {
                middleQuality += obj.quality;
            }
            middleQuality /= tempObjects.length;
            finalObject.quality = middleQuality;

        } else {
            finalObject.embedding = tempObjects[0].embedding;
            finalObject.quality = tempObjects[0].quality;
        }

        return finalObject;
    };

    getSimilarity = (embeddingObject1, embeddingObject2) => {
        if (embeddingObject1.string.trim() == embeddingObject2.string.trim()) {
            return 1;
        }

        let embedding1 = embeddingObject1.embedding;
        let embedding2 = embeddingObject2.embedding;

        let quality1 = embeddingObject1.quality;
        let quality2 = embeddingObject2.quality;

        let string1 = embeddingObject1.string;
        let string2 = embeddingObject2.string;

        let similarity = (cosinesim(embedding1, embedding2) * Math.min(quality1, quality2) + dicesim(string1, string2) * (1 - Math.min(quality1, quality2))) / 2;

        if (similarity > 1) similarity = 1;
        if (similarity < 0) similarity = 0;

        return similarity;
    };

    getTop20Similar = (embeddingObject, embeddingObjectsList) => {
        let similarityList = [];

        for (const obj of embeddingObjectsList) {
            let similarity = this.getSimilarity(embeddingObject, obj);
            similarityList.push({ string: obj.string, similarity: similarity });
        }

        similarityList.sort((a, b) => b.similarity - a.similarity);

        let top20 = [];

        for (let i = 0; i < 20; i++) {
            if (similarityList[i] !== undefined) {
                top20.push({ string: similarityList[i].string, similarity: similarityList[i].similarity });
            }
        }

        return top20;
    }

    getSortedDocIdsAndRatingsByListOfTops = (listOfTops) => {
        let extendedListOfTops = [];

        for (let i = 0; i < listOfTops.length; i++) {
            extendedListOfTops[i] = listOfTops[i];
        }

        for (let i = 0; i < extendedListOfTops.length; i++) {
            //let top = extendedListOfTops[i];

            for (let j = 0; j < extendedListOfTops[i].length; j++) {
                //let tagResultObject = extendedListOfTops[i][j];
                (extendedListOfTops[i][j]).docIdsList = this.getIndexListByTagStringFunction(extendedListOfTops[i][j].string);
            }
        }
        let setOfDocIds = [];

        for (let i = 0; i < extendedListOfTops.length; i++) {
            for (let j = 0; j < extendedListOfTops[i].length; j++) {
                let docIdsList = extendedListOfTops[i][j].docIdsList;
                for (let k = 0; k < docIdsList.length; k++) {
                    if (!(setOfDocIds.indexOf(docIdsList[k]) > -1)) {
                        setOfDocIds.push(docIdsList[k]);
                    }

                }
            }
        }

        let docIdsWithRatings = [];
        for (const docId of setOfDocIds) {
            let docObj = { docId: docId, rating: 0 };

            for (const top of extendedListOfTops) {
                let maxSimilarity = 0;

                for (const tag of top) {
                    for (const docIdFromListOfTag of tag.docIdsList) {
                        if (docIdFromListOfTag == docId) {
                            if (tag.similarity > maxSimilarity) {
                                maxSimilarity = tag.similarity;
                            }
                        }
                    }

                }
                docObj.rating += maxSimilarity;
            }
            docIdsWithRatings.push(docObj);
        }


        docIdsWithRatings.sort((a, b) => b.rating - a.rating);

        return (docIdsWithRatings);

    }

    search = (inputTagsList) => {
        let inputTagsEmbeddings = [];

        for (const tag of inputTagsList) {
            let embeddingObject = this.getEmbedding(tag);
            inputTagsEmbeddings.push(embeddingObject);
        }

        let top20SimilarToInputTags = [];

        for (const embeddingObject of inputTagsEmbeddings) {
            let top20Similar = this.getTop20Similar(embeddingObject, this.getAllTagsEmbeddingsFunction());
            top20SimilarToInputTags.push(top20Similar);
        }

        let docIdsWithRatings = this.getSortedDocIdsAndRatingsByListOfTops(top20SimilarToInputTags);

        return docIdsWithRatings;
    }

    setTagOfDocument = (documentId, tagString) => {
        let tagEmbedding = this.getEmbedding(tagString);

        let allTagsEmbeddings = this.getAllTagsEmbeddingsFunction();

        let isExist = false;
        for (const oneFromExist of allTagsEmbeddings) {
            if (JSON.stringify(oneFromExist) == JSON.stringify(tagEmbedding)) {
                isExist = true;
                break;
            }
        }

        if (!isExist) {
            allTagsEmbeddings.push(tagEmbedding);
            this.setAllTagsEmbeddingsFunction(allTagsEmbeddings);
        }

        if (this.getIndexListByTagStringFunction(tagEmbedding.string) == undefined) {
            this.setIndexListForTagStringFunction(tagEmbedding.string, []);
        }

        if (!(this.getIndexListByTagStringFunction(tagEmbedding.string).includes(documentId))) {
            let newIndexList = this.getIndexListByTagStringFunction(tagEmbedding.string);
            newIndexList.push(documentId);
            this.setIndexListForTagStringFunction(tagEmbedding.string, newIndexList);
        }
    }

    removeAllTagsFromDocument = (documentId) => {
        let allTagsEmbeddings = this.getAllTagsEmbeddingsFunction();

        let tagEmbeddingObjects = [];
        for (const tag of allTagsEmbeddings) {
            if ((this.getIndexListByTagStringFunction(tag.string)).includes(documentId)) {
                tagEmbeddingObjects.push(tag);
            }
        }

        for (const tagEmbedding of tagEmbeddingObjects) {
            let newIndexList = this.getIndexListByTagStringFunction(tagEmbedding.string);
            newIndexList.splice(newIndexList.indexOf(documentId), 1);
            this.setIndexListForTagStringFunction(tagEmbedding.string, newIndexList);

            newIndexList = this.getIndexListByTagStringFunction(tagEmbedding.string);
            if (newIndexList.length == 0) {
                for (let i = 0; i < allTagsEmbeddings.length; i++) {
                    if (JSON.stringify(allTagsEmbeddings[i]) == JSON.stringify(tagEmbedding)) {
                        allTagsEmbeddings.splice(i, 1);
                        break;
                    }
                }
            }
        }

        this.setAllTagsEmbeddingsFunction(allTagsEmbeddings);
    }

    recalculateAllTagsEmbeddings = () => {
        let allTagsEmbeddings = this.getAllTagsEmbeddingsFunction();

        let newAllTagsEmbeddings = [];

        for (const tagEmbedding of allTagsEmbeddings) {
            let oldDocsList = this.getIndexListByTagStringFunction(tagEmbedding.string);
            let newTagEmbedding = this.getEmbedding(tagEmbedding.string);
            newAllTagsEmbeddings.push(newTagEmbedding);
            this.setIndexListForTagStringFunction(newTagEmbedding.string, oldDocsList);
        }

        this.setAllTagsEmbeddingsFunction(newAllTagsEmbeddings);
    }

}

export default TagSearchToolkit;