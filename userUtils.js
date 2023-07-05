function removeUserBlogID(user, blogID) {
    const index = user.usersBlogsID.indexOf(blogID);
    if (index !== -1) {
      user.usersBlogsID.splice(index, 1);
      user.save();
      return true; // Indicate successful removal
    }
    return false; // Indicate blog ID not found
}

function findBlogs(allBlogs, userBlogID) {

    const ownedBlogs = allBlogs.filter(blog => userBlogID.includes(blog.id));
    return ownedBlogs;
}

module.exports = {removeUserBlogID,  findBlogs};
  