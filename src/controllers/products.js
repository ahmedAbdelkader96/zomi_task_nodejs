const Product = require("../models/product");
const mongoose = require("mongoose");

async function get_products(req, res, next) {
  const searchQuery = req.query.q;

  let filter = {};
  if (searchQuery) {
    filter = { name: { $regex: searchQuery, $options: "i" } }; // Case-insensitive search
  }

  Product.find(filter)
    .exec()
    .then((docs) => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });

  // try {
  //   const database = client.db("test"); // replace with your database name
  //   const productsCollection = database.collection("products");
  //   const products = await productsCollection.find({}).toArray();
  //   res.status(200).json(products);
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).json({ error: err.message });
  // }
}

async function get_product(req, res, next) {
  const id = req.body.id;

  if (!id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }

  Product.findById(id)
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
}

async function create_product(req, res, next) {
  const name = req.body.name;
  const price = req.body.price;
  const image = req.body.image;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  if (!price) {
    return res.status(400).json({ message: "Price is required" });
  }
  if (!image) {
    return res.status(400).json({ message: "Image is required" });
  }

  const id = new mongoose.Types.ObjectId();
  const product = new Product({
    _id: id,
    name: name,
    price: price,
    image: image,
  });

  product
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
}

async function update_product(req, res, next) {




  const id = req.body.id;
  const name = req.body.name;
  const price = req.body.price;
  const image = req.body.image;


  if (!id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }
  if (!name && !price && !image) {
    return res.status(400).json({ message: "You must provide at least one param to update(name,price,image)" });
  }


  const updateOps = req.body;

  // Validate request body
  if (Object.keys(updateOps).length === 0) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  try {
    const result = await Product.findByIdAndUpdate(
      id,
      { $set: updateOps },
      { new: true }
    ).exec();
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "No valid entry found for provided ID" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
}

async function delete_product(req, res, next) {
  const id = req.body.id;

  if (!id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }

  Product.findByIdAndDelete(id)
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
}

module.exports = {
  get_products,
  get_product,
  create_product,
  update_product,
  delete_product,
};
