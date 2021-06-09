const https = require('https');
const ITEMS_PER_PAGE = 9;

const renderIndex = (req, res, data) => {
    var jsonData = data;
    const { query } = req;
    const { search } = query;
    const page = parseInt(query.page) || 1;
    const skip = (page - 1) * ITEMS_PER_PAGE
    const limit = page * ITEMS_PER_PAGE
    if (query && search) {
        jsonData = jsonData.filter(dataItem => dataItem.name.toUpperCase().indexOf(search.toUpperCase()) > -1)
    }
    res.render('pages/pa08', {
        title: 'Prove Assignment 08',
        path: '/pa08',
        data: jsonData.slice(skip, limit),
        page: page,
        totalPages: Math.ceil(jsonData.length / ITEMS_PER_PAGE),
        query: search || ''
    });

}

exports.processData = (req, res, next) => {
    var url = 'https://byui-cse.github.io/cse341-course/lesson03/items.json';

    https.get(url, (response) => {
        var data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });
        response.on('end', () => {
            global.data = JSON.parse(data);
            renderIndex(req, res, global.data)
        });
    }).on('error', (error) => {
        console.log(error);
    })

}

exports.getIndex = (req, res, next) => {
    renderIndex(req, res, global.data)
}