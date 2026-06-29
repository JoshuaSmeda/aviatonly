import type { LucideIcon } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface WorkflowPlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
}

/**
 * Shared placeholder used while AVIATONLY workflow screens are being built out.
 * Keeps every route consistent until the real workflow UI lands.
 */
const WorkflowPlaceholder = ({
  icon: Icon,
  title,
  description,
  children,
}: WorkflowPlaceholderProps) => {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {children ? <EmptyContent>{children}</EmptyContent> : null}
    </Empty>
  );
};

export default WorkflowPlaceholder;
