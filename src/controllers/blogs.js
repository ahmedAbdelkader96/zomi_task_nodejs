const Blog = require("../models/blog");
const mongoose = require("mongoose");

async function get_blogs(req, res, next) {
  const searchQuery = req.query.q;

  let filter = {};
  if (searchQuery) {
    filter = { title: { $regex: searchQuery, $options: "i" } }; // Case-insensitive search
  }

  Blog.find(filter)
    .exec()
    .then((docs) => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        message: err,
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

async function get_blog(req, res, next) {
  const id = req.params.id;

  // if (!id) {
  //   return res.status(400).json({ message: "ID parameter is required" });
  // }

  Blog.findById(id)
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(400)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: err });
    });
}

async function create_blog(req, res, next) {
  const title = req.body.title;
  const description = req.body.description;
  const date = req.body.date;
  const image = req.body.image;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }
  if (!description) {
    return res.status(400).json({ message: "Description is required" });
  }
  if (!date) {
    return res.status(400).json({ message: "Date is required" });
  }
  if (!image) {
    return res.status(400).json({ message: "Image is required" });
  }

  const id = new mongoose.Types.ObjectId();

  const blog = new Blog({
    _id: id,
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    image: req.body.image,
  });

  blog
    .save()
    .then((result) => {
      res.status(200).json({
        message: "Created blog successfully",
        createdBlog: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        message: err,
      });
    });
}

async function update_blog(req, res, next) {
  const id = req.params.id;

  // const title = req.body.title;
  // const describtion = req.body.describtion;
  // const date = req.body.date;
  // const image = req.body.image;
  const { title, description, date, image } = req.body;



  // if (!id) {
  //   return res.status(400).json({ message: "ID parameter is required" });
  // }
  if (!title && !description && !date && !image) {
    return res.status(400).json({ message: "You must provide at least one param to update(title,description,date,image)" });
  }


  const updateOps = req.body;

  // Validate request body
  if (Object.keys(updateOps).length === 0) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  try {
    const result = await Blog.findByIdAndUpdate(
      id,
      { $set: updateOps },
      { new: true }
    ).exec();
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(400).json({ message: "No valid entry found for provided ID" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
}

async function delete_blog(req, res, next) {
  const id = req.params.id;
 

  // if (!id) {
  //   return res.status(400).json({ message: "ID parameter is required" });
  // }

  Blog.findByIdAndDelete(id)
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
      res.status(400).json({
        message: err,
      });
    });
}

module.exports = {
  get_blogs,
  get_blog,
  create_blog,
  update_blog,
  delete_blog,
};
