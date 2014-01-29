javascript:(function(){
var css=document.createElement('link');
css.rel='stylesheet';
css.href='https://raw.github.com/oe-mediba/userscripts/master/emojify/emojify.css';
css.type='text/css';
var js=document.createElement('script');
js.src='https://raw.github.com/oe-mediba/userscripts/master/emojify/emojify.min.js';
document.getElementsByTagName('head')[0].appendChild(js);
document.getElementsByTagName('head')[0].appendChild(css);
emojify.run();
})();
