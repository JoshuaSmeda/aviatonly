import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import * as basicTable from "@/components/dashboard/shadcn-table/table-data";
import Image from "next/image";

function StripedRowTable() {
  return (
    <div className="border rounded-md border-border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Budget</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {basicTable.basicTableData.map((item, index) => (
              <TableRow
                key={index}
                className="group/row bg-transparent odd:bg-transparent even:bg-primary/12"
              >
                <TableCell className="whitespace-nowrap">
                  <div className="flex gap-3 items-center">
                    <Image
                      src={item.avatar || ""}
                      alt="avatar"
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="truncat line-clamp-2 max-w-56">
                      <h6 className="text-base">{item.name}</h6>
                      <p className="text-sm text-muted-foreground">{item.post}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {" "}
                  <p className="text-muted-foreground text-base">{item.pname}</p>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex ">
                    {item.teams.map((teamtbl, index) => (
                      <div className="-ms-2" key={index}>
                        <div
                          className={`bg-${teamtbl.color} text-white border-2 border-white dark:border-border  h-10 w-10 flex justify-center items-center text-xl font-medium rounded-full`}
                        >
                          {teamtbl.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge className={`bg-${item.statuscolor} `}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <h6 className="text-base text-muted-foreground">{item.budget}</h6>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default StripedRowTable;
