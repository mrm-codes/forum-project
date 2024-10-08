const  Category  = require('../models/Category');


exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);


    } catch (error) {
     // General error response
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
};

exports.getCategories = async (req, res) => {
    try {
      const categories = await Category.findAll();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  };
