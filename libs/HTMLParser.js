var Cheerio = require("cheerio")
var underscore = require("underscore")
var Request = require("request")
var Url = require("url")

var Module = {}

function parseUrl(url) {
	if ( url.indexOf("http") < 0 ) {
		url = "http://"+url
	}
	return new Promise(function( resolve,reject){
		Request(url,function(err,response,body){
			console.log(body)
			if ( !body ) {
				resolve("")
			} else {
				resolve( parseHtml( body ))
			}
		})	
	})
	
}

function parseHtml(str){

	var $ = Cheerio.load(str)
	var $body = $("body")
	$body.find("script").each(function ( idx, element ) {
		$(this).remove()
	})
	$body.find("link").each(function ( idx, element ) {
		$(this).remove()
	})
	$body.find("style").each(function ( idx, element ) {
		$(this).remove()
	})
	return $body.text();
}

Module.parseHtml = parseHtml
Module.parseUrl = parseUrl
module.exports = Module