"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { SearchIcon } from "lucide-react";
import LeadStatusBadge from "@/components/dashboard/shared/lead-status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { LeadStatus } from "@/lib/aviatonly/domain";
import { cn } from "@/lib/utils";

export interface LeadThreadListItem {
  leadId: string;
  registration: string;
  aircraftTitle: string;
  counterpartName: string;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  unread: boolean;
  status: LeadStatus;
}

interface LeadThreadListProps {
  threads: LeadThreadListItem[];
  activeLeadId?: string | null;
  baseHref: string;
  searchPlaceholder?: string;
  emptyDescription?: string;
}

export function LeadThreadList({
  threads,
  activeLeadId,
  baseHref,
  searchPlaceholder = "Search buyer or aircraft",
  emptyDescription,
}: LeadThreadListProps) {
  const [search, setSearch] = useState("");

  const filteredThreads = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return threads;

    return threads.filter((thread) => {
      const haystack = [
        thread.registration,
        thread.aircraftTitle,
        thread.counterpartName,
        thread.lastMessagePreview ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [search, threads]);

  return (
    <Card className="flex h-full min-h-[28rem] flex-col overflow-hidden shadow-none">
      <CardContent className="flex flex-col gap-4 p-4">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
            aria-label="Search conversations"
          />
        </div>

        {filteredThreads.length === 0 ? (
          <Empty className="border-none p-6">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchIcon />
              </EmptyMedia>
              <EmptyTitle>No conversations</EmptyTitle>
              <EmptyDescription>
                {emptyDescription ??
                  (threads.length === 0
                    ? "Buyer messages on your listings will appear here."
                    : "No conversations match your search.")}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ScrollArea className="h-[min(32rem,calc(100vh-16rem))] pr-3">
            <div className="flex flex-col gap-2">
              {filteredThreads.map((thread) => {
                const isActive = thread.leadId === activeLeadId;
                const href = `${baseHref}/${thread.leadId}`;

                return (
                  <Link
                    key={thread.leadId}
                    href={href}
                    className={cn(
                      "flex flex-col gap-2 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50",
                      isActive && "border-primary bg-primary/5",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <p className="truncate font-medium text-foreground">
                          {thread.counterpartName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {thread.registration} · {thread.aircraftTitle}
                        </p>
                      </div>
                      {thread.unread ? (
                        <Badge variant="default" className="shrink-0">
                          New
                        </Badge>
                      ) : null}
                    </div>
                    {thread.lastMessagePreview ? (
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {thread.lastMessagePreview}
                      </p>
                    ) : null}
                    <div className="flex items-center justify-between gap-2">
                      <LeadStatusBadge status={thread.status} />
                      {thread.lastMessageAt ? (
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(thread.lastMessageAt), { addSuffix: true })}
                        </span>
                      ) : null}
                    </div>
                  </Link>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
