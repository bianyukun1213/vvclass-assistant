var bg = chrome.extension.getBackgroundPage();
var isCurrentTabVVClass;
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('name').innerText = '亮眼助手 ' + bg.getVer();
    var vvclassVer = bg.getVVClassVer();
    var jsVer = bg.getJSVer();
    if (vvclassVer != undefined && jsVer != undefined && vvclassVer != null && jsVer != null && vvclassVer != '' && jsVer != '')
        document.getElementById('vvclassVer').innerText = '适用于亮眼课堂 ' + bg.getVVClassVer() + '（JavaScript 脚本 ' + bg.getJSVer() + '）。';
    updateStatus();
    document.getElementById('enableBtn').addEventListener('click', function () {
        var input = prompt('启用口令：');
        if (input == null)
            return;
        if (bg.checkPwd(input)) {
            bg.enable();
            refresh();
            updateStatus();
        } else
            alert('口令错误！');
    });
    document.getElementById('disableBtn').addEventListener('click', function () {
        bg.disable();
        refresh();
        updateStatus();
    });
    document.getElementById('nameChangeBtn').addEventListener('click', function () {
        var input = prompt('请谨慎使用！\n昵称：');
        var code = 'window.sessionStorage.setItem(\'vvroom.shinevv.nickName\',\'NAME\');';
        if (input == null)
            return;
        if (input != '') {
            chrome.tabs.executeScript({ code: code.replace('NAME', input) }, function () {
                chrome.tabs.reload();
            });
            updateStatus();
        } else
            alert('无效的昵称！');
    });
    document.getElementById('roleChangeBtn').addEventListener('click', function () {
        var input = prompt('请谨慎使用！\n角色代码（教师：teacher、助教：tutor、巡课人员或管理员：admin、互动学生：student、旁听学生：visitor）：');
        var code = 'window.sessionStorage.setItem(\'vvroom.shinevv.role\',\'ROLE\');';
        if (input == null)
            return;
        if (input == 'teacher' || input == 'tutor' || input == 'admin' || input == 'student' || input == 'visitor') {
            chrome.tabs.executeScript({ code: code.replace('ROLE', input) }, function () {
                chrome.tabs.reload();
            });
            updateStatus();
        } else
            alert('无效的角色代码！');
    });
    document.getElementById('roomChangeBtn').addEventListener('click', function () {
        var input = prompt('请谨慎使用！\n房间号：');
        var code = 'window.sessionStorage.setItem(\'vvroom.shinevv.roomId\',\'ROOM\');window.sessionStorage.setItem(\'vvroom.shinevv.roomTitle\',\'房间\');';
        var reg = new RegExp('^[1-9][0-9]{0,4}$');
        if (input == null)
            return;
        if (reg.test(input)) {
            chrome.tabs.executeScript({ code: code.replace('ROOM', input) }, function () {
                chrome.tabs.reload();
            });
            updateStatus();
        } else
            alert('无效的房间号！');
    });
    document.getElementById('loginBtn').addEventListener('click', function () {
        var code = bg.loginJS;
        if (code != undefined)
            chrome.tabs.executeScript({ code: code });
        else
            alert('强制登录代码无效！');
    });
    chrome.tabs.onUpdated.addListener(function () {
        updateStatus();
    });
});
function refresh() {
    chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].url.startsWith('https://vvclass.shinevv.com/'))
                chrome.tabs.reload(tabs[i].id);
        }
    });
}
function updateStatus() {
    if (bg.checkStatus()) {
        document.getElementById('status').innerText = '状态：已启用';
        document.getElementById('enableBtn').disabled = 'disabled';
        document.getElementById('disableBtn').removeAttribute('disabled');
    }
    else {
        document.getElementById('status').innerText = '状态：已停用';
        document.getElementById('disableBtn').disabled = 'disabled';
        if (bg.checkConf())
            document.getElementById('enableBtn').removeAttribute('disabled');
        else
            document.getElementById('enableBtn').disabled = 'disabled';
    }
    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, function (tabs) {
        if (tabs[0].url.startsWith('https://vvclass.shinevv.com/'))
            isCurrentTabVVClass = true;
        else
            isCurrentTabVVClass = false;
        if (tabs[0].url == 'https://vvclass.shinevv.com/#/' || tabs[0].url == 'https://vvclass.shinevv.com/?s=#/') {
            if (bg.checkStatus())
                document.getElementById('loginBtn').removeAttribute('disabled');
            else
                document.getElementById('loginBtn').disabled = 'disabled';
        }
        else
            document.getElementById('loginBtn').disabled = 'disabled';
        if (tabs[0].url.startsWith('https://vvclass.shinevv.com/?s=#/room')) {
            if (bg.checkStatus()) {
                document.getElementById('nameChangeBtn').removeAttribute('disabled');
                document.getElementById('roleChangeBtn').removeAttribute('disabled');
                document.getElementById('roomChangeBtn').removeAttribute('disabled');
            } else {
                document.getElementById('nameChangeBtn').disabled = 'disabled';
                document.getElementById('roleChangeBtn').disabled = 'disabled';
                document.getElementById('roomChangeBtn').disabled = 'disabled';
            }
        }
        else {
            document.getElementById('nameChangeBtn').disabled = 'disabled';
            document.getElementById('roleChangeBtn').disabled = 'disabled';
            document.getElementById('roomChangeBtn').disabled = 'disabled';
        }
    });
}