chrome.runtime.onMessage.addListener(({from, subject}, sender, response) => {
    if (from === "popup" && subject === "DOMInfo") {
        const buttons = document.evaluate(
            "//button",
            document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        if (buttons.snapshotLength === 0) {
            response({result: "No buttons found on this page."});
            return;
        }

        let resultHTML = "";
        for (let i = 0; i < buttons.snapshotLength; i++) {
            const xpath = getFullXPath(buttons.snapshotItem(i)).toLowerCase();
            resultHTML += "<li class=\"li-xpath\">" + `Button ${i + 1}: <br> ${xpath}` + "</li>";
        }

        response({result: resultHTML});
    }
});

function getFullXPath(element) {
    if (element.nodeType === Node.ELEMENT_NODE) {
        let elementTagName = element.tagName;
        let elementIndexInf = getIndexInformation(element);
        let elementIndex = elementIndexInf.index;
        let elementTwins = elementIndexInf.total;
        if (elementTwins > 1) {
            elementTagName = elementTagName + `[${elementIndex}]`;
        }
        return `${getFullXPath(element.parentNode)}/${elementTagName}`;
    } else {
        return "";
    }
}

/**
 * Return the total number of elements with the same tag name and the position of the element among them.
 *
 * @param element
 * @returns {{total: number, index: number}}
 */
function getIndexInformation(element) {
    const parentsChildren = element.parentNode.children;
    let index = 1;
    let findElement = false;
    let total = 0;
    for (let i = 0; i < parentsChildren.length; i++) {
        const child = parentsChildren[i];
        if (child.tagName === element.tagName) {
            if (child === element) {
                findElement = true;
            }
            if (findElement === false) {
                index++;
            }
            total++;
        }
    }
    return {
        "index": index,
        "total": total
    };
}
