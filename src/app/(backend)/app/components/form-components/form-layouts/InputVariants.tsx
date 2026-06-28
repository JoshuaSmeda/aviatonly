import React from "react";
import TitleCard from "../../shared/titleborder-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const InputVariants = () => {
  return (
    <div>
      <TitleCard title="Input Variants">
        <div className="flex flex-col gap-6">
          <div className="space-y-1">
            <div>
              <Label htmlFor="input-gray" className="text-gray">
                Gray
              </Label>
            </div>
            <Input
              id="input-gray"
              placeholder="Input Gray"
              required
              // variant="gray"
              className="bg-accent placeholder:text-muted-foreground focus:border-border!  border border-border"
            />
          </div>
          <div className="space-y-1">
            <div>
              <Label htmlFor="input-info" className="text-info">
                Info
              </Label>
            </div>
            <Input
              id="input-info"
              placeholder="Input Info"
              required
              className="bg-chart-5/12 placeholder:text-chart-5 focus:border-chart-5! border border-chart-5"
            />
          </div>
          <div className="space-y-1">
            <div>
              <Label htmlFor="input-success" className="text-success">
                Success
              </Label>
            </div>
            <Input
              id="input-success"
              placeholder="Input Success"
              required
              className="bg-chart-2/12 placeholder:text-chart-2 focus:border-chart-2! border border-chart-2"
            />
          </div>
          <div className="space-y-1">
            <div>
              <Label htmlFor="input-failure" className="text-error">
                Failure
              </Label>
            </div>
            <Input
              id="input-failure"
              placeholder="Input Failure"
              required
              className="bg-chart-1/12 placeholder:text-chart-1 focus:border-chart-1! border border-chart-1"
            />
          </div>
          <div className="space-y-1">
            <div>
              <Label htmlFor="input-warning" className="text-warning">
                Warning
              </Label>
            </div>
            <Input
              id="input-warning"
              placeholder="Input Warning"
              required
              className="bg-chart-4/12 placeholder:text-chart-4 focus:border-chart-4! border border-chart-4"
            />
          </div>
        </div>
      </TitleCard>
    </div>
  );
};

export default InputVariants;
