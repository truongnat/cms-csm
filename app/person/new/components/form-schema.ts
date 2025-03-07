import * as z from "zod"

export const formSchema = z.object({
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
    programType: z.string(),
    startYear: z.number().optional(),
    endYear: z.number().optional(),
    schoolName: z.string(),
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

  // Parents Marital Status - make it completely optional
  parentsMaritalStatus: z.object({
    status: z.enum(["together", "separated", "divorced"]).optional(),
    separationDate: z.string().optional(),
    divorceDate: z.string().optional(),
    reason: z.string().optional(),
    childrenLivingWith: z.enum(["father", "mother", "other"]).optional(),
    livingWithDetails: z.string().optional(),
  }).optional(), // Make the entire object optional

  // Spouse information
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

  // Children information
  children: z.array(
    z.object({
      fullName: z.string(),
      dateOfBirth: z.string(),
      gender: z.enum(["male", "female"]),
      notes: z.string().optional(),
    })
  ).optional(),
})

export type FormValues = z.infer<typeof formSchema>
