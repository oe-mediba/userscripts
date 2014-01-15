// ==UserScript==
// @name       timepro auto login
// @namespace  https://github.com/yoshida-mediba/userscripts
// @version    0.1
// @description  e-staffing auto login
// @match      http://192.168.1.58/*
// @copyright  2013+, You
// @require http://code.jquery.com/jquery-2.0.3.min.js
// ==/UserScript==

(function ($) {
    // パスワード登録
    if (location.href == 'http://192.168.1.58/XGweb/login.asp') {
        document.forms.item(0).LoginID.value = 'foo'; // ユーザID
        document.forms.item(0).PassWord.value = 'bar'; // パスワード
        NewPassWordEnter(document.frmLOGIN);
    }

    // そしてログイン
    if (location.href == 'http://192.168.1.58/XGweb/Login.asp') {
        document.forms.item(0).NewPassWord.value = 'bar'; // 新パスワード
        document.forms.item(0).ConfirmPassWord.value = 'bar'; // (再入力)
        PassWordRegister(document.frmLOGIN);
    }

    // 出勤か退勤が押されたら戻る
    if (location.href == 'http://192.168.1.58/XGweb/page/XgwTopMenu.asp#') {
        history.back();
    }

    /* 状態を保持してなんとかかんとかやれたらいいな (つまりやらない) */
    // 出勤
    // if (location.href == 'http://192.168.1.58/XGweb/frame.asp') {
    //     frameBtm.PanchWindowOpen(1);
    // }
    // 退勤
    // if (location.href == 'http://192.168.1.58/XGweb/frame.asp') {
    //     frameBtm.PanchWindowOpen(1);
    // }
    // ログアウト
    // frameTop.Logout(document.form);

})(jQuery);
