// ==UserScript==
// @name       e-staffing auto login
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  e-staffing auto login
// @match      https://timecard2.e-staffing.ne.jp/000_002.cfm
// @copyright  2012+, You
// @require http://code.jquery.com/jquery-2.0.3.min.js
// ==/UserScript==

(function ($) {
    $('form input:eq(0)').val('hoge'); // 企業ID
    $('form input:eq(1)').val('foo'); // ユーザID
    $('form input:eq(2)').val('bar'); // パスワード
    Login(1)
})(jQuery);
