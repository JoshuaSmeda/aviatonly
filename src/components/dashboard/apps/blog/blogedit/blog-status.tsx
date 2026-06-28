"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statuses = ["Draft", "Schedule", "Publish", "Inactive"];
const Status = () => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(
    "Publish"
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between items-center">
            <h5>Blog Status</h5>
            {selectedStatus === "Publish" ? (
              <Badge className="h-3 w-3 p-0 bg-chart-2" />
            ) : selectedStatus === "Schedule" ? (
              <Badge variant="secondary" className="h-3 w-3 p-0" />
            ) : selectedStatus === "Draft" ? (
              <Badge variant={"destructive"} className="h-3 w-3 p-0" />
            ) : (
              <Badge className="h-3 w-3 p-0 bg-chart-4" />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <Select
            value={selectedStatus}
            onValueChange={(value) => {
              setSelectedStatus(value);
            }}
            defaultValue={"Select status"}

          >
            <SelectTrigger className="select-md w-full" id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <small className="text-xs text-muted-foreground">
            Set the blog status.
          </small>
        </div>
      </CardContent>
    </Card>
  );
};

export default Status;
