"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, MessageSquare, ThumbsUp, Flag, MoreHorizontal } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { supabase } from "@/lib/supabase"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface DiscussionProps {
  lessonId: number
  studentId: number
}

interface Comment {
  id: number
  lesson_id: number
  student_id: number
  content: string
  created_at: string
  updated_at: string | null
  likes: number
  student: {
    username: string
    full_name: string
    avatar_url: string | null
  }
}

export function Discussion({ lessonId, studentId }: DiscussionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [commentText, setCommentText] = useState("")

  useEffect(() => {
    fetchComments()
  }, [lessonId])

  const fetchComments = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          student:students(username, full_name, avatar_url)
        `)
        .eq("lesson_id", lessonId)
        .order("created_at", { ascending: false })

      if (error) throw error

      setComments(data as Comment[])
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return

    setSubmitting(true)
    try {
      const { data, error } = await supabase
        .from("comments")
        .insert({
          lesson_id: lessonId,
          student_id: studentId,
          content: commentText.trim(),
          created_at: new Date().toISOString(),
          likes: 0,
        })
        .select(`
          *,
          student:students(username, full_name, avatar_url)
        `)

      if (error) throw error

      // Add new comment to the list
      setComments([data[0] as Comment, ...comments])

      // Clear the input
      setCommentText("")
    } catch (error) {
      console.error("Error submitting comment:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleLikeComment = async (commentId: number) => {
    try {
      // Get current comment
      const comment = comments.find((c) => c.id === commentId)
      if (!comment) return

      // Update likes count
      const { error } = await supabase
        .from("comments")
        .update({ likes: comment.likes + 1 })
        .eq("id", commentId)

      if (error) throw error

      // Update local state
      setComments(comments.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c)))
    } catch (error) {
      console.error("Error liking comment:", error)
    }
  }

  const handleReportComment = async (commentId: number) => {
    try {
      // In a real app, you would have a reports table
      alert("Comment reported. Thank you for helping keep our community safe.")
    } catch (error) {
      console.error("Error reporting comment:", error)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    try {
      const { error } = await supabase.from("comments").delete().eq("id", commentId).eq("student_id", studentId) // Ensure only the author can delete

      if (error) throw error

      // Update local state
      setComments(comments.filter((c) => c.id !== commentId))
    } catch (error) {
      console.error("Error deleting comment:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Discussion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Your avatar" />
              <AvatarFallback>YA</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Share your thoughts or ask a question..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="mt-2 flex justify-end">
                <Button onClick={handleSubmitComment} disabled={!commentText.trim() || submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Post Comment
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Be the first to comment on this lesson!</div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={comment.student.avatar_url || "/placeholder.svg?height=40&width=40"}
                      alt={comment.student.full_name || comment.student.username}
                    />
                    <AvatarFallback>{(comment.student.full_name || comment.student.username).charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted p-3 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{comment.student.full_name || comment.student.username}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </div>
                      </div>
                      <p className="mt-2 text-sm">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <button
                        className="flex items-center gap-1 hover:text-primary"
                        onClick={() => handleLikeComment(comment.id)}
                      >
                        <ThumbsUp className="h-3 w-3" />
                        <span>{comment.likes > 0 ? comment.likes : "Like"}</span>
                      </button>
                      <button
                        className="flex items-center gap-1 hover:text-primary"
                        onClick={() => handleReportComment(comment.id)}
                      >
                        <Flag className="h-3 w-3" />
                        <span>Report</span>
                      </button>

                      {comment.student_id === studentId && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-1 hover:text-primary">
                              <MoreHorizontal className="h-3 w-3" />
                              <span>More</span>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-red-500 focus:text-red-500"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
