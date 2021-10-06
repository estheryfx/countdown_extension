let totalTime = 0;
let parseStatus = 0;

/**
 * Set timer
 */
setInterval(function () {
    if (totalTime > 0 && parseStatus === 0) {
        totalTime--;
    }
}, 1000);


$(function () {
    checkCountTime();

    //Listen click event
    $(document).on('click', '#start', function () {
        _start();
    });
    $(document).on('click', '#parse', function () {
        _parse();
    });
    $(document).on('click', '#restart', function () {
        _restart();
    });
    $(document).on('click', '#cancel', function () {
        _cancel();
    });
});


/**
 * Check if the background.js is running
 */
function checkCountTime() {
    chrome.runtime.sendMessage({
        doSth: "查询",
    }, function (response) {
        if ((response.totalTime !== '' && typeof response.totalTime !== "undefined" && response.totalTime > 0) ||
            (response.totalTime === '' && response.minute === '' && response.second === '')) {
            totalTime = response.totalTime;
            parseStatus = response.parseStatus;
            $('#minute').val(response.minute);
            $('#second').val(response.second);
            showBox();
        }
    })
}

/**
 * Display timer
 */
function showBox() {
    setShowBoxHtml();
    let clock = setInterval(function () {
        setShowBoxHtml();
        if (totalTime <= 0) {
            clearInterval(clock);
        }
    }, 1000)
}

/**
 * 设置倒计时显示
 */
function setShowBoxHtml() {
    $('#showbox').html(PrefixInteger(Math.floor(totalTime / 60), 2) + ':' + PrefixInteger(totalTime % 60, 2));
}

/**
 * 点击开始按钮，给background.js发送需要计时的时间
 * @private
 */
function _start() {
    const minute = $('#minute').val()
    const second = $('#second').val()
    if ((minute === '' || typeof minute === "undefined") && (second === '' || typeof second === "undefined")) {
        alert('Please enter time')
    } else {
        chrome.runtime.sendMessage({
            doSth: "开始",
            minute: minute,
            second: second,
        }, function () {
            checkCountTime();
        })
    }
}

function _parse() {
    chrome.runtime.sendMessage({
        doSth: "暂停",
    }, function () {
        checkCountTime();
    })
}

function _restart() {
    chrome.runtime.sendMessage({
        doSth: "恢复计时",
    }, function () {
        checkCountTime();
    })
}

function _cancel() {
    chrome.runtime.sendMessage({
        doSth: "取消",
    }, function () {
        checkCountTime();
    })
}

/**
 * 数字前面自动补零
 * num传入的数字，n需要的字符长度
 * @param num
 * @param n
 * @returns {string}
 * @constructor
 */
function PrefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}