import React from 'react';
import { Alert } from 'react-bootstrap';

const Comment = ({ comment, ...rest }) => (
  <Alert className="Comment" bsStyle="info" {...rest}>
    {comment.message}
    <em className="pull-right">
      by <strong>{comment.user.email}</strong>
    </em>
  </Alert>
);

export default Comment;
