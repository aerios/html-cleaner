var Cheerio = require("cheerio")
var underscore = require("underscore")

var Module = {}

function parseHtml(str){
	var $ = Cheerio.load(str)
	var $body = $("body")
	$body.find("script").each(function ( idx, element ) {
		$(this).remove()
	})
	$body.find("stylesheet").each(function ( idx, element ) {
		$(this).remove()
	})
	return $body.text();
}

Module.parse = parseHtml
module.exports = Module