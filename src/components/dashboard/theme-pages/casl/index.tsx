'use client'
import React from 'react'
import { defineAbility } from '@casl/ability'
import { Can } from '@casl/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface actionType {
  action: string
  subject: string
}


const permissions: Record<string, actionType> = {
  CanEdit: {
    action: 'Can-Edit',
    subject: 'address',
  },
  CanDelete: {
    action: 'Can-Delete',
    subject: 'address',
  },
}


const users: Record<string, { permissions: string[] }> = {
  Admin: {
    permissions: ['CanEdit', 'CanDelete'],
  },
  Manager: {
    permissions: ['CanEdit'],
  },
  Subscriber: {
    permissions: [],
  },
}

interface addressType {
  city: string
  street: string
  type: string
}

const addresses: addressType[] = [
  {
    city: 'New York',
    street: '5684 Max Summit',
    type: 'address',
  },
  {
    city: 'Manhatten York',
    street: '5684 Max Summit',
    type: 'address',
  },
  {
    city: 'Canada street York',
    street: '5684 Max Summit',
    type: 'address',
  },
  {
    city: 'Delhi street',
    street: '5684 Max Summit',
    type: 'address',
  },
  {
    city: 'UP Chawk',
    street: '5684 Max Summit',
    type: 'address',
  },
]

const RollBaseIndex = () => {
  const [userId, setUserId] = React.useState(Object.keys(users)[0])
  const userPermissions = users[userId].permissions.map(
    (permKey: string) => permissions[permKey]
  )

  const actions = [
    ...userPermissions.reduce(
      (collection: Set<string>, { action }: { action: string }) => {
        collection.add(action)

        return collection
      },
      new Set<string>()
    ),
  ]

  const ability = defineAbility((can: (arg0: string, arg1: string) => void) => {
    userPermissions.forEach(
      ({ action, subject }: { action: string; subject: string }) => {
        can(action, subject)
      }
    )
  })
  return (
    <>
      <Card className='p-6'>
        <div className='flex gap-2'>
          {Object.entries(users).map(([id], i) => {
            return (
              <React.Fragment key={i}>
                {userId !== id ? (
                  <Button
                    variant={'outline'}
                    key={id}
                    onClick={() => setUserId(id)}>
                    {id}
                  </Button>
                ) : (
                  <Button key={id} onClick={() => setUserId(id)} >
                    {id}
                  </Button>
                )}
              </React.Fragment>
            )
          })}
        </div>

        <div className='bg-primary/5  p-4 rounded-md'>
          {users[userId].permissions.map((permission: string) => (
            <h5 key={permission} className='text-sm text-foreground'>
              {permission}
            </h5>
          ))}
        </div>

        <ul className='border-0 '>
          {addresses.map(({ city, street, type }) => (
            <li key={city} className='mb-3'>
              <div className='flex items-center gap-3'>
                <span className=' font-normal'>
                  {city}, {street}
                </span>
                {actions.map((action) => (
                  <Can I={action} a={type} ability={ability} key={action}>
                    <Button>{action}</Button>
                  </Can>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </>
  )
}

export default RollBaseIndex
