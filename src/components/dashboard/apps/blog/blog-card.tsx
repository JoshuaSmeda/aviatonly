"use client";
import { format } from "date-fns";
import { Circle } from "lucide-react";

import { Icon } from "@iconify/react";
import { BlogPostType } from "@/app/(dashboard)/dashboard/types/apps/blog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Btype {
  post: BlogPostType;
  index?: number;
}
const BlogCard = ({ post }: Btype) => {
  const { coverImg, title, view, comments, category, author, createdAt } = post;
  const linkTo = title
    ? title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "")
    : "";
  return (
    <>
      <div className="lg:col-span-4 md:col-span-6 col-span-12 ">
        <Card className="p-0 group card-hover h-full gap-0 ">
          <Link href={`/apps/blog/detail/${linkTo}`} >
            <div className="relative ">
              <div className="overflow-hidden max-h-[240px] group transition-shadow duration-300 ease-in-out">
                <Image
                  src={coverImg || ""}
                  alt="tailwind-admin"
                  height={240}
                  width={500}
                  className="w-full object-cover object-center transition-transform duration-200 group-hover:scale-[1.09] "
                />
              </div>
              <Badge
                variant={"link"}
                className="absolute bottom-8 end-6 bg-muted text-muted-foreground"
              >
                2 min Read
              </Badge>
            </div>
          </Link>
          <div className="flex justify-between items-center -mt-7 px-6">
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={author?.avatar} alt={author?.name} />
                      <AvatarFallback>{author?.name}</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>{author?.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="px-6 pb-6">
            <Badge className="mt-3 rounded-md bg-muted text-muted-foreground">
              {category}
            </Badge>
            <h5 className="text-xl py-6 group-hover:text-primary">
              <Link
                href={`/apps/blog/detail/${linkTo}`}
                className="line-clamp-2"
              >
                {" "}
                {title}
              </Link>
            </h5>
            <div>
              <div className="flex gap-3">
                <div className="flex gap-2 items-center text-sm  ">
                  <Icon icon="tabler:eye" height="18" /> {view}
                </div>
                <div className="flex gap-2 items-center  text-sm">
                  <Icon icon="tabler:message-2" height="18" />{" "}
                  {comments?.length}
                </div>
                <div className="ms-auto flex gap-2 items-center  text-sm">
                  <Circle size={7} />
                  <small>
                    {createdAt ? format(new Date(createdAt), "E, MMM d") : ""}
                  </small>
                </div>
              </div>
            </div>
          </div>

        </Card>
      </div>
    </>
  );
};

export default BlogCard;
