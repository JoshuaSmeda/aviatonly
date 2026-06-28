"use client";
import React, { useContext } from "react";
import { CustomizerContext } from "@/app/context/customizer-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MyAppProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}
const TitleCard: React.FC<MyAppProps> = ({ children, className, title }) => {
  const { activeMode, isCardShadow, isBorderRadius } =
    useContext(CustomizerContext);
  return (
    <Card
      className={`card no-inset no-ring gap-0  ${className} ${isCardShadow
        ? "dark:shadow-dark-md shadow-md p-0"
        : "shadow-none border border-border p-0"
        } `}
      style={{
        borderRadius: `${isBorderRadius}px`,
      }}
    >
      <CardHeader className="p-0">
        <CardTitle>
          <div className="border-b border-border py-4 p-6">
            <h5 >{title}</h5>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="py-4 ">{children}</div>
      </CardContent>
    </Card>
  );
};

export default TitleCard;
