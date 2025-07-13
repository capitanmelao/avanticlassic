import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function PaginationControls() {
  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <Button variant="ghost" size="icon" className="rounded-full">
        <ChevronLeft className="h-5 w-5" />
        <span className="sr-only">Previous page</span>
      </Button>
      <Button variant="outline" className="w-8 h-8 p-0 bg-transparent">
        1
      </Button>
      <Button variant="ghost" className="w-8 h-8 p-0">
        2
      </Button>
      <Button variant="ghost" className="w-8 h-8 p-0">
        3
      </Button>
      <Button variant="ghost" className="w-8 h-8 p-0">
        4
      </Button>
      <Button variant="ghost" size="icon" className="rounded-full">
        <ChevronRight className="h-5 w-5" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  )
}
