const fetch = require("node-fetch");

const fetchPokemons = (pageNum = 1, cb) => {
    const offset = 10 * (pageNum - 1);
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${offset}`)
        .then(response => response.json())
        .then(data => {
            cb(data.results);
        });
}

exports.getPokemonList = (req, res, next) => {
    const pageNum = parseInt(req.params.page) || 1;
    const totalPages = Math.round(1118/10);
    fetchPokemons(pageNum, (pokemon) => {
        return res.render('pages/pa09', {
            title: 'Prove Assignment 09',
            path: '/pa09',
            data: pokemon,
            page: pageNum,
            totalPages
        });
    })
}