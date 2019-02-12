var express = require('express');
var router = express.Router();

var elastic = require('../elasticsearch');

router.get('/search/:input', function (req, res, next) {

    elastic.searchKeyword(req.params.input).then(function (result) {

        res.json(result);

    });

});


/* POST document to be indexed */
router.post('/', function (req, res, next) { 

	elastic.addBook(req.body).then(function (result) { 

		res.json(result);

	});

});

// For Testing Purpose
router.get('/populate', function (req, res, next) {  
	
	elastic.indexExists().then(function (exists) {  
	  
		if (exists) {
			return elastic.deleteIndex();
		}

	}).then(function () {
		
		return elastic.initIndex().then(elastic.initMapping).then(function () {
			var count = 1;	
			//var response = [];
			var promises = [
				'C',
				'C++',
				'Java',
				'GO',
				'Node JS',
				'Ruby',
				'Thing Explainer',
				'The Internet Is a Playground',
				'The Pragmatic Programmer',
				'The Hitchhikers Guide to the Galaxy',
				'Trial of the Clone'
			].map(function (bookTitle) {
				
				//elastic.createFirstEntry();

				return elastic.addBook({
					id: count++,
					title: bookTitle,
					content: bookTitle + " content"
				});

			});

			//console.log(promises);	
			//var response1 = elastic.searchKeyword('Thing');
			///console.log(response1);
			//res.json(response);

			return Promise.all(promises);

		});

	});

});


router.get('/search/:input', function(req, res, next) {

	var data = elastic.searchKeyword(req.params.input);
	console.log(data);
	return data;
	
});


module.exports = router;
