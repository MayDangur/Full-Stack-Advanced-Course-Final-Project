const getPosts = async (req, res, next) => {
    res.send("this is my post");
};
const addPosts = async (req, res, next) => {
    res.send("adding new");
};
module.exports = {
    getPosts,
    addPosts
};