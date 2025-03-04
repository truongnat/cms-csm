import { Person } from "@/types/person"

export const fakeData: Person[] = [
  {
    id: 1,
    orderNumber: 1,
    fullName: "John Doe",
    dateOfBirth: new Date("1990-01-01"),
    position: "Developer",
    department: "IT",
    ethnicity: "Kinh",
    religion: "Không",
    education: "Đại học",
    educationDetail: {
      level: "university",
      programType: "Chính quy",
      startYear: 2008,
      endYear: 2012,
      schoolName: "Đại học Bách Khoa"
    },
    unionMember: true,
    unionJoinDate: new Date("2010-05-15"),
    partyMember: false,
    hometown: "Hà Nội",
    fatherName: "John Doe Sr",
    fatherDateOfBirth: new Date("1965-03-20"),
    fatherHometown: "Hà Nội",
    fatherStatus: "alive",
    motherName: "Jane Doe",
    motherDateOfBirth: new Date("1968-07-10"),
    motherHometown: "Hà Nội",
    motherStatus: "alive",
    legalViolations: {
      beforeMilitary: [
        {
          time: new Date("2019-05-15"),
          reason: "Vi phạm giao thông",
          punishment: "Phạt hành chính 2.500.000đ",
          verificationResult: "Đã nộp phạt đầy đủ"
        }
      ]
    },
    relativeViolations: [
      {
        relativeName: "Nguyễn Văn A",
        relationship: "Chú ruột",
        violation: "Buôn bán hàng cấm",
        violationDate: new Date("2018-03-20"),
        sentence: "12 năm tù giam"
      }
    ],
    tattoos: [
      {
        location: "Cánh tay phải",
        description: "Hình rồng màu đen",
        size: "15cm x 10cm",
        meaning: "Kỷ niệm tuổi trẻ"
      }
    ],
    debts: [
      {
        type: "bank",
        lender: "Ngân hàng BIDV",
        amount: 50000000,
        remainingAmount: 30000000,
        startDate: new Date("2023-01-15"),
        endDate: new Date("2025-01-15"),
        purpose: "Mua xe máy",
        status: "ongoing",
        interestRate: 8.5
      }
    ]
  },
  {
    id: 2,
    orderNumber: 2,
    fullName: "Jane Smith",
    dateOfBirth: new Date("1992-05-15"),
    position: "Manager",
    department: "HR",
    ethnicity: "Kinh",
    religion: "Không",
    education: "Thạc sĩ",
    educationDetail: {
      level: "university",
      programType: "Chính quy",
      startYear: 2010,
      endYear: 2015,
      schoolName: "Đại học Quốc gia"
    },
    unionMember: true,
    unionJoinDate: new Date("2012-08-20"),
    partyMember: true,
    partyJoinDate: new Date("2015-10-01"),
    hometown: "Hồ Chí Minh",
    fatherName: "Smith Sr",
    fatherDateOfBirth: new Date("1962-11-05"),
    fatherHometown: "Hồ Chí Minh",
    fatherStatus: "alive",
    motherName: "Mary Smith",
    motherDateOfBirth: new Date("1965-04-15"),
    motherHometown: "Hồ Chí Minh",
    motherStatus: "alive"
  }
]
