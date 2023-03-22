const click = document.getElementById('click');
const result = document.getElementById('result');

const setDOMInfo = info => {
    result.innerHTML = info.result;
};


document.addEventListener("DOMContentLoaded", function () {
    click.addEventListener('click', async () => {
        await chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {from: "popup", subject: "DOMInfo"}, setDOMInfo);
        });
    })
});


