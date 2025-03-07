import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Control } from "react-hook-form"
import { FormValues } from "./form-schema"
import { DatePicker } from "@/components/ui/date-picker"

interface BasicInformationProps {
  control: Control<FormValues>
}

export function BasicInformation({ control }: BasicInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cơ bản</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày sinh <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} placeholder="dd/mm/yyyy" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Add other basic fields */}
        </div>
      </CardContent>
    </Card>
  )
}
