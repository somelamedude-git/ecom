const { asyncHandler } = require('../utils/asyncHandler');
const { Category } = require('../models/category.models');
const { Tag } = require('../models/tags.model');

const fetchTagsAndCategories = asyncHandler(async(req, res)=>{
    // we only need names bruv
    let categories = await Category.find().select("name").lean();
    const category_names = categories.map(cat=>cat.name);

    let tags = await Tag.find().select("name").lean();
    const tag_names = tags.map(tag=>tag.name);

    res.status(200).json({
        success:true,
        tag_names,
        category_names
    });
});

module.exports = {
    fetchTagsAndCategories
}

