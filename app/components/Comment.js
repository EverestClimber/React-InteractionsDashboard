import React from 'react';
import moment from 'moment';

const Comment = ({ comment, ...rest }) => (
  <div className="Comment" {...rest}>
    <div className="Comment__message">{comment.message}</div>
    <div className="Comment__details">
      <span className="Comment__details__name">
        {comment.user.first_name} {comment.user.last_name}
      </span>
      {', '}
      <span className="Comment__details__date">
        {moment(comment.created_at).format('MMM DD, YYYY - HH:mm (UTCZ)')}
      </span>
    </div>
  </div>
);

export default Comment;
