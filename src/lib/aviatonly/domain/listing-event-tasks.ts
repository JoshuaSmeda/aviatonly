export interface ListingEventTaskSummary {
  title: string;
  description: string | null;
}

export function formatReviewTasksReleasedMessage(tasks: ListingEventTaskSummary[]): string {
  if (tasks.length === 0) {
    return "AVIATONLY sent review tasks to the seller.";
  }

  return tasks
    .map((task) =>
      task.description?.trim()
        ? `${task.title}\n${task.description.trim()}`
        : task.title,
    )
    .join("\n\n");
}

export function parseListingEventTaskSummaries(
  metadata: Record<string, unknown> | null | undefined,
): ListingEventTaskSummary[] {
  if (!metadata || !Array.isArray(metadata.tasks)) {
    return [];
  }

  return metadata.tasks
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map((item) => ({
      title: typeof item.title === "string" ? item.title : "Review task",
      description: typeof item.description === "string" ? item.description : null,
    }))
    .filter((item) => item.title.length > 0);
}
