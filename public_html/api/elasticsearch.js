const elasticsearch = require('elasticsearch');

var indexName = 'books';
var type = 'book';
var port = process.env.ES_PORT || 9200;
var host = process.env.ES_HOST || 'localhost';
var elasticClient = new elasticsearch.Client({ host: { host, port }, log: 'info' });

// Check Index Exist
function indexExists() {
    
    return elasticClient.indices.exists({
        index: indexName
    });

}
exports.indexExists = indexExists;

// Create New Index
function initIndex() {

    return elasticClient.indices.create({
        index: indexName
    });

}
exports.initIndex = initIndex;

// Delete Index
function deleteIndex() {
    
    return elasticClient.indices.delete({
        index: indexName
    });

}
exports.deleteIndex = deleteIndex;


// Initialize Mapp
function initMapping() {

    return elasticClient.indices.putMapping({
        index: indexName,
        type: type,
        body: {
            properties: {
                title: { type: "text" },
                content: { type: "text" }
            }
        }
    });

}
exports.initMapping = initMapping;

// Create First Entry
async function createFirstEntry() {

    return await elasticClient.create({
        index: indexName,
        type: type,
        id: 1,
        body: {
            title: 'C++',
            content: 'C++ is a object oriented programming language'
        }
    });

}
exports.createFirstEntry = createFirstEntry;

// Add Book to Index
async function addBook(book) {
    
    return await elasticClient.index({
        index: indexName,
        type: type,
        id: book.id,
        body: {
            title: book.title,
            content: book.content
        }
    });

}
exports.addBook = addBook;

// Update a Book Information
async function updateBook(book) {

    return  await client.update({
        index: indexName,
        type: type,
        id: book.id,
        body: {
            title: book.title,
            content: book.content
        }
    });

}
exports.updateBook = updateBook;

// Get Total Number of Books
async function getTotalItems() {

    return await elasticClient.count({
        index: indexName
    });

}
exports.getTotalItems = getTotalItems;

// Get Total Number of Books in a Term
async function getNumberItems(input) {
     
     console.log(getTotalItems());

    return await elasticClient.count({
        index: indexName,
        body: {
            query: {
                filtered: {
                filter: {
                    terms: {
                            title: [input]
                        }
                    }
                }
            }
        }
    });

}
exports.getNumberItems = getNumberItems;

// Search Keyword
async function searchKeyword(term) {
    
    return await elasticClient.search({
        index: indexName,
        q: 'title:'+term
    });

    // Another Way
    /*return await client.search({
        index: indexName,
        body: {
            query: {
                match: {
                    title: term
                }
            }
        }
    });*/

}
exports.searchKeyword = searchKeyword;