userscripts
===========
http://userscripts.org/about/installing

## talknote_full_width.user.js

* chrome は Tampermonkey で動作確認しています
* talknote_full_width_for_chrome.user.js は拡張機能へのD&Dで直接インストール可能
 * @require が使えないので別ファイルにしています
* firefox では未検証

### 概要
* talknote の画面は横幅固定であるが、横幅をウインドウサイズ最大になるようデザイン調整

### 変更点
* 画面の横幅を最大にして可変に
* 右ナビを左ナビの下に
* 各投稿の文字サイズを14pxから12pxに
* 初期表示で各投稿のアクションとコメントを非表示に
 * 各投稿マウスオン1秒で開く
 * クリックで開閉も可能

### 問題点
* 各投稿のコメントをクリックするとコメント欄が右寄せで小さくなる
 
