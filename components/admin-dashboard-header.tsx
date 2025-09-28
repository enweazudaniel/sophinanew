"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SchoolLogo } from "@/components/school-logo"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut, User, Settings, BarChart3, Users, Database } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"

export function AdminDashboardHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<{
    username: string
    fullName?: string
    role: string
    id: number
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
    router.push("/login/admin")
  }

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
              <MobileNav pathname={pathname} />
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex items-center gap-2 md:mr-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <SchoolLogo />
          </Link>
        </div>
        <div className="hidden md:flex">
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/admin/dashboard"
              className={`transition-colors hover:text-foreground/80 ${
                pathname === "/admin/dashboard" ? "text-foreground font-medium" : "text-foreground/60"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/users"
              className={`transition-colors hover:text-foreground/80 ${
                pathname.startsWith("/admin/users") ? "text-foreground font-medium" : "text-foreground/60"
              }`}
            >
              Users
            </Link>
            <Link
              href="/admin/analytics"
              className={`transition-colors hover:text-foreground/80 ${
                pathname.startsWith("/admin/analytics") ? "text-foreground font-medium" : "text-foreground/60"
              }`}
            >
              Analytics
            </Link>
            <Link
              href="/admin/database-schema"
              className={`transition-colors hover:text-foreground/80 ${
                pathname.startsWith("/admin/database") ? "text-foreground font-medium" : "text-foreground/60"
              }`}
            >
              Database
            </Link>
          </nav>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 flex items-center gap-2 px-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {user?.fullName?.charAt(0) || user?.username?.charAt(0) || "A"}
                  </span>
                </div>
                <span className="hidden md:inline-block text-sm font-medium">{user?.fullName || user?.username}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center gap-2 p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.fullName || user?.username}</p>
                  <p className="text-xs leading-none text-muted-foreground">Administrator</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
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

// Export alias for compatibility
export const DashboardHeader = AdminDashboardHeader

function MobileNav({ pathname }: { pathname: string }) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login/admin")
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <Link href="/admin/dashboard" className="flex items-center gap-2 px-4">
        <SchoolLogo />
      </Link>
      <div className="flex flex-col gap-1 px-2">
        <Link
          href="/admin/dashboard"
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
            pathname === "/admin/dashboard" ? "bg-muted font-medium" : "hover:bg-muted"
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          Dashboard
        </Link>
        <Link
          href="/admin/users"
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
            pathname.startsWith("/admin/users") ? "bg-muted font-medium" : "hover:bg-muted"
          }`}
        >
          <Users className="h-4 w-4" />
          Users
        </Link>
        <Link
          href="/admin/analytics"
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
            pathname.startsWith("/admin/analytics") ? "bg-muted font-medium" : "hover:bg-muted"
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          Analytics
        </Link>
        <Link
          href="/admin/database-schema"
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
            pathname.startsWith("/admin/database") ? "bg-muted font-medium" : "hover:bg-muted"
          }`}
        >
          <Database className="h-4 w-4" />
          Database
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
