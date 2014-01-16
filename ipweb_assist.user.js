// ==UserScript==
// @name       ipweb assist
// @namespace  https://github.com/yoshida-mediba/userscripts
// @version    0.1
// @description  ipweb assist
// @match      http://*/ip_web/scripts/NP010320.aspx*
// @copyright  2013+, You
// @require http://code.jquery.com/jquery-2.0.3.min.js
// ==/UserScript==

(function ($) {

    var matches = $('#btnCalcJitsudouJikan').parent().parent().parent()
        .children().children().next().html().match(/([0-9]{4})\/([0-9]{2})\/[0-9]{2}/);
    var store = matches[1] + "-" + matches[2];

    try{
        matches = $('*[name=btnHenshuu0]').parent().parent()
            .children().html().match(/([A-Z]{2})-([0-9]{8})-([0-9]{3})/);
        if (matches) {
            var new_project = matches[1] + "-" + matches[2] + "-" + matches[3];
            GM_setValue(store, new_project);
        }
    } catch(e) {}

    var project = GM_getValue(store);
    if (project) {
        matches = project.match(/([A-Z]{2})-([0-9]{8})-([0-9]{3})/);
        if(matches){
            $('#txtProNo1').val(matches[1]);
            $('#txtProNo2').val(matches[2]);
            $('#txtProEdaNo').val(matches[3]);
        }
    }
    $('#txtKyukeiJikan').val("1:00");
    matches = $('#btnCalcJitsudouJikan').parent().html().match(/&nbsp;([0-9]{1,2}:[0-9]{2})/);
    if (matches) {
        $('#txtSagyoJikan').val(matches[1]);
    }

})(jQuery);
