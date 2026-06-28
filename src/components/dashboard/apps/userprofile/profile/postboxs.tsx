import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

const PostBox = () => {
  return (
    <>
      <Card className="p-6">
        <Textarea
          className="form-control-textarea"
          rows={5}
          placeholder="Share your thoughts"
        />
        <div className="flex gap-5 mt-3">
          <div className="flex items-center gap-3 cursor-pointer  font-medium text-muted-foreground">
            <Button className="btn-circle-hover p-0 rounded-full ">
              <Icon icon="tabler:photo" height="16" />
            </Button>
            Photos / Video
          </div>
          <div className="flex items-center gap-3 cursor-pointer  font-medium text-muted-foreground">
            <Button
              className="btn-circle-hover p-0 rounded-full text-primary"
              variant={"secondary"}
            >
              <Icon icon="tabler:notebook" height="16" />
            </Button>
            Article
          </div>
          <Button className="ms-auto ">Post</Button>
        </div>
      </Card>
    </>
  );
};

export default PostBox;
