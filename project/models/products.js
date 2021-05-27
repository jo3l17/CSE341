const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);

// const fs = require('fs');
// const path = require('path');
// const p = path.join(path.dirname(process.mainModule.filename),
//     'data',
//     'products.json');

// const getProductsFromFile = cb => {
//     fs.readFile(p, (err, fileContent) => {
//         if (err) {
//             cb([])
//         } else {
//             cb(JSON.parse(fileContent));
//         }
//     })
// }

// module.exports = class Product {
//     constructor(productObj) {
//         this.id = Math.abs(Math.random());
//         this.title = productObj.title;
//         this.description = productObj.description;
//         this.price = productObj.price;
//         this.img = "https://source.unsplash.com/400x400/?product" + this.id
//     }
//     save() {
//         getProductsFromFile(products => {
//             products.push(this);
//             fs.writeFile(p, JSON.stringify(products), (err) => {
//                 console.log(err);
//             });
//         });

//     }
//     static fetchAll(cb) {
//         getProductsFromFile(cb);
//     }

//     static findById(id, cb) {
//         getProductsFromFile(products => {
//             const product = products.find(p => p.id == id);
//             cb(product);
//         })
//     }
// }