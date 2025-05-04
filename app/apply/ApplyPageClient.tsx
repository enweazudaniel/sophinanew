"use client"

import type React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export default function ApplyPageClient() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const response = await fetch("https://submit-form.com/HtcilwBDD", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    })
    if (response.ok) {
      alert("Form submitted successfully!")
      setFormData({ firstName: "", lastName: "", message: "" })
    } else {
      alert("Form submission failed. Please try again.")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full">
        <Image
          src="https://i.ibb.co/yFD8y6Hf/PXL-20250326-094408031.jpg"
          alt="Faculty & Staff"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Apply Now</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Column */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary">Applications for the 2025-26 School Year are now open!</h2>
            <p className="text-muted-foreground">
              At Sophina Nursery and Primary School, we believe in providing a rigorous and inclusive educational
              environment for every learner. We welcome students from all backgrounds and look forward to reviewing your
              application.
            </p>
            <p className="text-muted-foreground">Questions? Contact our admissions office: 07038046878, 08027446756</p>
          </div>

          {/* Right Column - Form */}
          <div className="bg-card rounded-lg shadow-sm p-6 border">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Do not forget to include your Phone number..."
                  className="min-h-[150px]"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-[#4EBFB4] hover:bg-[#3DA89E] text-white">
                Submit
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
