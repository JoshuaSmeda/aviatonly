import React, { useState, useContext } from "react";

import uniqueId from "lodash/uniqueId";
import {
  PostType,
  Comment as CommentType,
  CommentDataType,
  Reply,
  ProfileType,
} from "@/app/(dashboard)/dashboard/types/apps/userprofile";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { UserDataContext } from "@/app/context/userdata-context/index";
import { Icon } from "@iconify/react/dist/iconify.js";

interface CommentProps {
  comment: CommentType;
  post: PostType;
}
interface ReplyProps {
  data: CommentDataType;
  reply: Reply[];
  profile: ProfileType;
}

const PostComments = ({ comment, post }: CommentProps) => {
  const { likeReply, addReply } = useContext(UserDataContext)!;
  const [replyTxt, setReplyTxt] = useState<string>("");
  const [showReply, setShowReply] = useState(false);

  const handleLikeReply = (postId: string, commentId: string) => {
    likeReply(postId, commentId);
  };

  const onSubmit = async (postId: string, commentId: string, reply: string) => {
    const replyId = uniqueId("#REPLY_");
    const newReply: Reply = {
      id: replyId,
      profile: {
        id: uniqueId("#REPLY_"),
        avatar: post?.profile.avatar,
        name: post?.profile.name,
        time: "now",
      },
      data: {
        comment: reply,
        likes: {
          like: false,
          value: 0,
        },
        replies: [],
      },
    };
    addReply(postId, commentId, newReply);
    setReplyTxt("");
    setShowReply(false);
  };

  return (
    <>
      <div className="p-4 bg-muted dark:bg-muted/70 rounded-md my-6">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={comment?.profile.avatar} alt="profile" />
            <AvatarFallback>{comment?.profile.name}</AvatarFallback>
          </Avatar>
          <h6>{comment?.profile.name}</h6>
          <p className="flex items-center gap-2 text-muted-foreground">
            <span className="h-[6px] w-[6px] rounded-full bg-muted-foreground/50 block"></span>
            {comment?.profile.time}
          </p>
        </div>
        {/**Post Content**/}
        <p className=" opacity-80 text-sm py-4">
          {comment?.data?.comment}
        </p>
        <TooltipProvider>
          <div className="flex gap-5 mt-3">
            <div className="flex items-center gap-3 cursor-pointer  font-medium ">
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    className="btn-circle-hover p-0 rounded-full border border-border"
                    variant={
                      comment?.data &&
                        comment?.data.likes &&
                        comment?.data.likes.like
                        ? "default"
                        : "secondary"
                    }
                    onClick={() => {
                      if (!post?.id || !comment?.id) return;
                      handleLikeReply(post.id, comment.id);
                    }}
                  >
                    <Icon icon="stash:thumb-up" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Like</TooltipContent>
              </Tooltip>
              <span className="font-semibold  text-sm">
                {comment?.data &&
                  comment?.data.likes &&
                  comment?.data.likes.value}
              </span>
            </div>
            <div className="flex items-center gap-3 cursor-pointer  font-medium">
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    className="btn-circle-hover p-0 rounded-full  border border-border"
                    variant={"secondary"}
                    onClick={() => setShowReply(!showReply)}
                  >
                    <Icon icon="proicons:arrow-undo-2" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reply</TooltipContent>
              </Tooltip>
              <span className="font-semibold  text-sm">
                {comment?.data?.replies?.length ?? 0
                  ? comment?.data?.replies?.length
                  : 0}
              </span>
            </div>
          </div>
        </TooltipProvider>
      </div>

      {comment?.data?.replies ? (
        <>
          {comment?.data.replies.map((reply: Reply) => {
            return (
              <div className="ps-4" key={reply?.id}>
                <div className="p-4 bg-muted dark:bg-muted/70  rounded-md mt-6">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={reply?.profile?.avatar} alt="profile" />
                      <AvatarFallback>{reply?.profile?.name}</AvatarFallback>
                    </Avatar>
                    <h6>{reply?.profile?.name}</h6>
                    <p className="flex items-center gap-2  text-muted-foreground">
                      <span className="h-[6px] w-[6px] rounded-full  bg-muted-foreground/50  block"></span>
                      {reply?.profile?.time}
                    </p>
                  </div>

                  <p className=" text-sm py-4">{reply?.data.comment}</p>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        ""
      )}
      {showReply ? (
        <div className="ps-8 mt-6">
          <div className="flex gap-3 items-center justify-between">
            <div className="w-12">
              <Avatar>
                <AvatarImage src={post?.profile.avatar} alt="profile" />
                <AvatarFallback>profile</AvatarFallback>
              </Avatar>
            </div>
            <Input
              type="text"
              className="form-control w-full"
              placeholder="Reply"
              value={replyTxt}
              onChange={(e) => setReplyTxt(e.target.value)}
            />
            <Button
              onClick={() => {
                if (!post?.id || !comment?.id || !replyTxt.trim()) return;
                onSubmit(post.id, comment.id, replyTxt);
              }}
              variant={"secondary"}
              className={"text-primary"}
            >
              Reply
            </Button>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default PostComments;
