"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils/date";
import {
  User,
  GraduationCap,
  Flag,
  Users,
  Scale,
  AlertTriangle,
  Fingerprint,
  Wallet,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { usePersons } from "@/contexts/PersonContext";

interface MarriageStatus {
  married: string;
  separated: string;
  divorced: string;
  not_registered: string;
}

const MARRIAGE_STATUS: MarriageStatus = {
  married: 'Đã kết hôn',
  separated: 'Ly thân',
  divorced: 'Ly hôn',
  not_registered: 'Chưa đăng ký'
};

export default function PersonDetail() {
  const params = useParams();
  const router = useRouter();
  const { getPerson } = usePersons();

  const person = getPerson(Number(params.id));

  if (!person) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy thông tin</h1>
          <Button onClick={() => router.back()}>Quay lại</Button>
        </div>
      </div>
    );
  }

  const InfoItem = ({ label, value, isDate = false, isCurrency = false }: { 
    label: string; 
    value: string | number | null | undefined;
    isDate?: boolean;
    isCurrency?: boolean;
  }) => {
    if (value === null || value === undefined) return null;
    
    let displayValue: string;
    if (isDate) {
      displayValue = formatDate(value.toString());
    } else if (isCurrency) {
      displayValue = Number(value).toLocaleString('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
      });
    } else {
      displayValue = value.toString();
    }

    return (
      <div className="flex items-start gap-2 text-sm">
        <span className="font-medium min-w-[140px] text-muted-foreground">{label}:</span>
        <span>{displayValue}</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-10 max-w-7xl">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại
      </Button>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{person.fullName}</h1>
            <p className="text-muted-foreground mt-1">{person.position} • {person.department}</p>
          </div>
          <Button variant="outline" onClick={() => router.push(`/person/${person.id}/edit`)}>
            Chỉnh sửa
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information Card */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoItem label="Họ và tên" value={person.fullName} />
              <InfoItem label="Ngày sinh" value={person.dateOfBirth} isDate />
              <InfoItem label="Chức vụ" value={person.position} />
              <InfoItem label="Phòng ban" value={person.department} />
              <InfoItem label="Dân tộc" value={person.ethnicity} />
              <InfoItem label="Tôn giáo" value={person.religion} />
              <InfoItem label="Quê quán" value={person.hometown} />
            </CardContent>
          </Card>

          {/* Education Card */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <CardTitle>Trình độ học vấn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoItem label="Trình độ" value={person.education} />
              {person.educationDetail && (
                <>
                  <InfoItem label="Trường" value={person.educationDetail.schoolName} />
                  <InfoItem label="Hệ đào tạo" value={person.educationDetail.programType} />
                  {person.educationDetail.startYear && person.educationDetail.endYear && (
                    <InfoItem
                      label="Thời gian"
                      value={`${person.educationDetail.startYear} - ${person.educationDetail.endYear}`}
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Union and Party Card */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 gap-2">
              <Flag className="h-5 w-5 text-primary" />
              <CardTitle>Đoàn - Đảng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Đoàn viên</h3>
                  <div className="pl-4 space-y-2">
                    <Badge variant={person.unionMember ? "default" : "secondary"}>
                      {person.unionMember ? 'Có' : 'Không'}
                    </Badge>
                    {person.unionMember && person.unionJoinDate && (
                      <p className="text-sm text-muted-foreground">
                        Ngày vào: {formatDate(person.unionJoinDate)}
                      </p>
                    )}
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium mb-2">Đảng viên</h3>
                  <div className="pl-4 space-y-2">
                    <Badge variant={person.partyMember ? "default" : "secondary"}>
                      {person.partyMember ? 'Có' : 'Không'}
                    </Badge>
                    {person.partyMember && person.partyJoinDate && (
                      <p className="text-sm text-muted-foreground">
                        Ngày vào: {formatDate(person.partyJoinDate)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Family Information Card */}
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center space-y-0 gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle>Thông tin gia đình</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Father's Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Thông tin bố</h3>
                  <div className="space-y-2">
                    <InfoItem label="Họ và tên" value={person.fatherName} />
                    <InfoItem label="Ngày sinh" value={person.fatherDateOfBirth} isDate />
                    <InfoItem label="Quê quán" value={person.fatherHometown} />
                    <InfoItem
                      label="Trạng thái"
                      value={person.fatherStatus === 'alive' ? 'Còn sống' : 'Đã mất'}
                    />
                    {person.fatherStatus === 'deceased' && person.fatherDeathDate && (
                      <InfoItem label="Ngày mất" value={person.fatherDeathDate} isDate />
                    )}
                  </div>
                </div>

                {/* Mother's Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Thông tin mẹ</h3>
                  <div className="space-y-2">
                    <InfoItem label="Họ và tên" value={person.motherName} />
                    <InfoItem label="Ngày sinh" value={person.motherDateOfBirth} isDate />
                    <InfoItem label="Quê quán" value={person.motherHometown} />
                    <InfoItem
                      label="Trạng thái"
                      value={person.motherStatus === 'alive' ? 'Còn sống' : 'Đã mất'}
                    />
                    {person.motherStatus === 'deceased' && person.motherDeathDate && (
                      <InfoItem label="Ngày mất" value={person.motherDeathDate} isDate />
                    )}
                  </div>
                </div>

                {/* Spouse Information */}
                {person.spouse && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Thông tin vợ/chồng</h3>
                    <div className="space-y-2">
                      <InfoItem label="Họ và tên" value={person.spouse.fullName} />
                      <InfoItem label="Ngày sinh" value={person.spouse.dateOfBirth} isDate />
                      <InfoItem label="Quê quán" value={person.spouse.hometown} />
                      <InfoItem label="Ngày kết hôn" value={person.spouse.marriageDate} isDate />
                      <InfoItem
                        label="Tình trạng"
                        value={MARRIAGE_STATUS[person.spouse.marriageStatus as keyof MarriageStatus]}
                      />
                    </div>
                  </div>
                )}

                {/* Children Information */}
                {person.children && person.children.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Thông tin con cái</h3>
                    <div className="space-y-4">
                      {person.children.map((child, index) => (
                        <div key={index} className="space-y-2 border-l-2 border-primary/20 pl-4">
                          <InfoItem label="Họ và tên" value={child.fullName} />
                          <InfoItem label="Ngày sinh" value={child.dateOfBirth} isDate />
                          <InfoItem
                            label="Giới tính"
                            value={child.gender === 'male' ? 'Nam' : 'Nữ'}
                          />
                          {child.notes && <InfoItem label="Ghi chú" value={child.notes} />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Legal Violations Card */}
          {person.legalViolations?.beforeMilitary && person.legalViolations.beforeMilitary.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 gap-2">
                <Scale className="h-5 w-5 text-primary" />
                <CardTitle>Vi phạm pháp luật trước khi nhập ngũ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {person.legalViolations.beforeMilitary.map((violation, index) => (
                    <div key={index} className="space-y-2 border-l-2 border-primary/20 pl-4">
                      <InfoItem label="Thời gian" value={violation.time} isDate />
                      <InfoItem label="Lý do" value={violation.reason} />
                      <InfoItem label="Hình thức xử lý" value={violation.punishment} />
                      <InfoItem label="Kết quả xác minh" value={violation.verificationResult} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Relative Violations Card */}
          {person.relativeViolations && person.relativeViolations.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <CardTitle>Người thân vi phạm pháp luật</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {person.relativeViolations.map((relative, index) => (
                    <div key={index} className="space-y-2 border-l-2 border-primary/20 pl-4">
                      <InfoItem label="Họ và tên" value={relative.relativeName} />
                      <InfoItem label="Quan hệ" value={relative.relationship} />
                      <InfoItem label="Vi phạm" value={relative.violation} />
                      <InfoItem label="Thời gian" value={relative.violationDate} isDate />
                      <InfoItem label="Án phạt" value={relative.sentence} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tattoos Card */}
          {person.tattoos && person.tattoos.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 gap-2">
                <Fingerprint className="h-5 w-5 text-primary" />
                <CardTitle>Hình xăm</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {person.tattoos.map((tattoo, index) => (
                    <div key={index} className="space-y-2 border-l-2 border-primary/20 pl-4">
                      <InfoItem label="Vị trí" value={tattoo.location} />
                      <InfoItem label="Mô tả" value={tattoo.description} />
                      <InfoItem label="Kích thước" value={tattoo.size} />
                      {tattoo.meaning && <InfoItem label="Ý nghĩa" value={tattoo.meaning} />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Debts Card */}
          {person.debts && person.debts.length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center space-y-0 gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                <CardTitle>Thông tin vay nợ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {person.debts.map((debt, index) => (
                    <div key={index} className="space-y-3 border-l-2 border-primary/20 pl-4">
                      <h3 className="font-semibold">
                        {debt.type === 'personal' && 'Vay tư nhân'}
                        {debt.type === 'bank' && 'Vay ngân hàng'}
                        {debt.type === 'online_app' && 'Vay qua app'}
                      </h3>
                      <div className="space-y-2">
                        <InfoItem label="Bên cho vay" value={debt.lender} />
                        <InfoItem label="Số tiền vay" value={debt.amount} isCurrency />
                        <InfoItem label="Lý do vay" value={debt.reason} />
                        <InfoItem label="Ngày vay" value={debt.startDate} isDate />
                        <InfoItem label="Hạn trả" value={debt.dueDate} isDate />
                        <InfoItem label="Lãi suất" value={`${debt.interestRate}%/tháng`} />
                        <InfoItem label="Tình trạng" value={debt.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Economic Hardship Card */}
          {person.economicHardship && (
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                <CardTitle>Hoàn cảnh khó khăn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoItem label="Đối tượng" value={person.economicHardship.parentNames} />
                <InfoItem label="Chi tiết" value={person.economicHardship.details} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
