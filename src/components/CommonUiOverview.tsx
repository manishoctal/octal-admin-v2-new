import { useState, useEffect } from 'react';
import * as React from "react"; // ← add this
import { DateRangePicker } from './common/DateRangePicker';
import { useTranslation } from './TranslationContext';
import { Button } from './ui/button';
import { SuccessToastMessage } from './common/sonner';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionItem } from './ui/accordion';
import { Badge } from './ui/badge'
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from './ui/card';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from './ui/carousel'
import { Checkbox } from './ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from './ui/dropdown-menu';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './ui/tooltip'
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption
} from './ui/table'
import { Switch } from './ui/switch';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

import { Progress } from "./ui/progress"
import { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from './ui/popover'
import {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from './ui/pagination'

import {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
  from "./ui/alert-dialog"
import { Calendar } from './ui/calendar';


import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
} from "./ui/context-menu";

// import * as Recharts from "recharts"; // Recharts primitives


interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}
export function UiComponentPreview() {
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [checked, setChecked] = React.useState(true);
  const [selectedOption, setSelectedOption] = React.useState("option1");

  return (
    <div className="p-6 space-y-10">
      <h2 className="text-3xl font-bold mb-6">UI Component Preview</h2>

      {/* ====== Breadcrumb Preview ====== */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Breadcrumb</h3>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </CardContent>
      </Card>

      {/* ====== Buttons Preview ====== */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Buttons</h3>
          <div className="flex flex-wrap gap-3">
            <Button>Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button disabled>Disabled</Button>
          </div>
        </CardContent>
      </Card>

      {/* ====== Input Preview ====== */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Inputs</h3>
          <div className="space-y-2">
            <Input placeholder="Type something..." />
            <Input type="password" placeholder="Password field" />
          </div>
        </CardContent>
      </Card>

      {/* ====== Dialog Preview ====== */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Dialog</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Example Dialog</DialogTitle>
                <DialogDescription>
                  This is a demo of the dialog component.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* ====== Tabs Preview ====== */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Tabs</h3>
          <Tabs defaultValue="account" className="w-full max-w-md">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="p-4 border rounded-md">
              Make changes to your account here.
            </TabsContent>
            <TabsContent value="password" className="p-4 border rounded-md">
              Change your password here.
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* ====== Separator Example ====== */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Separator</h3>
          <div className="space-y-2">
            <p>Section 1</p>
            <Separator />
            <p>Section 2</p>
          </div>
        </CardContent>
      </Card>

      {/* ====== Accordian  Example ====== */}

      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Accordion</h3>
          <Accordion>
            <AccordionItem label="What is Radix UI?">
              Radix UI is a set of unstyled, accessible components for building React applications.
            </AccordionItem>
            <AccordionItem label="Why use Radix?">
              It provides fully accessible primitives and allows complete control over styling.
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* ====== Badges Preview ====== */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Badges</h3>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="warning">Warning</Badge>
          </div>
        </CardContent>
      </Card>

      {/* ====== Card Component Preview ====== */}
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>This is a description for the card component.</CardDescription>
          <CardAction>
            <Button size="sm">Action</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p>
            This is the main content of the card. You can put text, images, or any other components here.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm">Footer Action</Button>
        </CardFooter>
      </Card>

      {/* ====== Checkbox Preview ====== */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Checkbox</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Checkbox id="checkbox1" />
              <label htmlFor="checkbox1" className="text-sm">Option 1</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="checkbox2" defaultChecked />
              <label htmlFor="checkbox2" className="text-sm">Option 2 (Checked)</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="checkbox3" disabled />
              <label htmlFor="checkbox3" className="text-sm">Option 3 (Disabled)</label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ====== Dropdown Menu Preview ====== */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Dropdown Menu</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Open Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>New File</DropdownMenuItem>
              <DropdownMenuItem>Copy Link</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>Show Hidden</DropdownMenuCheckboxItem>
              <DropdownMenuRadioGroup value="option1">
                <DropdownMenuRadioItem value="option1">Option 1</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="option2">Option 2</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Sub Option 1</DropdownMenuItem>
                  <DropdownMenuItem>Sub Option 2</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

      {/* ====== Tooltip Preview ====== */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Tooltip</h3>
          <span className="p-6 space-y-4 pl-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button>Hover me</Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                This is a tooltip message at top.
              </TooltipContent>
            </Tooltip>
          </span>
          <span className="p-6 space-y-4 pl-0">
            <Tooltip >
              <TooltipTrigger asChild>
                <Button>Hover me</Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                This is a tooltip message at bottom.
              </TooltipContent>
            </Tooltip>
          </span>
          <span className="p-6 space-y-4 pl-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button>Hover me</Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                This is a tooltip message at left.
              </TooltipContent>
            </Tooltip>
          </span>
          <span className="p-6 space-y-4 pl-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button>Hover me</Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                This is a tooltip message at right.
              </TooltipContent>
            </Tooltip>
          </span>
        </CardContent>
      </Card>

      {/* ====== Table Preview ====== */}
      <Card>
        <CardHeader>
          <CardTitle>Table Preview</CardTitle>
          <CardDescription>
            Example of your Table, TableHead, TableRow, and TableCell components.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>John Doe</TableCell>
                <TableCell>john@example.com</TableCell>
                <TableCell>Active</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jane Smith</TableCell>
                <TableCell>jane@example.com</TableCell>
                <TableCell>Inactive</TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>2 users listed</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      {/* ====== Switch Preview ====== */}
      <Card>
        <CardHeader>
          <CardTitle>Switch Preview</CardTitle>
          <CardDescription>
            Example of your Switch component with interactive toggle.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <Switch id="switch-1" />
          <label htmlFor="switch-1" className="text-sm">
            Enable notifications
          </label>
        </CardContent>
      </Card>

      {/* Select Preview */}

      <Card>
        <CardHeader>
          <CardTitle>Select Preview</CardTitle>
          <CardDescription>
            Example of your Select component with interactive options.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <Select defaultValue="option1">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Choose an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Options</SelectLabel>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Progress preview */}

      <Card>
        <CardHeader>
          <CardTitle>Progress Preview</CardTitle>
          <CardDescription>
            Example of your Progress component with a dynamic value.
          </CardDescription>
        </CardHeader>

        <CardContent className=" p-6 space-y-4 flex flex-col gap-3 w-100"  >
          <Progress className="h-2 rounded-full" value={25} />
          <Progress className="h-2 rounded-full" value={50} />
          <Progress className="h-2 rounded-full" value={75} />
          <Progress className="h-2 rounded-full" value={100} />
        </CardContent>
      </Card>

      {/* PopOver preview */}
      <Card>
        <CardHeader>
          <CardTitle>Popover Preview</CardTitle>
          <CardDescription>
            Example of your Popover component with a trigger button.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <Popover>
            <PopoverTrigger asChild>
              <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/80">
                Open Popover
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <p className="text-sm text-muted-foreground">
                This is the content inside the Popover.
              </p>
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {/* Pagination preview */}

      <Card>
        <CardHeader>
          <CardTitle>Pagination Preview</CardTitle>
          <CardDescription>
            Example of your Pagination component with previous, next, and page links.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <Pagination  >
            <PaginationContent>
              <PaginationPrevious />
              <PaginationItem>
                <PaginationLink>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive>2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>3</PaginationLink>
              </PaginationItem>
              <PaginationEllipsis />
              <PaginationItem>
                <PaginationLink>10</PaginationLink>
              </PaginationItem>
              <PaginationNext />
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>

      {/* Alert dialog */}

      <Card>
        <CardHeader>
          <CardTitle>Alert Dialog Preview</CardTitle>
          <CardDescription>
            Example of your AlertDialog component for confirming actions.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* Calendar preview */}

      <Card>
        <CardHeader>
          <CardTitle>Calendar Preview</CardTitle>
          <CardDescription>
            Example of your Calendar component with a date picker.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4" >
          <Calendar
            mode="single"
            selected={new Date()}
            onSelect={(date) => console.log("Selected date:", date)}

          />
        </CardContent>
      </Card>

      {/* Carousel preview */}

      <Card>
        <CardHeader>
          <CardTitle>Carousel Preview</CardTitle>
          <CardDescription>
            Example of your Carousel component with interactive navigation.
          </CardDescription>
        </CardHeader>

        <CardContent className='p-6 space-y-4'>
          <Carousel className="w-full max-w-md mx-10">
            <CarouselContent>
              {[1, 2, 3, 4, 5].map((num) => (
                <CarouselItem key={num}>
                  <div className="flex items-center justify-center h-40 rounded-lg border bg-muted text-muted-foreground text-xl font-medium">
                    Slide {num}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </CardContent>
      </Card>

      {/* Context menu preview */}

      <Card  >
        <CardHeader>
          <CardTitle>Context Menu Preview</CardTitle>
          <CardDescription>Right click on the card to see options</CardDescription>
        </CardHeader>
        <CardContent className="w-full max-w-md mx-10 p-6 space-y-4" >
          <ContextMenu >
            <ContextMenuTrigger>
              <div className="p-4 border rounded-md text-center cursor-context-menu">
                Right-click here
              </div>
            </ContextMenuTrigger>

            <ContextMenuContent className="w-56">
              <ContextMenuLabel>Actions</ContextMenuLabel>
              <ContextMenuItem onSelect={() => alert("Clicked Edit")}>
                Edit
                <ContextMenuShortcut>⌘E</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem onSelect={() => alert("Clicked Delete")} variant="destructive">
                Delete
                <ContextMenuShortcut>⌘D</ContextMenuShortcut>
              </ContextMenuItem>

              <ContextMenuSeparator />

              <ContextMenuCheckboxItem
                checked={checked}
                onCheckedChange={() => setChecked(!checked)}
              >
                Enable Feature
              </ContextMenuCheckboxItem>

              <ContextMenuRadioGroup
                value={selectedOption}
                onValueChange={(val) => setSelectedOption(val)}
              >
                <ContextMenuRadioItem value="option1">Option 1</ContextMenuRadioItem>
                <ContextMenuRadioItem value="option2">Option 2</ContextMenuRadioItem>
              </ContextMenuRadioGroup>

              <ContextMenuSub>
                <ContextMenuSubTrigger>More Options</ContextMenuSubTrigger>
                <ContextMenuSubContent>
                  <ContextMenuItem onSelect={() => alert("Sub Option 1")}>
                    Sub Option 1
                  </ContextMenuItem>
                  <ContextMenuItem onSelect={() => alert("Sub Option 2")}>
                    Sub Option 2
                  </ContextMenuItem>
                </ContextMenuSubContent>
              </ContextMenuSub>
            </ContextMenuContent>
          </ContextMenu>
        </CardContent>
      </Card>


    </div>
  );
}




