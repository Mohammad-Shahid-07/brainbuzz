"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Comment from "../forms/Comment";

interface Props {
    itemId: string;
    userId: string;
    blogId: string;
    }
const ReplyButton = ({
     itemId,
     blogId,
     userId,
}: Props) => {
  const [showComment, setShowComment] = useState(false);

  const handleReplyShow = () => {
    // Toggle the visibility of the Comment component
    setShowComment(!showComment);
  };
  

  return (
    <div className={` w-full `}>
      {showComment && <Comment commentId={itemId} userId={userId} blogId={blogId} type='Reply' />}
      <Button
        className="text-dark500_light500 mt-2 flex items-center justify-center rounded-full px-2 py-3 hover:bg-light-400 dark:hover:bg-dark-400"
        onClick={handleReplyShow}
      >
        {showComment ? "Cancel" : "Reply"}
      </Button>
    </div>
  );
};

export default ReplyButton;
