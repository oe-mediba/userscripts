// ==UserScript==
// @name       e-staffing auto login
// @namespace  https://github.com/oe-mediba/userscripts
// @version    0.2
// @description  e-staffing auto login
// @match      https://timecard2.e-staffing.ne.jp/*
// @copyright  2013+, You
// @require http://code.jquery.com/jquery-2.0.3.min.js
// ==/UserScript==

(function ($) {
    if (location.href == 'https://timecard2.e-staffing.ne.jp/000_002.cfm') {
        $('form input:eq(0)').val('foo'); // 企業ID
        $('form input:eq(1)').val('bar'); // ユーザID
        $('form input:eq(2)').val('hoge'); // パスワード
        Login(1);
    }
    if (location.href == 'https://timecard2.e-staffing.ne.jp/staff/001_003.cfm') {
    	MovePage(0);
    }
    $("input[type='button'][value='定時']").trigger('click');
})(jQuery);
