import React, { useContext } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { UserDataContext } from "@/app/context/userdata-context";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { Card } from "@/components/ui/card";
import { SearchIcon } from "lucide-react";
import PlaceholdersInput from "@/app/components/animated-components/animatedinput-placeholder";

const socialiconCard = [
  {
    icon: <Icon icon="mynaui:facebook" width={18} height={18} />,
    color: "primary",
  },
  {
    icon: <Icon icon="mynaui:instagram" width={18} height={18} />,
    color: "destructive",
  },
  {
    icon: <Icon icon="mynaui:github" width={18} height={18} />,
    color: "chart-5",
  },
  {
    icon: <Icon icon="mynaui:twitter" width={18} height={18} />,
    color: "chart-2",
  },
];

const FriendsCard = () => {
  const { followers, search, setSearch } = useContext(UserDataContext);

  return (
    <>
      <div className="md:flex justify-between mb-6">
        <h5 className="text-2xl flex gap-3 items-center sm:my-0 my-4">
          Friends <Badge variant="secondary">{followers.length}</Badge>
        </h5>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <SearchIcon size={16} />
          </span>

          <PlaceholdersInput
            className="pl-9 w-full"
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
            placeholders={[
              "Search Friends...",
              "Find top Friends...",
              "Look up Friends...",
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {followers.map(
          (profile: {
            id: React.Key;
            avatar: string | StaticImport;
            name: string;
            role: string;
          }) => (
            <div
              className="lg:col-span-4 md:col-span-4 sm:col-span-6 col-span-12 "
              key={profile.id}
            >
              <Card className="px-0 pb-0 text-center overflow-hidden gap-0 ">
                <div>
                  <Image
                    src={profile.avatar}
                    alt={profile.name}
                    className="rounded-full mx-auto"
                    height={80}
                    width={80}
                  />
                </div>
                <div>
                  <h5 className="text-lg mt-3">{profile.name}</h5>
                  <p className="text-xs text-muted-foreground">
                    {profile.role}
                  </p>
                </div>
                <div className="flex justify-center gap-4 items-center border-t border-border mt-4 pt-4 bg-muted pb-4  ">
                  {socialiconCard.map((soc, index) => (
                    <Link href="#" className={`text-${soc.color} `} key={index}>
                      {soc.icon}
                    </Link>
                  ))}
                </div>
              </Card>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default FriendsCard;
