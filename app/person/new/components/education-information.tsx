import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Control } from "react-hook-form"
import { FormValues } from "./form-schema"

interface EducationInformationProps {
  control: Control<FormValues>
}

export function EducationInformation({ control }: EducationInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Học vấn</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education fields */}
        </div>
      </CardContent>
    </Card>
  )
}