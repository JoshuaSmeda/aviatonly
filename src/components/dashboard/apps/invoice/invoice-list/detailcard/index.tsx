"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
const DetailCard = () => {
  interface RecordItem {
    amount: string;
    title: string;
    target: number;
    icon: string;
    txtcolor: string;
    bgcolor: string;
    progressColor: string;
    progressTrackColor: string;
  }

  const RecordData: RecordItem[] = [
    {
      amount: "$2,050",
      title: "Overdue amount",
      target: 45,
      icon: "solar:wallet-money-line-duotone",
      txtcolor: "chart-4",
      bgcolor: "chart-4/12",
      progressColor:
        "**:data-[slot=progress-indicator]:bg-chart-4 dark:**:data-[slot=progress-indicator]:bg-chart-4",
      progressTrackColor:
        "**:data-[slot=progress-track]:bg-chart-4/12 dark:**:data-[slot=progress-track]:bg-chart-4/12",
    },
    {
      amount: "$4,600",
      title: "Drafted totals",
      target: 20,
      icon: "solar:document-line-duotone",
      txtcolor: "primary",
      bgcolor: "primary/12",
      progressColor:
        "**:data-[slot=progress-indicator]:bg-primary dark:**:data-[slot=progress-indicator]:bg-primary",
      progressTrackColor:
        "**:data-[slot=progress-track]:bg-primary/5 dark:**:data-[slot=progress-track]:bg-primary/5",
    },
    {
      amount: "$2,050",
      title: "Unpaid totals",
      target: 75,
      icon: "solar:card-recive-line-duotone",
      txtcolor: "destructive",
      bgcolor: "destructive/12",
      progressColor:
        "**:data-[slot=progress-indicator]:bg-destructive dark:**:data-[slot=progress-indicator]:bg-destructive",
      progressTrackColor:
        "**:data-[slot=progress-track]:bg-destructive/12 dark:**:data-[slot=progress-track]:bg-destructive/12",
    },
    {
      amount: "7 days",
      title: "Average paid time",
      target: 30,
      icon: "solar:clock-circle-line-duotone",
      txtcolor: "chart-2",
      bgcolor: "chart-2/12",
      progressColor:
        "**:data-[slot=progress-indicator]:bg-chart-2 dark:**:data-[slot=progress-indicator]:bg-chart-2",
      progressTrackColor:
        "**:data-[slot=progress-track]:bg-chart-2/12 dark:**:data-[slot=progress-track]:bg-chart-2/12",
    },
  ];

  return (
    <>
      <div className="grid xl:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6 mb-6">
        {RecordData.map((item, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex flex-col justify-between gap-4">
                <div>
                  <h3 className="2xl:text-28 text-2xl font-semibold">
                    {item.amount}
                  </h3>
                  <p className="2xl:text-base text-sm font-normal text-muted-foreground">
                    {item.title}
                  </p>
                </div>
                <div>
                  <Progress
                    value={item.target}
                    className={cn(
                      `${item.progressColor}`,
                      `${item.progressTrackColor}`
                    )}
                  />
                </div>
              </div>
              <div
                className={`p-3 rounded-lg bg-${item.bgcolor} text-${item.txtcolor}`}
              >
                <Icon icon={item.icon} width={24} height={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default DetailCard;
