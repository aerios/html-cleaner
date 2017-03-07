var Express = require("express")
var BodyParser = require("body-parser")
var sugar = require("sugar")
var underscore = require("underscore")
var  HTMLParser = require("./libs/HTMLParser")
var Server  = Express()
var REST_API_PORT = process.env.REST_API_PORT || 3000
Server.use(BodyParser.json())
Server.use(BodyParser.urlencoded( { extended : false }))
Server.listen(REST_API_PORT, function( ) {
	console.log("HTML Cleaner API is on in port",REST_API_PORT)
})

Server.post("/clean-html", function( req, res ) {
	var body = req.body
	var content = body.content
	var result = HTMLParser.parseHtml(content)
	res.json({
		result : result
	})
})

Server.post("/clean-url", function( req, res ) {
	var body = req.body
	var url = body.url
	HTMLParser.parseUrl(url)
	.then(function( result ) {
		res.json({
			result : result
		})
	})
	.catch(function( reason ) {
		res.status(500).json({
			error : reason + ""
		})
	})
})