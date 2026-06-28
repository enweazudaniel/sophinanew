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
      <div className="relative h-96 md:h-[500px] w-full overflow-hidden">
        <Image
          src="https://i.ibb.co/yFD8y6Hf/PXL-20250326-094408031.jpg"
          alt="Faculty & Staff"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-center justify-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white text-center px-4 drop-shadow-lg">Apply Now</h1>
        </div>
      </div>

      {/* Main Content */}
      <section className="section-padding container-premium">
        <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Left Column */}
          <div className="space-y-8 animate-fade-in-up">
            <div>
              <h2 className="text-primary mb-6">Applications for the 2026-27 School Year are now open!</h2>
              <p className="text-lg text-muted-foreground leading-8 mb-6">
                At Sophina School, we believe in providing a rigorous and inclusive educational
                environment for every learner. We welcome students from all backgrounds and look forward to reviewing your
                application.
              </p>
              <div className="card-premium bg-muted/50 border-primary/20">
                <p className="text-lg font-semibold text-primary mb-3">Have Questions?</p>
                <p className="text-muted-foreground">
                  Contact our admissions office:
                  <br />
                  <span className="font-semibold text-foreground">07038046878, 08027446756</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="card-elevated animate-scale-in">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="firstName" className="text-base font-semibold text-foreground mb-2 block">First Name</Label>
                <Input 
                  id="firstName" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  required 
                  className="h-12 text-base transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <Label htmlFor="lastName" className="text-base font-semibold text-foreground mb-2 block">Last Name</Label>
                <Input 
                  id="lastName" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange} 
                  required 
                  className="h-12 text-base transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                  placeholder="Enter your last name"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-base font-semibold text-foreground mb-2 block">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please include your phone number and any relevant information..."
                  className="min-h-[150px] text-base transition-all duration-300 focus:ring-2 focus:ring-primary/50 p-4 rounded-lg"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg transition-all duration-300 hover:shadow-lg"
              >
                Submit Application
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
