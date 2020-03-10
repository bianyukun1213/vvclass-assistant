var bg = chrome.extension.getBackgroundPage();
var isCurrentTabVVClass;
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('name').innerText = '亮眼助手 ' + bg.getVer();
    updateStatus();
    document.getElementById('enableBtn').addEventListener('click', function () {
        var input = prompt('启用口令：');
        if (input == null)
            return;
        if (bg.checkPwd(input)) {
            bg.enable();
            if (isCurrentTabVVClass) {
                alert('亮眼助手已启用！\n点击「确定」刷新以使更改生效。');
                chrome.tabs.reload({ 'bypassCache': true });
            } else
                alert('亮眼助手已启用！\n若您已打开房间页面，请刷新以使更改生效。');
            updateStatus();
        } else
            alert('口令错误！');
    });
    document.getElementById('disableBtn').addEventListener('click', function () {
        bg.disable();
        if (isCurrentTabVVClass) {
            alert('亮眼助手已停用！\n点击「确定」刷新以使更改生效。');
            chrome.tabs.reload();
        } else
            alert('亮眼助手已停用！\n若您已打开房间页面，请刷新以使更改生效。');
        updateStatus();
    });
    document.getElementById('nameChangeBtn').addEventListener('click', function () {
        var input = prompt('请谨慎使用！\n昵称：');
        var code = 'window.sessionStorage.setItem(\'vvroom.shinevv.nickName\',\'NAME\');';
        if (input == null)
            return;
        if (input != '') {
            chrome.tabs.executeScript({ code: code.replace('NAME', input) }, function () {
                alert('昵称已更改！\n点击「确定」刷新以使更改生效。');
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
                alert('角色已更改！\n点击「确定」刷新以使更改生效。');
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
                alert('房间已切换！\n点击「确定」刷新以使更改生效。');
                chrome.tabs.reload();
            });
            updateStatus();
        } else
            alert('无效的房间号！');
    });
});
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
    }, function (tab) {
        if (tab[0].url.startsWith('https://vvclass.shinevv.com/?s=#/room')) {
            isCurrentTabVVClass = true;
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
            isCurrentTabVVClass = false;
            document.getElementById('nameChangeBtn').disabled = 'disabled';
            document.getElementById('roleChangeBtn').disabled = 'disabled';
            document.getElementById('roomChangeBtn').disabled = 'disabled';
        }
    });
}