let minute = '';
let second = '';
let totalTime = '';
let parseStatus = 0;

/**
 * Initialize
 */
function _init() {
    minute = '';
    second = '';
    totalTime = '';
    parseStatus = 0;
}

/**
 * Set Timer
 */
setInterval(function () {
    if (totalTime > 0 && parseStatus === 0) {
        totalTime--;
        if (totalTime <= 0) {
            _init();
            closeWindow();
        }
    }
}, 1000);


/**
 * background.js
 * Recieve message from popup.js
 */
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    //Set start timer
    if (message.doSth === "开始") {
        _init();
        if (message.minute !== '' && typeof message.minute !== "undefined") {
            minute = message.minute;
        }
        if (message.second !== '' && typeof message.second !== "undefined") {
            second = message.second;
        }
        totalTime = Number(minute * 60) + Number(second);
        parseStatus = 0;
        sendResponse({});
    }

    //Get result from background.js time result
    if (message.doSth === "查询") {
        sendResponse({
            minute: minute,
            second: second,
            totalTime: totalTime,
            parseStatus: parseStatus,
        })
    }

    //Pause
    if (message.doSth === "暂停") {
        parseStatus = 1;
        sendResponse({});
    }

    //Reset
    if (message.doSth === "恢复计时") {
        parseStatus = 0;
        sendResponse({});
    }

    //Cancel
    if (message.doSth === "取消") {
        _init();
        sendResponse({});
    }
});


/**
 * Shut down Window
 */
function closeWindow() {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.remove(tabs[0].id);
    });
}







