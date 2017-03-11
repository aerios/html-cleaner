var fs = require("fs")
var Promise = require("bluebird")
var phantom = require('phantom');
var underscore = require("underscore")
var Crypto  = require("crypto")
var tmpDir = __dirname+"/../tmp/"


function createHash(str){
	return Crypto.createHash('sha1').update(JSON.stringify(str)).digest('hex')
}

function createTemporaryFile(str){
	var fileName = createHash(str) + ".html"
	var filePath = [tmpDir,fileName].join("/")
	var realStr = str
	return new Promise(function(resolve,reject){
		fs.writeFile(filePath,realStr,function(err){
			if ( err ) reject(err)
			else resolve(filePath)
		})
	})
}

function renderToPng(str,outputPath){
	return new Promise(function(resolve,reject){
		
		createTemporaryFile(str)
		.then(function(tmpFilePath){
			var ghost = null
			phantom.create()
			.then(function(instance){
				ghost = instance
				return ghost;
			})
			.then(function(ghost){
				return ghost.createPage()
			})
			.then(function(page){
				return page
				.property("viewportSize",{width:800,height:600})
				.then(function(){
					return page.open(tmpFilePath)
				})
				.then(function(){
					return page.render(outputPath,{format:"png",quality:100})
				})
				.then(function(result){
					console.log("Rendered!",result)
					// fs.unlink(tmpFilePath)
					ghost.exit()
					resolve()
				})
				.catch(function(reason){
					console.log(reason)
					reject(reason)
				})
			})
		}).catch(function(err){
			reject(err)
		})		
	})	
}

module.exports = {
	render : function(htmlStr,outputPath){
		return renderToPng(htmlStr,outputPath)
		
	}
}
