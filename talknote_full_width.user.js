// ==UserScript==
// @name       talknote full width
// @namespace  http://github.com/oe-mediba/userscripts/
// @version    0.5
// @description  talknote が横幅固定なので横幅いっぱいに
// @match      https://company.talknote.com/*/*
// @copyright  2013+, y-oe@mediba.jp
// ==/UserScript==

// 追加CSSをheadに追加
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
        return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
// メッセージの文字サイズは14px->12pxに
// message_container非表示
// メニューの背景をCSSで定義
addGlobalStyle('\
/* フォントサイズ */ \
.tab_container .tab_content .message li.status p.message_text { font-size: 12px; } \
/* 各投稿のアクションとコメントを非表示に */ \
/*.tab_container .tab_content .message li.status .message_container { display: none; }*/ \
/* 左メニューの背景が画像なのでCSSで装飾 */ \
#left_nav .left_menu li a         { background-image: none; background-color: #fff; border: 1px #ccc solid; border-radius: 5px; } \
#left_nav .left_menu li a:hover   { background-image: none; background-color: #4682b4; } \
#left_nav .left_menu li a.active  { background-image: none; background-color: #4682b4; } \
#left_nav ul.left_menu li ul li a       { background-image: none; background-color: #fff; border: 1px #ccc solid; border-radius: 4px; } \
#left_nav ul.left_menu li ul li a:hover { background-image: none; background-color: #4682b4; } \
#left_nav ul.left_menu li ul li a.active { background-image: none; background-color: #4682b4; } \
#left_nav ul.left_menu li ul li.keyword a, #left_nav ul.left_menu li ul li.newKeyword a { display: inline; padding: 3px 5px;} \
/* 検索保存ボタン装飾 */ \
.keyword button, .newKeyword button { color:#fff; background-color: #4F4F4D; border: 1px #4F4F4D solid; border-radius: 3px; cursor: pointer;} \
/* 各投稿の開閉クリック可能エリアを可視化、灰色箇所クリックで開閉 */ \
.status {background-color:#f3f3f3;} \
.status * {background-color:#fff;} \
');

// jQuery使いたいけど chrome拡張機能へ D&D install する場合 require 使えないので
// http://stackoverflow.com/questions/2246901/how-can-i-use-jquery-in-greasemonkey-scripts-in-google-chrome
var load, execute, loadAndExecute;
load = function(a, b, c) {
    var d;
    d = document.createElement("script"), d.setAttribute("src", a), b != null && d.addEventListener("load", b), c != null && d.addEventListener("error", c), document.body.appendChild(d);
    return d
}, execute = function(a) {
    var b, c;
    typeof a == "function" ? b = "(" + a + ")();" : b = a, c = document.createElement("script"), c.textContent = b, document.body.appendChild(c);
    return c
}, loadAndExecute = function(a, b) {
    return load(a, function() {
        return execute(b)
    })
};

loadAndExecute("//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js", function() {

    /* アクション/コメント開閉機能 */
    var mo_timeout = false;
	// マウスオンでmessage_container表示
    $('#contents').on('mouseenter', 'li.status', function(event) {
        var $status = $(this);
        mo_timeout = setTimeout(function() {
            $status.find('.message_container').slideDown('slow');
        }, 1000);
    });
	// マウスアウトでmessage_container非表示
    $('#contents').on('mouseleave', 'li.status', function(event) {
        if (mo_timeout !== false) {
            clearTimeout(mo_timeout);
            mo_timeout = false;
        }
		//$(this).find('.message_container').slideUp('slow');
    });
    // クリックでmessage_container表示On/Off
    $('#contents').on('click', 'li.status:not(a)', function(event) {
        console.log('e:' + event.target.id);
        console.log('s:' + $(this).attr('id'));
        if (event.target.id === $(this).attr('id')) {
            $(this).find('.message_container').toggle();
        }
    });
    
    /* リサイズ機能 */
    // ウインドウサイズに合わせて横幅調整
    var resize = function() {
        width = $(window).width();
        // 全体の横幅を100%に
        $('#wrapper').css({'width': width + 'px'});
        // コンテナーの横幅を(全体-左ナビ)に
        $('#container').css({'width': (width - 250 - 20) + 'px'});
        // コンテンツの横幅を(全体-左ナビ-マージン)に
        $('#contents').css({'width': (width - 250 - 20 - 30) + 'px'});
        // タブ横幅調整
        $('#share .tab_list').css({'width': (width - 250 - 20 - 30) + 'px'});
        // 各投稿のコメント欄をワイルドに
        $("#contents").on('keyup focusin', function() {
            $(this).css("width", (width - 250 - 20 - 30 - 180) + 'px');
        });
        // コメント入力欄の横幅をワイルドに
        $('#message_text').css({'width': (width - 250 - 20 - 30) + 'px'});
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

    /* 検索保存機能 */
    // 記録済み検索取得
    var keywords = [];
    if (localStorage.keywords) {
        keywords = JSON.parse(localStorage.getItem('keywords'));
    } else {
        keywords = {'リリース': 1, 'テスト': 1};
        localStorage.setItem('keywords', JSON.stringify(keywords));
    }
    // 記録済み検索エリア追加
    $keywords = $('<ul>');
    for (var keyword in keywords) {
        var $keyword = $('<li id="keyword_' + keyword + '" class="keyword">').append('<a href="/mediba.jp/search/' + encodeURIComponent(keyword) + '/">' + keyword + '</a><button class="rmKeyword" data-keyword="' + keyword + '">－</button>');
        $keywords.append($keyword);
    }
	// 新規検索追加フォーム
    $keywords.append($('<li class="newKeyword"><input type="text" id="newKeyword"><button id="addKeyword">＋</button></li>'));
    $storedSearch = $('<ul>').append($('<li>').append('<a>検索</a>').append($keywords));
    $('.left_menu').append($storedSearch);
    // 検索追加
    $('#addKeyword').on('click', function() {
        var keyword = $('#newKeyword').val();
        $('#newKeyword').val('');
        keywords = JSON.parse(localStorage.getItem('keywords'));
        keywords[keyword] = 1;
        localStorage.setItem('keywords', JSON.stringify(keywords));
        var $keyword = $('<li id="keyword_' + keyword + '" class="keyword">').append('<a href="/mediba.jp/search/' + encodeURIComponent(keyword) + '/">' + keyword + '</a><button class="rmKeyword" data-keyword="' + keyword + '">－</button>');
        $(this).parent().before($keyword);
        console.log(keyword + ' add');
    });
    // 検索削除
    $('.left_menu').on('click', 'button.rmKeyword', function() {
        var keyword = $(this).attr('data-keyword');
        var keywords = JSON.parse(localStorage.getItem('keywords'));
        delete keywords[keyword];
        localStorage.setItem('keywords', JSON.stringify(keywords));
        $(this).parent().remove();
        console.log(keyword + ' remove');
    });

    /* 通知機能 */
    // 最新の通知したNewsの時間を返却
    var getNotifiedNewsTIme = function() {
    	var notifiedNewsTIme = localStorage.getItem('notifiedNewsTIme');
        return notifiedNewsTIme ? notifiedNewsTIme : 0;
    };
    // 最新の通知したNewsの時間を記録
    var setNotifiedNewTime = function(time) {
    	localStorage.setItem('notifiedNewsTIme', time);
    };
    // 通知機能が有効かどうか
    var havePermission = window.webkitNotifications.checkPermission();
    if (havePermission != 0) {
        // 通知機能が無効の場合、通知ONリンクを右上のナビに出す
        // onClickイベントでないと有効に出来ないらしい
        $notifyOnBtn = $('<li><a>通知ON</a></li>').on('click', function() {
            window.webkitNotifications.requestPermission();
            $(this).remove();
        });
        $('#header_cont_right ul').append($notifyOnBtn);
    }
    // NEWを押したら表示される最新5件のお知らせを元に通知
    // 前回通知したときから５件超えの新お知らせがあった場合、６件目以降は通知されません。
    var notifyLatest5 = function() {
        // 上が新しいのでreverseしてから順に通知
        $($('#new_at_header a').get().reverse()).each(function() {
            $news = $(this); 
	        var newsTime = $news.find('abbr').attr('title');
            console.debug(newsTime, getNotifiedNewsTIme(), newsTime <= getNotifiedNewsTIme());
            if (newsTime <= getNotifiedNewsTIme()) {
                // 通知済みなはず
                return;
            }
            setNotifiedNewTime(newsTime);
            var link = $news.attr('href');
        	var icon = $news.find('img').attr('src');
        	var body = $news.find('.message').text().trim() + "\n" + $news.find('.time').text().trim();
            notify(icon, body, link);
            //notify(icon, body);
        });
    };
    // chrome通知
    var notify = function(icon, body, link) {
        var havePermission = window.webkitNotifications.checkPermission();
        //console.debug(havePermission);
        if (havePermission == 0) {
            // 0 is PERMISSION_ALLOWED
            var notification = window.webkitNotifications.createNotification(
                    icon,
                    "Talknote",
                    body
            );
            notification.onclick = function() {
                if (typeof link !== 'undefined') {
                    var w = Math.min(990, $(window).width());
                    var h = $(window).height();
                    window.open(link, '', 'width='+w+',height='+h+',resizable=yes'); // 新規ウィンドウ開く
                } else {
            	    window.focus(); // tab をアクティブ
                	//$('#news_topic').show(); // お知らせを開く
                }
                this.cancel();
            };
            notification.show();
        }
    };
    setInterval(function() {
        $('#news_feed li').trigger('click'); // 一度開かないとお知らせが生成/更新されないため
        setTimeout(notifyLatest5, 200); // お知らせ開くまで少し時間がかかるかもなので遅延実行
    }, 1000 * 60 * 5); // 5min毎に通知確認

});
