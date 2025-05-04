import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Free Tier */}
        <div className="rounded-lg overflow-hidden">
          <div className="bg-gradient-to-br from-purple-700 to-blue-500 p-8 flex flex-col h-full">
            <h2 className="text-2xl font-bold text-white mb-4">Free</h2>
            <div className="text-5xl font-bold text-white mb-4">
              $0<span className="text-lg font-normal">/month</span>
            </div>
            <ul className="text-white space-y-2 mb-8 flex-grow">
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5" />
                <span>1 user</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5" />
                <span>2 GB storage</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5" />
                <span>Email support</span>
              </li>
            </ul>
            <Button className="w-full bg-white text-purple-700 hover:bg-gray-100">Get Started</Button>
          </div>
        </div>

        {/* Pro Tier */}
        <div className="rounded-lg overflow-hidden">
          <div className="bg-gradient-to-br from-pink-600 to-orange-500 p-8 flex flex-col h-full">
            <h2 className="text-2xl font-bold text-white mb-4">Pro</h2>
            <div className="text-5xl font-bold text-white mb-4">
              $29<span className="text-lg font-normal">/month</span>
            </div>
            <ul className="text-white space-y-2 mb-8 flex-grow">
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5" />
                <span>5 users</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5" />
                <span>20 GB storage</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5" />
                <span>Priority email support</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5" />
                <span>Advanced features</span>
              </li>
            </ul>
            <Button className="w-full bg-white text-pink-600 hover:bg-gray-100">Upgrade to Pro</Button>
          </div>
        </div>

        {/* Enterprise Tier */}
        <div className="rounded-lg overflow-hidden">
          <div className="bg-gradient-to-br from-blue-600 to-green-500 p-8 flex flex-col h-full">
            <h2 className="text-2xl font-bold text-white mb-4">Enterprise</h2>
            <div className="text-5xl font-bold text-white mb-4">
              $99<span className="text-lg font-normal">/month</span>
            </div>
            <ul className="text-white space-y-2 mb-8 flex-grow">
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5" />
                <span>Unlimited users</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5" />
                <span>1 TB storage</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5" />
                <span>24/7 phone support</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5" />
                <span>Advanced security</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-5 w-5" />
                <span>Custom integrations</span>
              </li>
            </ul>
            <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">Contact Sales</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
