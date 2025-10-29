
"use client";
import { Disclosure } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { cn } from "./utils";

function Accordion({ children }: { children: React.ReactNode }) {
  return <div className="w-full">{children}</div>;
}

function AccordionItem({
  label,
  children,
  className,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Disclosure>
      {({ open }) => (
        <div
          className={cn("", className)}
        >
          <Disclosure.Button
            className={cn(
              "flex w-full items-center justify-between py-2 px-2 text-sm font-medium hover:bg-sidebar-accent rounded-md focus:outline-none cursor-pointer"
            )}
          >
            {label}
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                open ? "rotate-180" : ""
              )}
            />
          </Disclosure.Button>

          <Disclosure.Panel
            className="overflow-hidden text-sm animate-accordion-down"
          >
            <div className="">{children}</div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}

export { Accordion, AccordionItem };
