"use client"

import { createContext, useContext, ReactNode } from 'react'
import { Person } from '@/types/person'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface PersonContextType {
  persons: Person[]
  setPersons: (persons: Person[] | ((prev: Person[]) => Person[])) => void
  getPerson: (id: number) => Person | undefined
  updatePerson: (person: Person) => void
  deletePerson: (id: number) => void
}

const PersonContext = createContext<PersonContextType | undefined>(undefined)

export function PersonProvider({ children, initialData }: { children: ReactNode, initialData: Person[] }) {
  const [persons, setPersons] = useLocalStorage<Person[]>('persons', initialData)

  const getPerson = (id: number) => {
    return persons.find(p => p.id === id)
  }

  const updatePerson = (updatedPerson: Person) => {
    setPersons(prev => prev.map(p => 
      p.id === updatedPerson.id ? updatedPerson : p
    ))
  }

  const deletePerson = (id: number) => {
    setPersons(prev => prev.filter(p => p.id !== id))
  }

  return (
    <PersonContext.Provider value={{
      persons,
      setPersons,
      getPerson,
      updatePerson,
      deletePerson,
    }}>
      {children}
    </PersonContext.Provider>
  )
}

export function usePersons() {
  const context = useContext(PersonContext)
  if (context === undefined) {
    throw new Error('usePersons must be used within a PersonProvider')
  }
  return context
}



