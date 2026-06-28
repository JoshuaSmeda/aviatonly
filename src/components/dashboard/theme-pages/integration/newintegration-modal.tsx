"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
type NewModalProps = {
  open: boolean;
  onClose: () => void;
};
const NewIntegrationModal: React.FC<NewModalProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Integration</DialogTitle>
          <DialogDescription>
            Set up an integration and add a brief explanation for the team.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label
              htmlFor="select-app"
              className="capitalize text-muted-foreground"
            >
              Select App
            </Label>
            <Select>
              <SelectTrigger id="select-app" className={"w-full"}>
                <SelectValue>{"Select an option"}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google-meet">Google Meet</SelectItem>
                <SelectItem value="mailchimp">Mailchimp</SelectItem>
                <SelectItem value="zoom">Zoom</SelectItem>
                <SelectItem value="loom-1">Loom</SelectItem>
                <SelectItem value="loom-2">Loom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="client-id"
              className="capitalize text-muted-foreground "
            >
              Client ID
            </Label>
            <Input id="client-id" name="clientid" type="text" />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="client-secret"
              className="capitalize text-muted-foreground "
            >
              Client Secret
            </Label>
            <Input id="client-secret" name="clientsecret" type="text" />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="authentication-url"
              className="capitalize  text-muted-foreground"
            >
              Authentication base URI
            </Label>
            <Input
              id="authentication-url"
              name="authenticationurl"
              type="text"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Paste the full URI, and we’ll automatically pull out and show only
            the subdomain for quick reference.
          </p>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="secondary" className=" text-primary">
            Add Integration
          </Button>
          <Button className="text-white" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewIntegrationModal;
