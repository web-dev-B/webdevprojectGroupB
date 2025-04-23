const { query } = require("./database");
const moment = require("moment-timezone");

class Post {

  static async getAllPosts() {
    try {
      const queryText = "SELECT * FROM post";
      const posts = await query(queryText);
      posts.rows.forEach(async (post) => {
        await Post.updateCommentNum(post.post_id);
      });
      return posts.rows || [];
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async getPostByPostId(post_id) {
    try {
      const queryText =
        "SELECT post.*, account.username FROM post join account on post.account_id = account.account_id WHERE post_id = $1";
      const post = await query(queryText, [post_id]);
      await Post.updateCommentNum(post_id);
      return post.rows[0] || null;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async getCommentsByPostId(post_id) {
    try {
      const queryText = `SELECT comment.*, account.username, account.avatar FROM comment 
      join account on comment.account_id = account.account_id
      WHERE post_id = $1 ORDER BY date DESC`;
      const comments = await query(queryText, [post_id]);

      await Post.updateCommentNum(post_id);

      return comments.rows || [];
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async getAllPostsByAccountId(account_id) {
    try {
      const queryText = `SELECT post.*, account.username FROM post 
      join account on post.account_id = account.account_id
      WHERE post.account_id = $1 order by date desc;`;
      const post = await query(queryText, [account_id]);
      await Post.updateCommentNum(post.post_id);
      return post.rows || null;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async getAllCommentsByAccountId(account_id) {
    try {
      const queryText = `SELECT comment.*, post.title,post.description,post.photo_data,account.username,account.avatar FROM post JOIN comment on post.post_id = comment.post_id JOIN account ON account.account_id = comment.account_id WHERE comment.account_id = $1 ORDER BY date DESC;`;
      const post = await query(queryText, [account_id]);
      await Post.updateCommentNum(post.post_id);
      return post.rows || null;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async getLatestPost() {
    try {
      const queryText =
        "SELECT * FROM post WHERE photo_data IS NOT NULL ORDER BY DATE DESC LIMIT 1;";
      const post = await query(queryText);
      await Post.updateCommentNum(post.post_id);
      return post.rows[0] || null;
    } catch (err) {
      throw new Error(err.message);
    }
  }
 
  static async getTrendingPosts() {
    try {
      const queryText = `SELECT post.*,account.username FROM post
      join account on post.account_id = account.account_id
      where post.comment_num >= 5 and photo_data IS NOT Null ORDER BY post.rate DESC LIMIT 3`;
      const posts = await query(queryText);
      posts.rows.forEach(async (post) => {
        await Post.updateCommentNum(post.post_id);
      });
      return posts.rows || [];
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async getFollowingPosts(account_id) {
    try {

      const queryText = `SELECT DISTINCT post.*,account.username FROM post
      join account on post.account_id = account.account_id
      WHERE post.account_id = ANY(SELECT unnest(following_id) FROM account WHERE account_id = $1)
      LIMIT 3;`;
      const posts = await query(queryText, [account_id]);
      posts.rows.forEach(async (post) => {
        await Post.updateCommentNum(post.post_id);
      });
      return posts.rows || [];
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async getAllPostsBySearchingKeyword(keyword) {
    try {
      const queryText = `select account.account_id, account.username, account.avatar,
      post.post_id, post.title, post.description, post.category, 
      post.photo_data, post.rate, post.comment_num, post.date from account
      join post
      on account.account_id = post.account_id
      WHERE description ILIKE $1
      ORDER BY post.date DESC;`;
      const posts = await query(queryText, ["%" + keyword + "%"]);
      posts.rows.forEach(async (post) => {
        await Post.updateCommentNum(post.post_id);
      });
      return posts.rows || [];
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async addNewPost(account_id, title, description, category, photoData) {
    try {
      const timestamp = moment().format();
      const queryText =
        "INSERT INTO post (account_id, title, description, category, photo_data, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
      const result = await query(queryText, [
        account_id,
        title,
        description,
        category,
        photoData,
        timestamp,
      ]);

      await Post.updateCommentNum(result.post_id);

      return result.rows[0];
    } catch (err) {
      throw new Error(err.message);
    }
  }
  static async addNewComment(post_id, account_id, comment) {
    try {
      const timestamp = moment().format();
      const queryText =
        "INSERT INTO comment (post_id, account_id, comment, date) VALUES ($1, $2, $3, $4) RETURNING *";
      const result = await query(queryText, [
        post_id,
        account_id,
        comment,
        timestamp,
      ]);
      await Post.updateCommentNum(post_id);
      return result.rows[0];
    } catch (err) {
      throw new Error(err.message);
    }
  }
  static async addNewRate(post_id, rate) {
    try {
      const queryText =
        "INSERT INTO star (post_id, rate) VALUES ($1, $2) RETURNING *";
      const result = await query(queryText, [post_id, rate]);
      return result.rows[0];
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async updatePost(post_id, newData) {
    try {
      const queryText = "UPDATE post SET description = $1 WHERE post_id = $2";
      await query(queryText, [newData.description, post_id]);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async updateCommentNum(post_id) {
    try {

      const queryText =
        "SELECT COUNT(*) AS num_comments FROM comment WHERE post_id = $1";
      const result = await query(queryText, [post_id]);

      const numComments = result.rows[0].num_comments;

      const updateQuery = "UPDATE post SET comment_num = $1 WHERE post_id = $2";
      await query(updateQuery, [numComments, post_id]);
    } catch (err) {
      throw new Error(err.message);
    }
  }
  static async deletePost(post_id) {
    try {
      const queryText = "DELETE FROM post WHERE post_id = $1";
      await query(queryText, [post_id]);
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = Post;
