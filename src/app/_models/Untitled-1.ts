/* listen for likes and comments to pull them from the server and update the view */
/* this.arrayOfSubscriptions.push(this.notificationService.newNotification().subscribe({
  next: (notification: Notification) => {
    this.notifications.push(notification);
    if (notification.type == "comment") {
      this.postService.getCommentFromTheServer(notification.url.substring(notification.url.indexOf('#'))).subscribe({
        next: (comment) => {
          this.updatePosts('comments', notification.url.substring(notification.url.indexOf('#')), comment)
        }
      })
    } else if (notification.type == 'reaction') {
      this.postService.getReactionFromTheServer(notification.url.substring(notification.url.indexOf('#'))).subscribe({
        next: (reaction) => {
          this.updatePosts('comments', notification.url.substring(notification.url.indexOf('#')), comment)
        }
      })
    }
  }
})) */

/* updatePosts(field:string,postId: string, whatToAdd: Comment | Reaction) {
  let index = this.posts.findIndex(p => p._id == postId);
  if (index != -1) {
    if (field == 'comments') {
      this.posts[index].comments.push(whatToAdd as Comment);
    } else if (field == 'reactions') {
      this.posts[index].reactions.push(whatToAdd as Reaction);
    }
  }
} */

/* toggle like */
/* this.updateReactionsOfAPost(post._id, data);
if (data.liked) {
  let notificationToSend: NotificationToSend = {
    notifier: this.myId(),
    recipients: [post.owner._id],
    type: 'reaction',
    notificationContent: `${data.reaction.owner.name} liked one of your posts`,
    postId: post._id
  }

  this.notificationService.emitNotification(notificationToSend)
}
 */
/* new comment */

/* let notificationToSend: NotificationToSend = {
  notifier: this.myId(),
  recipients: [post.owner._id],
  type: 'comment',
  notificationContent: `${data.comment.owner.name} commented on one of your posts`,
  postId: post._id
} */
