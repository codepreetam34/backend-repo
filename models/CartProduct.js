var productSchema = new mongoose.Schema({
    category: String,
    name: String,
    price: Number,
    image: String,
    description: String,
    stock: Number,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectID, ref: 'Review'
        }
    ]
    })