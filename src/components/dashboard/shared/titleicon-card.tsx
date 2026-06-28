"use client";
import { CustomizerContext } from "@/app/context/customizer-context";
import React, { useContext } from "react";
import { Icon } from "@iconify/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TitleCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: string;
  onDownload?: () => void;
}

const TitleIconCard: React.FC<TitleCardProps> = ({
  children,
  className,
  title,
  onDownload,
}) => {
  const { activeMode, isCardShadow, isBorderRadius } =
    useContext(CustomizerContext);

  return (
    <Card
      className={`card no-inset no-ring gap-0 ${className} ${isCardShadow
          ? "dark:shadow-dark-md shadow-md p-0"
          : "shadow-none border p-0"
        }`}
      style={{
        borderRadius: `${isBorderRadius}px`,
      }}
    >
      <CardHeader className="p-0">
        <div className="flex justify-between items-center border-b py-4  p-6">
          <CardTitle>
            <h5 className="text-xl font-semibold">{title}</h5>
          </CardTitle>
          <Button className="flex items-center " onClick={onDownload}>
            <Icon icon="tabler:download" width={20} height={20} />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="py-4">{children}</div>
      </CardContent>
    </Card>
  );
};

export default TitleIconCard;
