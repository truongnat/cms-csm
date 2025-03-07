
export interface Person {
  id: number;
  orderNumber: number;
  department: string;
  fullName: string;
  dateOfBirth: Date;
  position: string;
  unit: string;
  ethnicity: string;
  religion: string;
  hometown: string;
  education: string;
  educationDetail?: {
    level: "high_school" | "vocational" | "college" | "university";
    grade?: number;
    programType?: string;
    startYear?: number;
    endYear?: number;
    schoolName?: string;
  };
  unionMember: boolean;
  unionJoinDate?: Date;
  partyMember: boolean;
  partyJoinDate?: Date;
  fatherName: string;
  fatherDateOfBirth: Date;
  fatherHometown: string;
  fatherStatus: "alive" | "deceased";
  fatherDeathDate?: string;
  fatherDeathReason?: string;
  motherName: string;
  motherDateOfBirth: Date;
  motherHometown: string;
  motherStatus: "alive" | "deceased";
  motherDeathDate?: string;
  motherDeathReason?: string;
  // ... add other fields as needed
}
