var fs = require('fs');

var csv = require('fast-csv');

fs.createReadStream('poi.csv')
	.pipe(csv())
	.on('data',function(data){
		console.log(data);
		console.log('--------------------');
	})
	.on('end',function(data){
		console.log('Finished!!!');
	});