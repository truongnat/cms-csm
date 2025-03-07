"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Person } from "@/types/person"
import { formatDate } from "@/lib/utils/date"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { DeleteDialog } from "@/components/delete-dialog"
import { toast } from "sonner"

interface ColumnOptions {
  onDelete?: (row: Person) => Promise<void>;
}

export const createColumns = ({ onDelete }: ColumnOptions = {}): ColumnDef<Person>[] => [
  {
    accessorKey: "fullName",
    header: "Họ và tên",
    cell: ({ row }) => {
      const name = row.getValue("fullName") as string
      const date = row.original.dateOfBirth
      return (
        <div className="flex flex-col">
          <span className="font-medium">{name}</span>
          <span className="text-muted-foreground">
            {formatDate(date)}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "partyMember",
    header: () => <div className="text-center">Đảng</div>,
    cell: ({ row }) => {
      const isPartyMember = row.getValue("partyMember") as boolean;
      const joinDate = row.original.partyJoinDate;
      
      if (!isPartyMember) return <div className="text-center">Không</div>;
      
      return (
        <div className="flex flex-col items-center">
          <span>Có</span>
          {joinDate && (
            <span className="text-muted-foreground text-sm">
              {formatDate(joinDate)}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "unionMember",
    header: () => <div className="text-center">Đoàn</div>,
    cell: ({ row }) => {
      const isUnionMember = row.getValue("unionMember") as boolean;
      const joinDate = row.original.unionJoinDate;
      
      if (!isUnionMember) return <div className="text-center">Không</div>;
      
      return (
        <div className="flex flex-col items-center">
          <span>Có</span>
          {joinDate && (
            <span className="text-muted-foreground text-sm">
              {formatDate(joinDate)}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "hometown",
    header: () => <div className="text-center">Quê quán</div>,
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("hometown")}</div>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const person = row.original;
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
      const [deleteLoading, setDeleteLoading] = useState(false);

      const handleDelete = async () => {
        if (!onDelete) return;
        
        setDeleteLoading(true);
        
        try {
          await onDelete(person);
          setDeleteDialogOpen(false);
          toast.success('Xóa thông tin thành công');
        } catch (error) {
          console.error('Error deleting row:', error);
          toast.error('Có lỗi xảy ra khi xóa thông tin');
        } finally {
          setDeleteLoading(false);
        }
      };

      return (
        <div onClick={(e) => e.stopPropagation()} className="flex justify-center">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Edit:', person);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <DeleteDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleDelete}
            loading={deleteLoading}
          />
        </div>
      );
    },
  },
]
