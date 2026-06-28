import React, { useContext } from "react";

import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { UserDataContext } from "@/app/context/userdata-context/index";
import { GallaryType } from "../../../../(dashboard-layout)/types/apps/users";
import { SearchIcon } from "lucide-react";
import PlaceholdersInput from "@/app/components/animated-components/animatedinput-placeholder";

const GalleryCards = () => {
  const { gallery } = useContext(UserDataContext)!;

  const [search, setSearchLocal] = React.useState("");

  const filterPhotos = (photos: GallaryType[], cSearch: string) => {
    if (photos)
      return photos.filter((t: GallaryType) =>
        t.name.toLocaleLowerCase().includes(cSearch.toLocaleLowerCase())
      );
    return photos;
  };

  const getPhotos = filterPhotos(gallery, search);

  return (
    <>
      <div className="md:flex justify-between mb-6">
        <h5 className="text-2xl flex gap-3 items-center sm:my-0 my-4">
          Friends{" "}
          <Badge variant={"secondary"} className="text-primary">
            {getPhotos?.length}
          </Badge>
        </h5>
        <div className="relative w-fit">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground ">
            <SearchIcon size={16}
            />
          </span>
          <PlaceholdersInput
            className="pl-9 w-full"
            value={search}
            onChange={(value) => setSearchLocal(value)}
            placeholders={[
              "Search Gallery...",
              "Find top Gallery...",
              "Look up Gallery...",
            ]}
          />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6">
        {getPhotos.map((photo) => {
          return (
            <div
              className="lg:col-span-4 md:col-span-4 sm:col-span-6 col-span-12"
              key={photo.id}
            >
              <Card className="overflow-hidden p-0 card-hover">
                <div className="h-[220px]  overflow-hidden">
                  <Image
                    src={photo.cover}
                    height={220}
                    width={500}
                    alt="gllery"
                    className="object-center object-cover h-full"
                  />
                </div>
                <div className="pt-4 p-6 flex">
                  <div>
                    <h6 className="text-sm">{photo.name}jpg</h6>
                    <p className="text-xs font-medium text-muted-foreground">
                      {" "}
                      {format(new Date(photo.time), "E, MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="ms-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <span className="btn-circle-hover text-muted-foreground">
                          <Icon
                            icon="pepicons-pop:dots-y"
                            width={18}
                            height={18}
                          />
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" sideOffset={5} >
                        <DropdownMenuItem className="flex gap-3 cursor-pointer">
                          {photo.name}.jpg
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default GalleryCards;
