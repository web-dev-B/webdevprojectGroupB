import { timecomment } from "./timecomment";

class Comment {
  #comment_id;
  #account_id;
  #post_id;
  #comment;
  #date;
  #username;
  #avatar;
  constructor(
    comment_id,
    account_id,
    post_id,
    comment,
    date,
    username,
    avatar
  ) {
    this.#comment_id = comment_id;
    this.#account_id = account_id;
    this.#post_id = post_id;
    this.#comment = comment;
    this.#date = date;
    this.#username = username;
    this.#avatar = avatar;
  }
  getCommentId() {
    return this.#comment_id;
  }
  getAccountId() {
    return this.#account_id;
  }
  getPostId() {
    return this.#post_id;
  }
  getComment() {
    return this.#comment;
  }
  getDate() {
    return timecomment(this.#date);
  }
  getUsername() {
    return this.#username;
  }
  getAvatar() {
    return this.#avatar;
  }
}

export { Comment };
