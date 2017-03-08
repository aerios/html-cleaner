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
			if ( !body ) {
				resolve("")
			} else {
				resolve( parseHtml( body ))
			}
		})	
	})
	
}

function cleanTrailingWhitespace( str ) {
	return str.replace(/[\n]{1,}/igm," ").replace(/[\t]{1,}/igm," ").replace(/[\r]{1,}/igm," ");
}

function parseHtml(str){

	var $ = Cheerio.load(str)
	var metadataList = []
	var $head = $("head")
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
	$head.find("meta").each( function( idx, element ) {
		var $item = $(this);
		var name = $item.attr("name")
		var content = $item.attr("content")
		var property = $item.attr("property")
		var realName = property ? property : name
		if ( realName )
		metadataList.push({
			name : realName,
			value : content
		})
	})
	var parsedBody = cleanTrailingWhitespace( $body.text() )
	return {
		metadata : metadataList,
		result : parsedBody
	}
}

Module.parseHtml = parseHtml
Module.parseUrl = parseUrl
module.exports = Module