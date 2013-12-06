// ==UserScript==
// @name       talknote full width
// @namespace  http://mediba.jp/~y-oe
// @version    0.3
// @description  talknote が横幅固定なので横幅いっぱいに
// @match      https://company.talknote.com/*/*
// @copyright  2013+, y-oe@mediba.jp
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
.status {background-color:#f3f3f3;} \
.status * {background-color:#fff;} \
.tab_container .tab_content .message li.status p.message_text { font-size: 12px; } \
/*.tab_container .tab_content .message li.status .message_container { display: none; }*/ \
#left_nav .left_menu li a         { background-image: none; background-color: #fff; border: 1px #ccc solid; border-radius: 5px; } \
#left_nav .left_menu li a:hover   { background-image: none; background-color: #4682b4; } \
#left_nav .left_menu li a.active  { background-image: none; background-color: #4682b4; } \
#left_nav ul.left_menu li ul li a       { background-image: none; background-color: #fff; border: 1px #ccc solid; border-radius: 4px; } \
#left_nav ul.left_menu li ul li a:hover { background-image: none; background-color: #4682b4; } \
#left_nav ul.left_menu li ul li a.active { background-image: none; background-color: #4682b4; } \
#left_nav ul.left_menu li ul li.keyword a, #left_nav ul.left_menu li ul li.newKeyword a { display: inline; padding: 3px 5px;} \
.keyword button, .newKeyword button { color:#fff; background-color: #4F4F4D; border: 1px #4F4F4D solid; border-radius: 3px; cursor: pointer;} \
');

// jQuery使いたいけど chrome拡張機能へ D&D install する場合 require 使えないので
// http://stackoverflow.com/questions/2246901/how-can-i-use-jquery-in-greasemonkey-scripts-in-google-chrome
var load,execute,loadAndExecute;load=function(a,b,c){var d;d=document.createElement("script"),d.setAttribute("src",a),b!=null&&d.addEventListener("load",b),c!=null&&d.addEventListener("error",c),document.body.appendChild(d);return d},execute=function(a){var b,c;typeof a=="function"?b="("+a+")();":b=a,c=document.createElement("script"),c.textContent=b,document.body.appendChild(c);return c},loadAndExecute=function(a,b){return load(a,function(){return execute(b)})};

loadAndExecute("//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js", function() {

    // マウスエンターでmessage_container表示
    var mo_timeout = false;
    $('#contents').on('mouseenter', 'li.status', function(event){
        var $status = $(this);
        mo_timeout = setTimeout(function() {
            $status.find('.message_container').slideDown('slow');
        }, 1000);
    });
    $('#contents').on('mouseleave', 'li.status', function(event){
        if (mo_timeout !== false) {
            clearTimeout(mo_timeout);
        	mo_timeout = false;
        }
        //$(this).find('.message_container').slideUp('slow');
    });
    // クリックでmessage_container表示On/Off
    $('#contents').on('click', 'li.status:not(a)', function(event){
        console.log('e:' + event.target.id);
        console.log('s:' + $(this).attr('id'));
        if (event.target.id === $(this).attr('id')) {
        	$(this).find('.message_container').toggle();
        }
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
    
    var keywords = [];
    if (localStorage.keywords) {
    	keywords = JSON.parse(localStorage.getItem('keywords'));
    } else {
        keywords = {'リリース':1, 'テスト':1};
    	localStorage.setItem('keywords', JSON.stringify(keywords));
    }
    
    $keywords = $('<ul>');
    for (var keyword in keywords) {
        var $keyword = $('<li id="keyword_' + keyword + '" class="keyword">').append('<a href="/mediba.jp/search/' + encodeURIComponent(keyword) + '/">' + keyword + '</a><button class="rmKeyword" data-keyword="' + keyword + '">－</button>');
        $keywords.append($keyword);
    };
    $keywords.append($('<li class="newKeyword"><input type="text" id="newKeyword"><button id="addKeyword">＋</button></li>'));
    $storedSearch = $('<ul>').append($('<li>').append('<a>検索</a>').append($keywords));
    $('.left_menu').append($storedSearch);
    
    $('#addKeyword').on('click', function () {
    	var keyword = $('#newKeyword').val();
        $('#newKeyword').val('');
        keywords = JSON.parse(localStorage.getItem('keywords'));
        keywords[keyword] = 1;
    	localStorage.setItem('keywords', JSON.stringify(keywords));
        
        var $keyword = $('<li id="keyword_' + keyword + '" class="keyword">').append('<a href="/mediba.jp/search/' + encodeURIComponent(keyword) + '/">' + keyword + '</a><button class="rmKeyword" data-keyword="' + keyword + '">－</button>');
        $(this).parent().before($keyword);
        console.log(keyword + ' add');
    });
    $('.left_menu').on('click', 'button.rmKeyword', function () {
        var keyword = $(this).attr('data-keyword');
        var keywords = JSON.parse(localStorage.getItem('keywords'));
        delete keywords[keyword];
    	localStorage.setItem('keywords', JSON.stringify(keywords));
        
        $(this).parent().remove();
        console.log(keyword + ' remove');
    });
    
});
