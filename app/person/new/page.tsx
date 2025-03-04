"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { usePersons } from "@/contexts/PersonContext"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { Person } from "@/types/person"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import { Plus, Trash2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  // Required fields
  fullName: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
  dateOfBirth: z.string().min(1, "Vui lòng chọn ngày sinh"),
  position: z.string().min(1, "Vui lòng nhập chức vụ"),
  unit: z.string().min(1, "Vui lòng nhập đơn vị"),
  ethnicity: z.string().min(1, "Vui lòng nhập dân tộc"),
  religion: z.string().min(1, "Vui lòng nhập tôn giáo"),
  hometown: z.string().min(2, "Quê quán không được để trống"),
  
  // Education fields
  education: z.string().min(1, "Vui lòng nhập trình độ học vấn"),
  educationDetail: z.object({
    level: z.enum(["high_school", "college", "university"]),
    grade: z.number().optional(),
    programType: z.string().optional(),
    startYear: z.number().optional(),
    endYear: z.number().optional(),
    schoolName: z.string().optional(),
  }).optional(),

  // Union/Party fields
  unionMember: z.boolean(),
  unionJoinDate: z.string().optional(),
  partyMember: z.boolean(),
  partyJoinDate: z.string().optional(),

  // Parent information
  fatherName: z.string().min(2, "Họ và tên bố không được để trống"),
  fatherDateOfBirth: z.string().min(1, "Vui lòng chọn ngày sinh của bố"),
  fatherHometown: z.string().min(2, "Quê quán của bố không được để trống"),
  fatherStatus: z.enum(["alive", "deceased"]),
  fatherDeathDate: z.string().optional(),
  fatherDeathReason: z.string().optional(),

  motherName: z.string().min(2, "Họ và tên mẹ không được để trống"),
  motherDateOfBirth: z.string().min(1, "Vui lòng chọn ngày sinh của mẹ"),
  motherHometown: z.string().min(2, "Quê quán của mẹ không được để trống"),
  motherStatus: z.enum(["alive", "deceased"]),
  motherDeathDate: z.string().optional(),
  motherDeathReason: z.string().optional(),

  // Parents Marital Status
  parentsMaritalStatus: z.object({
    status: z.enum(["together", "separated", "divorced"]),
    separationDate: z.string().optional(),
    divorceDate: z.string().optional(),
    reason: z.string().optional(),
    childrenLivingWith: z.enum(["father", "mother", "other"]).optional(),
    livingWithDetails: z.string().optional(),
  }).optional(),

  // Policy Family
  policyFamily: z.object({
    type: z.string().optional(),
    details: z.string().optional(),
    benefitsReceived: z.string().optional(),
    certificateNumber: z.string().optional()
  }).optional(),

  // Parents Serious Illness
  parentsSeriousIllness: z.array(
    z.object({
      parent: z.enum(["father", "mother"]),
      fullName: z.string(),
      illness: z.string(),
      condition: z.string(),
      treatmentLocation: z.string().optional(),
      diagnosisDate: z.string().optional(),
    })
  ).optional(),

  // Economic Hardship
  economicHardship: z.object({
    parent: z.enum(["father", "mother", "both"]).optional(),
    parentNames: z.string().optional(),
    details: z.string().optional(),
    supportReceived: z.string().optional(),
  }).optional(),

  // Parents Official Position
  parentsOfficialPosition: z.array(
    z.object({
      parent: z.enum(["father", "mother"]),
      fullName: z.string(),
      position: z.string().optional(),
      organization: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
  ).optional(),

  children: z.array(
    z.object({
      fullName: z.string(),
      dateOfBirth: z.string(),
      gender: z.enum(["male", "female"]),
      notes: z.string().optional(),
    })
  ).optional(),

  // Add spouse field definition
  spouse: z.object({
    fullName: z.string(),
    dateOfBirth: z.string(),
    hometown: z.string(),
    marriageDate: z.string(),
    marriageStatus: z.enum(["married", "separated", "divorced", "not_registered"]),
    separationDate: z.string().optional(),
    divorceDate: z.string().optional(),
    reason: z.string().optional(),
  }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewPerson() {
  const router = useRouter();
  const { persons, setPersons } = usePersons();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      hometown: "",
      position: "",
      unit: "",
      ethnicity: "",
      religion: "",
      education: "",
      unionMember: false,
      partyMember: false,
      fatherName: "",
      fatherDateOfBirth: "",
      fatherHometown: "",
      fatherStatus: "alive",
      motherName: "",
      motherDateOfBirth: "",
      motherHometown: "",
      motherStatus: "alive",
      parentsSeriousIllness: [{
        parent: "father",
        fullName: "",
        illness: "",
        condition: "",
        treatmentLocation: "",
      }],
      parentsOfficialPosition: [],
      spouse: {
        fullName: "",
        dateOfBirth: "",
        hometown: "",
        marriageDate: "",
        marriageStatus: "married" as const,
        separationDate: undefined,
        divorceDate: undefined,
        reason: undefined
      },
      children: [],
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const newPerson = {
        id: Math.max(...persons.map(p => p.id), 0) + 1,
        orderNumber: Math.max(...persons.map(p => p.orderNumber), 0) + 1,
        department: values.unit, // Using the unit field as department
        ...values,
        dateOfBirth: new Date(values.dateOfBirth),
        fatherDateOfBirth: new Date(values.fatherDateOfBirth),
        motherDateOfBirth: new Date(values.motherDateOfBirth),
        unionJoinDate: values.unionJoinDate ? new Date(values.unionJoinDate) : undefined,
        partyJoinDate: values.partyJoinDate ? new Date(values.partyJoinDate) : undefined,
      };

      setPersons(prev => [...prev, newPerson as Person]);
      toast.success("Thêm thông tin thành công");
      router.push("/");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm thông tin");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại
      </Button>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Thêm thông tin mới</h1>
          <p className="text-muted-foreground mt-1">Nhập thông tin cá nhân</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Thông tin cơ bản - Required */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
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
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày sinh <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <DatePicker {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hometown"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quê quán <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chức vụ <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Đơn vị <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Học vấn - Required */}
            <Card>
              <CardHeader>
                <CardTitle>Học vấn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trình độ <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="educationDetail.level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cấp học</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn cấp học" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high_school">THPT</SelectItem>
                            <SelectItem value="college">Cao đẳng</SelectItem>
                            <SelectItem value="university">Đại học</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="educationDetail.schoolName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên trường</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="educationDetail.programType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hệ đào tạo</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="educationDetail.startYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Năm bắt đầu</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="educationDetail.endYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Năm kết thúc</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Đoàn - Đảng - Required */}
            <Card>
              <CardHeader>
                <CardTitle>Đoàn - Đảng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="unionMember"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Đoàn viên <span className="text-red-500">*</span></FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="unionJoinDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày vào Đoàn <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <DatePicker {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="partyMember"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Đảng viên <span className="text-red-500">*</span></FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="partyJoinDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày vào Đảng <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <DatePicker {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Thông tin gia đình - Required parents info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin gia đình</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fatherName"
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
                    control={form.control}
                    name="fatherDateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày sinh <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <DatePicker {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fatherHometown"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quê quán <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fatherStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trạng thái</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="alive">Còn sống</SelectItem>
                            <SelectItem value="deceased">Đã mất</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch("fatherStatus") === "deceased" && (
                    <>
                      <FormField
                        control={form.control}
                        name="fatherDeathDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ngày mất</FormLabel>
                            <FormControl>
                              <DatePicker {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="fatherDeathReason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nguyên nhân</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                  <FormField
                    control={form.control}
                    name="motherName"
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
                    control={form.control}
                    name="motherDateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày sinh <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <DatePicker {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="motherHometown"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quê quán <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="motherStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trạng thái</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="alive">Còn sống</SelectItem>
                            <SelectItem value="deceased">Đã mất</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch("motherStatus") === "deceased" && (
                    <>
                      <FormField
                        control={form.control}
                        name="motherDeathDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ngày mất</FormLabel>
                            <FormControl>
                              <DatePicker {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="motherDeathReason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nguyên nhân</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Parents Marital Status */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Tình trạng hôn nhân của bố mẹ</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="parentsMaritalStatus.status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="together">Đang sống cùng nhau</SelectItem>
                          <SelectItem value="separated">Ly thân</SelectItem>
                          <SelectItem value="divorced">Ly hôn</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(form.watch("parentsMaritalStatus.status") === "separated" || 
                  form.watch("parentsMaritalStatus.status") === "divorced") && (
                  <>
                    <FormField
                      control={form.control}
                      name="parentsMaritalStatus.reason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lý do</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="parentsMaritalStatus.childrenLivingWith"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Con cái sống cùng</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn người giám hộ" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="father">Bố</SelectItem>
                              <SelectItem value="mother">Mẹ</SelectItem>
                              <SelectItem value="other">Khác</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("parentsMaritalStatus.childrenLivingWith") === "other" && (
                      <FormField
                        control={form.control}
                        name="parentsMaritalStatus.livingWithDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chi tiết</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Optional Information Sections */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin bổ sung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Thông tin vợ/chồng */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Thông tin vợ/chồng</CardTitle>
                    {!form.watch("spouse") && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => form.setValue("spouse", {
                          fullName: "",
                          dateOfBirth: "",
                          hometown: "",
                          marriageDate: "",
                          marriageStatus: "married" as const
                        })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm thông tin
                      </Button>
                    )}
                  </CardHeader>
                  {form.watch("spouse") && (
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="spouse.fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Họ và tên</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="spouse.dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ngày sinh</FormLabel>
                              <FormControl>
                                <DatePicker {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="spouse.hometown"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quê quán</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="spouse.marriageDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ngày kết hôn</FormLabel>
                              <FormControl>
                                <DatePicker {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="spouse.marriageStatus"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tình trạng hôn nhân</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn tình trạng" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="married">Đã kết hôn</SelectItem>
                                  <SelectItem value="separated">Ly thân</SelectItem>
                                  <SelectItem value="divorced">Ly hôn</SelectItem>
                                  <SelectItem value="not_registered">Chưa đăng ký kết hôn</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => form.setValue("spouse", undefined)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa thông tin
                      </Button>
                    </CardContent>
                  )}
                </Card>

                {/* Thông tin con cái */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Thông tin con cái</CardTitle>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentChildren = form.watch("children") || [];
                        form.setValue("children", [
                          ...currentChildren,
                          { fullName: "", dateOfBirth: "", gender: "male" as const }
                        ]);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm con
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {form.watch("children")?.map((_, index) => (
                      <div key={index} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Con thứ {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const currentChildren = form.watch("children") || [];
                              form.setValue("children", 
                                currentChildren.filter((_, i) => i !== index)
                              );
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`children.${index}.fullName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Họ và tên</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`children.${index}.dateOfBirth`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Ngày sinh</FormLabel>
                                <FormControl>
                                  <DatePicker {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`children.${index}.gender`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Giới tính</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn giới tính" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="male">Nam</SelectItem>
                                    <SelectItem value="female">Nữ</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Thông tin gia đình chính sách */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Thông tin gia đình chính sách</CardTitle>
                    {!form.watch("policyFamily") && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => form.setValue("policyFamily", {
                          type: "",
                          details: "",
                          benefitsReceived: "",
                          certificateNumber: ""
                        })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm thông tin
                      </Button>
                    )}
                  </CardHeader>
                  {form.watch("policyFamily") && (
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="policyFamily.type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Loại gia đình chính sách</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="policyFamily.certificateNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Số giấy chứng nhận</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="policyFamily.details"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>Chi tiết</FormLabel>
                              <FormControl>
                                <Textarea {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="policyFamily.benefitsReceived"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>Chế độ được hưởng</FormLabel>
                              <FormControl>
                                <Textarea {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => form.setValue("policyFamily", undefined)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa thông tin
                      </Button>
                    </CardContent>
                  )}
                </Card>

                {/* Parents Serious Illness Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin bệnh hiểm nghèo của bố mẹ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {form.watch("parentsSeriousIllness")?.map((_, index) => (
                      <div key={index} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`parentsSeriousIllness.${index}.parent`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bố/Mẹ</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn bố/mẹ" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="father">Bố</SelectItem>
                                    <SelectItem value="mother">Mẹ</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`parentsSeriousIllness.${index}.illness`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tên bệnh</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`parentsSeriousIllness.${index}.condition`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tình trạng</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`parentsSeriousIllness.${index}.treatmentLocation`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nơi điều trị</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => {
                        const currentIllnesses = form.watch("parentsSeriousIllness") || [];
                        form.setValue("parentsSeriousIllness", [
                          ...currentIllnesses,
                          {
                            parent: "father",
                            fullName: "",
                            illness: "",
                            condition: "",
                            treatmentLocation: "",
                          }
                        ]);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm thông tin
                    </Button>
                  </CardContent>
                </Card>

                {/* Economic Hardship Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Hoàn cảnh khó khăn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="economicHardship.parent"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bố/Mẹ gặp khó khăn</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn bố/mẹ" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="father">Bố</SelectItem>
                                <SelectItem value="mother">Mẹ</SelectItem>
                                <SelectItem value="both">Cả hai</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="economicHardship.details"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chi tiết hoàn cảnh</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="economicHardship.supportReceived"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hỗ trợ đã nhận</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Parents Official Position Information */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Thông tin chức vụ của bố mẹ</CardTitle>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentPositions = form.watch("parentsOfficialPosition") || [];
                        form.setValue("parentsOfficialPosition", [
                          ...currentPositions,
                          {
                            parent: "father",
                            fullName: "",
                            position: "",
                            organization: "",
                          }
                        ]);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm thông tin
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {form.watch("parentsOfficialPosition")?.map((_, index) => (
                      <div key={index} className="space-y-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`parentsOfficialPosition.${index}.parent`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bố/Mẹ</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn bố/mẹ" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="father">Bố</SelectItem>
                                    <SelectItem value="mother">Mẹ</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`parentsOfficialPosition.${index}.position`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Chức vụ</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`parentsOfficialPosition.${index}.organization`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tổ chức/Đơn vị</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const currentPositions = form.watch("parentsOfficialPosition") || [];
                            form.setValue(
                              "parentsOfficialPosition",
                              currentPositions.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Hủy
              </Button>
              <Button type="submit">Lưu</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
