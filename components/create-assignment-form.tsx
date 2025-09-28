"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

const assignmentFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  assignment_type: z.string().min(1, "Please select an assignment type"),
  due_date: z.date().optional(),
  target_type: z.enum(["all", "class"]),
  class_id: z.string().optional(),
})

type AssignmentFormValues = z.infer<typeof assignmentFormSchema>

export function CreateAssignmentForm() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([])
  const [isLoadingClasses, setIsLoadingClasses] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      title: "",
      description: "",
      assignment_type: "",
      target_type: "all",
      class_id: "",
    },
  })

  const targetType = form.watch("target_type")

  useEffect(() => {
    async function fetchClasses() {
      if (!open) return

      setIsLoadingClasses(true)
      try {
        const { data: classesData, error } = await supabase.from("classes").select("id, name").order("name")

        if (error) {
          console.error("Error fetching classes:", error)
          toast({
            title: "Error",
            description: "Failed to load classes",
            variant: "destructive",
          })
        } else {
          setClasses(classesData || [])
        }
      } catch (error) {
        console.error("Error fetching classes:", error)
      } finally {
        setIsLoadingClasses(false)
      }
    }

    fetchClasses()
  }, [open, toast])

  async function onSubmit(data: AssignmentFormValues) {
    setIsSubmitting(true)

    try {
      // Get current user
      const storedUser = localStorage.getItem("user")
      if (!storedUser) {
        throw new Error("User not found. Please log in again.")
      }

      const user = JSON.parse(storedUser)
      console.log("Current user:", user)

      // Prepare the request data
      const requestData = {
        title: data.title,
        description: data.description,
        assignment_type: data.assignment_type,
        due_date: data.due_date ? data.due_date.toISOString() : null,
        target_type: data.target_type,
        class_id: data.target_type === "class" ? data.class_id : null,
        created_by: user.id,
      }

      console.log("Sending assignment data:", requestData)

      // Call the API
      const response = await fetch("/api/assignments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      const result = await response.json()
      console.log("API response:", result)

      if (!response.ok) {
        throw new Error(result.details || result.error || "Failed to create assignment")
      }

      toast({
        title: "Success",
        description: "Assignment created successfully!",
      })

      // Reset form and close dialog
      form.reset()
      setOpen(false)

      // Refresh the page to show new assignment
      router.refresh()
    } catch (error) {
      console.error("Error creating assignment:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create assignment",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Assignment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Assignment</DialogTitle>
          <DialogDescription>Create a new assignment for your students. Fill out the form below.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter assignment title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter assignment description and instructions"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="assignment_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignment Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="essay">Essay</SelectItem>
                        <SelectItem value="reading">Reading</SelectItem>
                        <SelectItem value="grammar">Grammar</SelectItem>
                        <SelectItem value="vocabulary">Vocabulary</SelectItem>
                        <SelectItem value="speaking">Speaking</SelectItem>
                        <SelectItem value="listening">Listening</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Optional due date</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="target_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign To</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All Students</SelectItem>
                      <SelectItem value="class">Specific Class</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Choose who will receive this assignment</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {targetType === "class" && (
              <FormField
                control={form.control}
                name="class_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Class *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingClasses ? (
                          <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : classes.length > 0 ? (
                          classes.map((classItem) => (
                            <SelectItem key={classItem.id} value={classItem.id}>
                              {classItem.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            No classes available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Assignment
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
