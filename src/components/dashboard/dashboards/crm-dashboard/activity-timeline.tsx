"use client";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const RecentTransactionData = [
  {
    title: "08:15",
    subtitle: "New lead captured from landing page form",
    line: true,
    link: "",
    url: "",
  },
  {
    title: "08:42",
    subtitle: "Deal moved to “Negotiation” stage",
    line: true,
    link: "#ML-3467",
    url: "",
  },
  {
    title: "09:05",
    subtitle: "Client responded to follow-up email inquiry",
    line: true,
    link: "",
    url: "",
  },
  {
    title: "09:18",
    subtitle: "Email campaign 'Weekly Digest' sent",
    line: true,
    link: "#ML-3467",
    url: "",
  },
  {
    title: "09:32",
    subtitle: "Newsletter signup goal achieved",
    line: true,
    link: "",
    url: "",
  },
  {
    title: "10:02",
    subtitle: "New contact added to CRM database system",
    line: true,
    link: "",
    url: "",
  },
  {
    title: "10:15",
    subtitle: "User clicked Meta Ads campaign",
    line: false,
    link: "#ML-3467",
    url: "",
  },
];

const ActivityTimeline = () => {
  return (
    <Card className="w-full gap-5 h-full py-6">
      <CardHeader className="px-6">
        <CardTitle className="text-lg font-medium text-foreground">
          Recent Events
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <div className="mt-4">
          {RecentTransactionData.map((item, i) => (
            <div key={i} className="flex gap-x-3">
              {/* Time */}
              <div className="xl:w-1/6 text-end">
                <span className="text-sm font-medium text-card-foreground">
                  {item.title}
                </span>
              </div>

              {/* Dot + line */}
              <div className="relative">
                <div className="relative z-10 w-7 h-5 flex justify-center items-center">
                  <div
                    className={`h-3 w-3 bg-card rounded-full outline-2 outline-foreground`}
                  ></div>
                </div>

                {item.line ? (
                  <div className="border-s border-ld h-full -mt-2 ms-3.5"></div>
                ) : (
                  <div className="border-0"></div>
                )}
              </div>

              {/* Text Content */}
              <div
                className={cn(
                  "w-1/4 grow pt-0.5",
                  i !== RecentTransactionData.length - 1 && "pb-8",
                )}
              >
                <p className="text-sm text-muted-foreground">
                  {item.subtitle}{" "}
                  {item.link ? (
                    <a href={item.url} className="text-primary">
                      {item.link}
                    </a>
                  ) : null}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
