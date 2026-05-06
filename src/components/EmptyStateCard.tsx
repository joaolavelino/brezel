import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface EmptyStateCardProps {
  title: string;
  description: string;
  action: () => void;
  actionText: string;
}

export const EmptyStateCard = ({
  title,
  description,
  action,
  actionText,
}: EmptyStateCardProps) => {
  return (
    <Card className="w-full p-4 border-2 border-primary-muted mt-2 gap-4">
      <CardHeader className="p-0 flex flex-col items-center gap-2">
        <div className="p-3 bg-primary-muted rounded-full w-fit">
          <AlertTriangle size={20} className="text-primary " />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-center text-xs italic">
          {description}
        </CardDescription>
      </CardHeader>
      <CardAction className="p-0 w-full">
        <Button
          onClick={action}
          variant={"default"}
          className="w-full rounded-full"
        >
          {actionText}
        </Button>
      </CardAction>
    </Card>
  );
};
