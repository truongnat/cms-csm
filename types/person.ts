
export interface Person {
  id: number;
  orderNumber: number;
  fullName: string;
  dateOfBirth: Date;
  position: string;
  department: string;
  ethnicity: string;
  religion: string;
  
  // Học vấn
  education: string;
  educationDetail?: {
    level: "high_school" | "college" | "university";
    grade?: number;
    programType?: string;
    startYear?: number;
    endYear?: number;
    schoolName?: string;
  };
  
  // Đoàn
  unionMember: boolean;
  unionJoinDate?: Date;
  
  // Đảng
  partyMember: boolean;
  partyJoinDate?: Date;
  
  hometown: string;

  // Thông tin vợ/chồng
  spouse?: {
    fullName: string;
    dateOfBirth: Date;
    hometown: string;
    marriageDate: Date;
    marriageStatus: "married" | "separated" | "divorced" | "not_registered";
    separationDate?: Date;
    divorceDate?: Date;
    reason?: string;
  };

  // Thông tin con cái
  children?: {
    fullName: string;
    dateOfBirth: Date;
    gender: "male" | "female";
    notes?: string;
  }[];

  // Thông tin bố
  fatherName: string;
  fatherDateOfBirth: Date;
  fatherHometown: string;
  fatherStatus: "alive" | "deceased";
  fatherDeathDate?: Date;
  fatherDeathReason?: string;

  // Thông tin mẹ
  motherName: string;
  motherDateOfBirth: Date;
  motherHometown: string;
  motherStatus: "alive" | "deceased";
  motherDeathDate?: Date;
  motherDeathReason?: string;

  // Tình trạng hôn nhân của bố mẹ
  parentsMaritalStatus?: {
    status: 'together' | 'separated' | 'divorced';
    separationDate?: Date;
    divorceDate?: Date;
    reason?: string;
    childrenLivingWith?: 'father' | 'mother' | 'other';
    livingWithDetails?: string;
  };

  // Thông tin vi phạm pháp luật cá nhân
  legalViolations?: {
    beforeMilitary?: {
      time: Date;
      reason: string;
      punishment: string;
      verificationResult: string;
    }[];
  };

  // Thông tin người thân vi phạm pháp luật
  relativeViolations?: {
    relativeName: string;
    relationship: string;
    violation: string;
    violationDate: Date;
    sentence: string;
  }[];

  // Thông tin hình xăm
  tattoos?: {
    location: string; // Vị trí trên cơ thể
    description: string; // Mô tả chi tiết
    size: string; // Kích thước
    meaning?: string; // Ý nghĩa (nếu có)
  }[];

  // Thông tin vay nợ
  debts?: {
    type: "personal" | "bank" | "online_app"; // Hình thức vay
    lender: string; // Địa chỉ/tên người/tổ chức cho vay
    amount: number; // Số tiền vay
    remainingAmount: number; // Số tiền còn nợ
    startDate: Date; // Thời gian bắt đầu vay
    endDate?: Date; // Thời gian kết thúc (nếu có)
    purpose: string; // Mục đích vay
    status: "ongoing" | "completed" | "defaulted"; // Trạng thái
    interestRate?: number; // Lãi suất (nếu có)
    notes?: string; // Ghi chú thêm
  }[];

  // Người thân ở nước ngoài
  relativesAbroad?: {
    fullName: string;
    relationship: string;
    type: "work" | "study" | "business"; // Hình thức: lao động/học tập/công tác
    country: string;
    hasVisa: boolean;
    visaType?: string;
    startDate: Date;
    endDate?: Date;
    notes?: string;
  }[];

  // Bản thân đi nước ngoài
  travelHistory?: {
    country: string;
    hasVisa: boolean;
    visaType?: string;
    numberOfVisits: number;
    startDate: Date;
    endDate: Date;
    purpose: "tourism" | "work" | "study" | "business";
    verificationResult: string;
  }[];

  // Sử dụng ma túy
  drugUseHistory?: {
    type: string; // Hình thức sử dụng
    verificationResult: string;
    lastUseDate?: Date;
    rehabilitationHistory?: string;
  };

  // Gia đình chính sách
  policyFamily?: {
    type: string; // Loại gia đình chính sách
    details: string;
    benefitsReceived?: string;
    certificateNumber?: string;
  };

  // Bố mẹ bệnh hiểm nghèo
  parentsSeriousIllness?: {
    parent: "father" | "mother";
    fullName: string;
    illness: string;
    condition: string;
    treatmentLocation?: string;
    diagnosisDate?: Date;
  }[];

  // Hoàn cảnh khó khăn
  economicHardship?: {
    parent: "father" | "mother" | "both";
    parentNames: string;
    details: string;
    supportReceived?: string;
  };

  // Bố mẹ là cán bộ
  parentsOfficialPosition?: {
    parent: "father" | "mother";
    fullName: string;
    position: string;
    organization: string;
    department?: string;
    startDate?: Date;
  }[];
}
