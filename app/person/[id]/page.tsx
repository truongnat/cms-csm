"use client"

import { useParams, useRouter } from "next/navigation"
import { usePersons } from "@/contexts/PersonContext"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, GraduationCap, Users, Flag, Scale, Fingerprint, Wallet, AlertTriangle, Plane, AlertCircle, Heart, Medal, Building2, Shield, Network, FileText, Briefcase } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface SocialRelationship {
  fullName: string;
  relationship: string;
  occupation: string;
  workplace: string;
  politicalBackground?: string;
  notes?: string;
}

interface SpecialNote {
  date: Date;
  content: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actionTaken?: string;
  result?: string;
}

interface Training {
  courseName: string;
  institution: string;
  startDate: Date;
  endDate: Date;
  certificate: string;
  result?: string;
}

interface Work {
  organization: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  responsibilities?: string;
  achievements?: string;
}

export default function PersonDetail() {
  const params = useParams()
  const router = useRouter()
  const { getPerson } = usePersons()

  const person = getPerson(Number(params.id))

  if (!person) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy thông tin</h1>
          <Button onClick={() => router.back()}>Quay lại</Button>
        </div>
      </div>
    )
  }

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd/MM/yyyy", { locale: vi })
  }

  const InfoItem = ({ label, value }: { label: string; value: string | null | undefined }) => {
    if (!value) return null
    return (
      <div className="flex items-start gap-2 text-sm">
        <span className="font-medium min-w-[140px] text-muted-foreground">{label}:</span>
        <span>{value}</span>
      </div>
    )
  }

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
              <InfoItem label="Ngày sinh" value={formatDate(person.dateOfBirth)} />
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
                  <InfoItem
                    label="Thời gian"
                    value={`${person.educationDetail.startYear} - ${person.educationDetail.endYear}`}
                  />
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
                    <InfoItem label="Ngày sinh" value={formatDate(person.fatherDateOfBirth)} />
                    <InfoItem label="Quê quán" value={person.fatherHometown} />
                    <InfoItem
                      label="Trạng thái"
                      value={person.fatherStatus === 'alive' ? 'Còn sống' : 'Đã mất'}
                    />
                    {person.fatherStatus === 'deceased' && person.fatherDeathDate && (
                      <InfoItem label="Ngày mất" value={formatDate(person.fatherDeathDate)} />
                    )}
                  </div>
                </div>

                {/* Mother's Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Thông tin mẹ</h3>
                  <div className="space-y-2">
                    <InfoItem label="Họ và tên" value={person.motherName} />
                    <InfoItem label="Ngày sinh" value={formatDate(person.motherDateOfBirth)} />
                    <InfoItem label="Quê quán" value={person.motherHometown} />
                    <InfoItem
                      label="Trạng thái"
                      value={person.motherStatus === 'alive' ? 'Còn sống' : 'Đã mất'}
                    />
                    {person.motherStatus === 'deceased' && person.motherDeathDate && (
                      <InfoItem label="Ngày mất" value={formatDate(person.motherDeathDate)} />
                    )}
                  </div>
                </div>

                {/* Spouse Information */}
                {person.spouse && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Thông tin vợ/chồng</h3>
                    <div className="space-y-2">
                      <InfoItem label="Họ và tên" value={person.spouse.fullName} />
                      <InfoItem label="Ngày sinh" value={formatDate(person.spouse.dateOfBirth)} />
                      <InfoItem label="Quê quán" value={person.spouse.hometown} />
                      <InfoItem label="Ngày kết hôn" value={formatDate(person.spouse.marriageDate)} />
                      <InfoItem
                        label="Tình trạng"
                        value={{
                          'married': 'Đã kết hôn',
                          'separated': 'Ly thân',
                          'divorced': 'Ly hôn',
                          'not_registered': 'Chưa đăng ký'
                        }[person.spouse.marriageStatus]}
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
                          <InfoItem label="Ngày sinh" value={formatDate(child.dateOfBirth)} />
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
                      <InfoItem label="Thời gian" value={formatDate(violation.time)} />
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
                      <InfoItem label="Thời gian" value={formatDate(relative.violationDate)} />
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
                        <InfoItem
                          label="Số tiền vay"
                          value={debt.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        />
                        <InfoItem
                          label="Số tiền còn nợ"
                          value={debt.remainingAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        />
                        <InfoItem label="Ngày vay" value={formatDate(debt.startDate)} />
                        {debt.endDate && <InfoItem label="Ngày đáo hạn" value={formatDate(debt.endDate)} />}
                        <InfoItem label="Mục đích vay" value={debt.purpose} />
                        <InfoItem
                          label="Trạng thái"
                          value={{
                            'ongoing': 'Đang vay',
                            'completed': 'Đã tất toán',
                            'defaulted': 'Quá hạn'
                          }[debt.status]}
                        />
                        {debt.interestRate && (
                          <InfoItem label="Lãi suất" value={`${debt.interestRate}%/năm`} />
                        )}
                        {debt.notes && <InfoItem label="Ghi chú" value={debt.notes} />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Relatives Abroad Card */}
          {person.relativesAbroad && person.relativesAbroad.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 gap-2">
                <Plane className="h-5 w-5 text-primary" />
                <CardTitle>Người thân ở nước ngoài</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {person.relativesAbroad.map((relative, index) => (
                    <div key={index} className="space-y-2 border-l-2 border-primary/20 pl-4">
                      <InfoItem label="Họ và tên" value={relative.fullName} />
                      <InfoItem label="Quan hệ" value={relative.relationship} />
                      <InfoItem label="Hình thức" value={{
                        'work': 'Lao động',
                        'study': 'Học tập',
                        'business': 'Công tác'
                      }[relative.type]} />
                      <InfoItem label="Quốc gia" value={relative.country} />
                      <InfoItem label="Visa" value={relative.hasVisa ? relative.visaType : 'Không'} />
                      <InfoItem label="Thời gian" value={`${formatDate(relative.startDate)} - ${relative.endDate ? formatDate(relative.endDate) : 'Hiện tại'}`} />
                      {relative.notes && <InfoItem label="Ghi chú" value={relative.notes} />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Travel History Card */}
          {person.travelHistory && person.travelHistory.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 gap-2">
                <Plane className="h-5 w-5 text-primary" />
                <CardTitle>Lịch sử đi nước ngoài</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {person.travelHistory.map((travel, index) => (
                    <div key={index} className="space-y-2 border-l-2 border-primary/20 pl-4">
                      <InfoItem label="Quốc gia" value={travel.country} />
                      <InfoItem label="Số lần" value={travel.numberOfVisits.toString()} />
                      <InfoItem label="Visa" value={travel.hasVisa ? travel.visaType : 'Không'} />
                      <InfoItem label="Thời gian" value={`${formatDate(travel.startDate)} - ${formatDate(travel.endDate)}`} />
                      <InfoItem label="Mục đích" value={{
                        'tourism': 'Du lịch',
                        'work': 'Công việc',
                        'study': 'Học tập',
                        'business': 'Công tác'
                      }[travel.purpose]} />
                      <InfoItem label="Kết quả xác minh" value={travel.verificationResult} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Drug Use History Card */}
          {person.drugUseHistory && (
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                <CardTitle>Lịch sử sử dụng ma túy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoItem label="Hình thức sử dụng" value={person.drugUseHistory.type} />
                <InfoItem label="Kết quả xác minh" value={person.drugUseHistory.verificationResult} />
                {person.drugUseHistory.lastUseDate && (
                  <InfoItem label="Lần sử dụng cuối" value={formatDate(person.drugUseHistory.lastUseDate)} />
                )}
                {person.drugUseHistory.rehabilitationHistory && (
                  <InfoItem label="Lịch sử cai nghiện" value={person.drugUseHistory.rehabilitationHistory} />
                )}
              </CardContent>
            </Card>
          )}

          {/* Policy Family Card */}
          {person.policyFamily && (
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 gap-2">
                <Medal className="h-5 w-5 text-primary" />
                <CardTitle>Gia đình chính sách</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoItem label="Loại" value={person.policyFamily.type} />
                <InfoItem label="Chi tiết" value={person.policyFamily.details} />
                {person.policyFamily.benefitsReceived && (
                  <InfoItem label="Chế độ được hưởng" value={person.policyFamily.benefitsReceived} />
                )}
                {person.policyFamily.certificateNumber && (
                  <InfoItem label="Số giấy chứng nhận" value={person.policyFamily.certificateNumber} />
                )}
              </CardContent>
            </Card>
          )}

          {/* Parents Serious Illness Card */}
          {person.parentsSeriousIllness && person.parentsSeriousIllness.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 gap-2">
                <Heart className="h-5 w-5 text-primary" />
                <CardTitle>Bố mẹ mắc bệnh hiểm nghèo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {person.parentsSeriousIllness.map((illness, index) => (
                    <div key={index} className="space-y-2 border-l-2 border-primary/20 pl-4">
                      <InfoItem label="Quan hệ" value={illness.parent === 'father' ? 'Bố' : 'Mẹ'} />
                      <InfoItem label="Họ và tên" value={illness.fullName} />
                      <InfoItem label="Bệnh" value={illness.illness} />
                      <InfoItem label="Tình trạng" value={illness.condition} />
                      {illness.treatmentLocation && (
                        <InfoItem label="Nơi điều trị" value={illness.treatmentLocation} />
                      )}
                      {illness.diagnosisDate && (
                        <InfoItem label="Ngày chẩn đoán" value={formatDate(illness.diagnosisDate)} />
                      )}
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
                {person.economicHardship.supportReceived && (
                  <InfoItem label="Hỗ trợ nhận được" value={person.economicHardship.supportReceived} />
                )}
              </CardContent>
            </Card>
          )}

          {/* Parents Official Position Card */}
          {person.parentsOfficialPosition && person.parentsOfficialPosition.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle>Bố mẹ là cán bộ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {person.parentsOfficialPosition.map((position, index) => (
                    <div key={index} className="space-y-2 border-l-2 border-primary/20 pl-4">
                      <InfoItem label="Quan hệ" value={position.parent === 'father' ? 'Bố' : 'Mẹ'} />
                      <InfoItem label="Họ và tên" value={position.fullName} />
                      <InfoItem label="Chức vụ" value={position.position} />
                      <InfoItem label="Đơn vị" value={position.organization} />
                      {position.department && (
                        <InfoItem label="Phòng ban" value={position.department} />
                      )}
                      {position.startDate && (
                        <InfoItem label="Thời gian bắt đầu" value={formatDate(position.startDate)} />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
