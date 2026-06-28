import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import SimpleBar from "simplebar-react";
import { Icon } from "@iconify/react";
import { EmailContext } from "@/app/context/email-context/index";
import { formatDistanceToNowStrict } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import AnimatedItem from "@/components/dashboard/animated-components/list-animation";
import { EmailType } from "@/app/(dashboard)/dashboard/types/apps/email";

type MailListProps = {
  openMail: Dispatch<SetStateAction<boolean>>;
};

const EmailList = ({ openMail }: MailListProps) => {
  const {
    emails,
    selectedEmail,
    setSelectedEmailId,
    deleteEmail,
    filter,
    toggleStar,
    toggleImportant,
    searchQuery,
  } = useContext(EmailContext);

  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>(
    {}
  );

  const handleCheckboxChange = (emailId: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [emailId]: !prev[emailId],
    }));
  };


  const handleDelete = (emailId: number) => {
    deleteEmail(emailId);
  };

  const filteredEmails = searchQuery
    ? emails.filter((e) =>
      e.from.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : emails.filter((email) => {
      if (filter === "starred") return email.starred;
      if (["Promotional", "Social", "Health"].includes(filter)) {
        return email.label === filter;
      }
      return (email as Record<string, any>)[filter];
    });

  const handleSelectEmail = (email: EmailType) => {
    setSelectedEmailId(email.id);
    setCheckedItems({});
    if (window.innerWidth < 1024) openMail(true);
  };

  const selectedId = selectedEmail?.id ?? null;

  return (
    <div className="h-[calc(100vh-300px)]">
      <SimpleBar className="h-full">
        <div className="h-full w-full">
          {filteredEmails.map((email, index) => (
            <div
              key={email.id}
              className={`cursor-pointer py-4 px-6 gap-3  items-center group border-b border-border group hover:bg-primary/5 ${selectedId === email.id ? "bg-primary/5" : ""
                }`}
            >
              <AnimatedItem index={index}>
                <div
                  className="flex gap-3"
                  onClick={() => handleSelectEmail(email)}
                >
                  <Checkbox
                    checked={checkedItems[email.id]}
                    onClick={(e) => e.stopPropagation()}
                    onCheckedChange={() => handleCheckboxChange(email.id)}
                  />
                  <div className="w-full">
                    <div className="flex justify-between">
                      <h6
                        className="text-sm  text-primary"
                      >
                        {email.from}
                      </h6>
                      {/* Badge */}
                      <Badge
                        className={`rounded-md ${email.label === "Promotional"
                          ? "bg-primary"
                          : email.label === "Social"
                            ? "bg-destructive text-white"
                            : email.label === "Health"
                              ? "bg-chart-4 text-white"
                              : "bg-primary text-white"
                          }`}
                      >
                        {email.label}
                      </Badge>
                    </div>

                    <p className="text-sm line-clamp-1 mt-2 mb-1  text-muted-foreground">
                      {email.subject}
                    </p>

                    <div className="flex justify-between items-center h-6">
                      <div className="flex gap-2 items-center">
                        {/* Star toggle */}
                        {email.starred ? (
                          <Icon
                            icon="tabler:star-filled"
                            height="16"
                            className="text-chart-4"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStar(email.id);
                            }}
                          />
                        ) : (
                          <Icon
                            icon="tabler:star"
                            height="16"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStar(email.id);
                            }}
                          />
                        )}

                        {/* Important toggle */}
                        <div className="btn-circle-hover  group">
                          <Icon
                            icon="tabler:alert-circle"
                            className={`${email.important ? "text-chart-3 " : ""
                              }`}
                            height={18}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleImportant(email.id);
                            }}
                          />
                        </div>

                        {/* Trash icon when checked */}
                        {checkedItems[email.id] && (
                          <Icon
                            icon="solar:trash-bin-minimalistic-outline"
                            height="17"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(email.id);
                            }}
                          />
                        )}


                      </div>
                      <p className="text-xs font-medium mt-0.5 text-muted-foreground">
                        {formatDistanceToNowStrict(new Date(email.time))} ago
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedItem>
            </div>
          ))}
        </div>
      </SimpleBar>
    </div>
  );
};

export default EmailList;
