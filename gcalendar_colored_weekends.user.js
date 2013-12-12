// ==UserScript==
// @name       Google Calendar colored weekends
// @namespace  http://malag.net/
// @version    0.1
// @description  Highlights weekend days in Google Calendar
// @copyright  2013 Erich Roncarolo, GPL license
// @include https://www.google.com/calendar/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// ==/UserScript==

$(document).ready(function() {
    $('<style> \
		.tg-weekend { background-color: #eeffee } \
    	#mvEventContainer .month-row td.st-bg:nth-child(1) {background-color: #ffeeee} \
    	#mvEventContainer .month-row td.st-bg:nth-child(7) {background-color: #eeeeff} \
		.st-c-pos, .cbrd, .cbrdcc, .evt-lk {font-size: smaller} \
	</style>').appendTo($('body'));
});
