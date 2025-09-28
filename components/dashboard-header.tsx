"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SchoolLogo } from "@/components/school-logo"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { NotificationsMenu } from "@/components/notifications"
import { SearchBar } from "@/components/search"
import { AvatarDisplay } from "@/components/avatar-selector"

export function DashboardHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<{
    username: string
    fullName?: string
    role: string
    id: number
    avatarId?: string
  } | null>(null)

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Failed to parse user data:", error)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  const isTeacher = user?.role === "teacher" || user?.role === "admin"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="md:hidden mr-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <MobileNav pathname={pathname} isTeacher={isTeacher} />
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex items-center gap-2 md:mr-6">
          <Link href={isTeacher ? "/teacher/dashboard" : "/dashboard"} className="flex items-center gap-2">
            <SchoolLogo />
          </Link>
        </div>
        <div className="hidden md:flex">
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href={isTeacher ? "/teacher/dashboard" : "/dashboard"}
              className={`transition-colors hover:text-foreground/80 ${
                pathname === (isTeacher ? "/teacher/dashboard" : "/dashboard")
                  ? "text-foreground font-medium"
                  : "text-foreground/60"
              }`}
            >
              Dashboard
            </Link>

            {isTeacher ? (
              <>
                <Link
                  href="/teacher/students"
                  className={`transition-colors hover:text-foreground/80 ${
                    pathname.startsWith("/teacher/students") ? "text-foreground font-medium" : "text-foreground/60"
                  }`}
                >
                  Students
                </Link>
                <Link
                  href="/teacher/assignments"
                  className={`transition-colors hover:text-foreground/80 ${
                    pathname.startsWith("/teacher/assignments") ? "text-foreground font-medium" : "text-foreground/60"
                  }`}
                >
                  Assignments
                </Link>
                <Link
                  href="/teacher/exercises"
                  className={`transition-colors hover:text-foreground/80 ${
                    pathname.startsWith("/teacher/exercises") ? "text-foreground font-medium" : "text-foreground/60"
                  }`}
                >
                  Exercises
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/exercises"
                  className={`transition-colors hover:text-foreground/80 ${
                    pathname.startsWith("/exercises") ? "text-foreground font-medium" : "text-foreground/60"
                  }`}
                >
                  Exercises
                </Link>
                <Link
                  href="/assignments"
                  className={`transition-colors hover:text-foreground/80 ${
                    pathname.startsWith("/assignments") ? "text-foreground font-medium" : "text-foreground/60"
                  }`}
                >
                  Assignments
                </Link>
              </>
            )}
          </nav>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <SearchBar />

          {user && <NotificationsMenu userId={user.id} />}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 flex items-center gap-2 px-2">
                <AvatarDisplay
                  avatarId={user?.avatarId}
                  isTeacher={isTeacher}
                  size="sm"
                  fallback={user?.fullName?.charAt(0) || user?.username?.charAt(0) || "U"}
                />
                <span className="hidden md:inline-block text-sm font-medium">{user?.fullName || user?.username}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center gap-2 p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.fullName || user?.username}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.role === "teacher" ? "Teacher" : user?.role === "admin" ? "Administrator" : "Student"}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={isTeacher ? "/teacher/profile" : "/profile"}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={isTeacher ? "/teacher/settings" : "/settings"}>Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

function MobileNav({ pathname, isTeacher }: { pathname: string; isTeacher: boolean }) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <Link href={isTeacher ? "/teacher/dashboard" : "/dashboard"} className="flex items-center gap-2 px-4">
        <SchoolLogo />
      </Link>
      <div className="flex flex-col gap-1 px-2">
        <Link
          href={isTeacher ? "/teacher/dashboard" : "/dashboard"}
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
            pathname === (isTeacher ? "/teacher/dashboard" : "/dashboard") ? "bg-muted font-medium" : "hover:bg-muted"
          }`}
        >
          Dashboard
        </Link>

        {isTeacher ? (
          <>
            <Link
              href="/teacher/students"
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                pathname.startsWith("/teacher/students") ? "bg-muted font-medium" : "hover:bg-muted"
              }`}
            >
              Students
            </Link>
            <Link
              href="/teacher/assignments"
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                pathname.startsWith("/teacher/assignments") ? "bg-muted font-medium" : "hover:bg-muted"
              }`}
            >
              Assignments
            </Link>
            <Link
              href="/teacher/exercises"
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                pathname.startsWith("/teacher/exercises") ? "bg-muted font-medium" : "hover:bg-muted"
              }`}
            >
              Exercises
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/exercises"
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                pathname.startsWith("/exercises") ? "bg-muted font-medium" : "hover:bg-muted"
              }`}
            >
              Exercises
            </Link>
            <Link
              href="/assignments"
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                pathname.startsWith("/assignments") ? "bg-muted font-medium" : "hover:bg-muted"
              }`}
            >
              Assignments
            </Link>
          </>
        )}

        <Link
          href={isTeacher ? "/teacher/profile" : "/profile"}
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
            pathname.startsWith(isTeacher ? "/teacher/profile" : "/profile") ? "bg-muted font-medium" : "hover:bg-muted"
          }`}
        >
          <User className="h-4 w-4" />
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  )
}
