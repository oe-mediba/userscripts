// ==UserScript==
// @name       talknote full width
// @namespace  http://mediba.jp/~y-oe
// @version    0.1
// @description  talknote が横幅固定なので横幅いっぱいに
// @match      https://company.talknote.com/*/*
// @copyright  2013+, y-oe@mediba.jp
// @require http://code.jquery.com/jquery-2.0.3.min.js
// ==/UserScript==

// common function in css to change css style
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
// メッセージの文字サイズは14px->12pxに
// message_container非表示
// メニューの背景をCSSで定義
addGlobalStyle('\
.tab_container .tab_content .message li.status p.message_text { font-size: 12px; } \
.tab_container .tab_content .message li.status .message_container { display: none; } \
#left_nav .left_menu li a         { background-image: none; background-color: #fff; border: 1px #ccc solid; border-radius: 5px; } \
#left_nav .left_menu li a:hover   { background-image: none; background-color: #4682b4; } \
#left_nav .left_menu li a.active  { background-image: none; background-color: #4682b4; } \
#left_nav ul.left_menu li ul li a       { background-image: none; background-color: #fff; border: 1px #ccc solid; border-radius: 4px; } \
#left_nav ul.left_menu li ul li a:hover { background-image: none; background-color: #4682b4; } \
#left_nav ul.left_menu li ul li a.active { background-image: none; background-color: #4682b4; } \
');

(function ($) {
    // マウスエンターでmessage_container表示
    var mo_timeout = false;
    $('#contents').on('mouseenter', 'li.status', function(){
        var $status = $(this);
        mo_timeout = setTimeout(function() {
            $status.find('.message_container').slideDown('slow');
        }, 1000);
    });
    $('#contents').on('mouseleave', 'li.status', function(){
        if (mo_timeout !== false) {
            clearTimeout(mo_timeout);
        	mo_timeout = false;
        }
        //$(this).find('.message_container').slideUp('slow');
    });
    // クリックでmessage_container表示On/Off
    $('#contents').on('click', 'li.status', function(){
        $(this).find('.message_container').toggle();
    });

    var resize = function() {
        width = $(window).width();
        // 全体の横幅を100%に
        $('#wrapper').css({'width': width + 'px'});
        // コンテナーの横幅を(全体-左ナビ)に
        $('#container').css({'width': (width - 250 - 20)+ 'px'});
        // コンテンツの横幅を(全体-左ナビ-マージン)に
        $('#contents').css({'width': (width - 250 - 20 - 30)+ 'px'});
    };
    // 左ナビの横幅を拡大
    $('#left_nav').css({'width': '250px'});
    resize();
    
    // 右ナビを左ナビ下に移動
    $('#right_nav').appendTo('#left_nav');
    
    // 画面リサイズしたら再リサイズ
    var timer = false;
    $(window).resize(function() {
        if (timer !== false) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
            resize();
        }, 200);
    });
    

})(jQuery);

