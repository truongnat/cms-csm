"use client"

import { usePersons } from "@/contexts/PersonContext"
import { createColumns } from "./columns"
import { DataTable } from "@/components/data-table"
import { Person } from "@/types/person"

export default function Home() {
  const { persons, deletePerson } = usePersons()

  const handleDeleteRow = async (person: Person) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    deletePerson(person.id)
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable 
        columns={createColumns({ 
          onDelete: handleDeleteRow
        })}
        data={persons}
      />
    </div>
  )
}
