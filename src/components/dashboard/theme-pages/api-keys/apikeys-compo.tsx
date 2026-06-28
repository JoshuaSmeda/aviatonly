'use client'
import { Icon } from '@iconify/react/dist/iconify.js'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
} from '@/components/ui/tooltip'
import {
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  TableHeader,
} from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import SimpleBar from 'simplebar-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import GenerateApiKeyModal from './generate-apikeymodal'

const apiKeys = [
  {
    id: 1,
    name: 'Web Client API Key',
    key: 'web_live_************5182',
    status: 'Active',
    created: '11 Feb, 2025',
    lastUsed: 'Today, 09:30 AM',
    enabled: true,
  },
  {
    id: 2,
    name: 'Development API key',
    key: 'dev_live_************9471',
    status: 'Active',
    created: '19 Dec, 2024',
    lastUsed: 'Today, 01:30 AM',
    enabled: true,
  },
  {
    id: 3,
    name: 'Production API Key',
    key: 'pro_live_************3845',
    status: 'Disabled',
    created: '23 Mar, 2024',
    lastUsed: 'Today, 06:30 PM',
    enabled: false,
  },
]

function ApiKeys() {
  const [keysData, setKeysData] = useState(apiKeys)
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState<number | null>(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [deleteKeyId, setDeleteKeyId] = useState<number | null>(null)
  const handleToggle = (id: number) => {
    setKeysData((prev) =>
      prev.map((k) =>
        k.id === id
          ? {
            ...k,
            enabled: !k.enabled,
            status: k.enabled ? 'Disabled' : 'Active',
          }
          : k
      )
    )
  }

  const handleCopy = (id: number, keyValue: string) => {
    navigator.clipboard.writeText(keyValue)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000) // reset after 2s
  }

  const handleDelete = (id: number) => {
    setDeleteKeyId(id)
    setOpenDeleteDialog(true)
  }
  // Handle closing delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
  }

  // Handle confirming deletion of selected products
  const handleConfirmDelete = async () => {
    if (deleteKeyId !== null) {
      setKeysData((prev) => prev.filter((key) => key.id !== deleteKeyId))
    }
    setOpenDeleteDialog(false)
    setDeleteKeyId(null) // reset after delete
  }
  return (
    <Card >
      <CardHeader>

        <div className='flex flex-col gap-5 sm:flex-row sm:items-center justify-between border-b border-border  py-4 px-1 '>
          <div>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>
              API keys are used to authentication requests to the tailadmin API
            </CardDescription>
          </div>
          <div>
            <Button
              className=' flex items-center gap-2 '
              onClick={() => setShowModal(true)}>
              <Icon icon='solar:add-circle-linear' width={20} height={20} />
              Generate API key
            </Button>
          </div>
        </div>
      </CardHeader>


      <SimpleBar className='max-h-[580px] overflow-y-auto'>
        <CardContent>
          <div
            className='overflow-x-auto 
                '>
            <TooltipProvider>
              <Table className='min-w-full '>
                <TableHeader className='min-w-full  '>
                  <TableRow>
                    <TableHead className='  px-1'>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last used</TableHead>
                    <TableHead>Disable/Enable</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className='divide-y divide-border '>
                  {keysData.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className='whitespace-nowrap   min-w-sm p-4 px-1 '>
                        <Label >{key.name}</Label>
                        <div className='flex items-center gap-3 mt-1'>
                          <div className='flex rounded-lg'>
                            <input
                              type='text'
                              value={key.key}
                              readOnly
                              className='py-1.5 
                                                    sm:py-2 px-3 
                                                    block w-full 
                                                    border border-border rounded-s-lg 
                                                    sm:text-sm focus:z-10
                                                     focus:outline-0  
                                                    text-muted-foreground
                                                    
                                                      '
                            />
                            <span
                              className='relative inline-flex items-center min-w-fit rounded-e-md border border-s-0 border-border text-sm     
                                                '>
                              <button
                                onClick={() => handleCopy(key.id, key.key)}
                                className=' cursor-pointer flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground   transition w-full h-full'>
                                {copied === key.id ? (
                                  <>
                                    <Icon
                                      icon='solar:check-read-linear'
                                      width={20}
                                      height={20}
                                    />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Icon
                                      icon='solar:copy-linear'
                                      width={20}
                                      height={20}
                                    />
                                    Copy
                                  </>
                                )}
                              </button>
                            </span>
                          </div>
                          <Tooltip>
                            <TooltipTrigger>
                              <Button className={"bg-primary/12 text-primary  hover:bg-primary hover:text-white"}>
                                <Icon
                                  icon='solar:refresh-bold'
                                  width={20}
                                  height={20}
                                />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Regenerate</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                      <TableCell>
                        {key.status === 'Active' ? (
                          <Badge className='bg-chart-2/12 text-chart-2 '>Active</Badge>
                        ) : (
                          <Badge variant='destructive'>Disabled</Badge>
                        )}
                      </TableCell>

                      <TableCell className='text-muted-foreground whitespace-nowrap'>
                        {key.created}
                      </TableCell>
                      <TableCell className='text-muted-foreground whitespace-nowrap'>
                        {key.lastUsed}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={key.enabled}
                          onCheckedChange={(value) => handleToggle(key.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              variant={"destructive"}
                              onClick={() => handleDelete(key.id)}>
                              <Icon
                                icon='solar:trash-bin-minimalistic-outline'
                                width={20}
                                height={20}
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TooltipProvider>
          </div>
        </CardContent>
      </SimpleBar>
      <GenerateApiKeyModal
        open={showModal}
        onClose={() => setShowModal(false)}
      />
      {/* delete modal */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-center w-full'>
              Delete API Key
            </DialogTitle>
          </DialogHeader>
          <div className='text-center text-muted-foreground text-sm'>
            Are you sure you want to delete this API key?
          </div>
          <DialogFooter className='sm:justify-center'>
            <Button variant='destructive' onClick={handleConfirmDelete}>
              Delete
            </Button>
            <Button onClick={handleCloseDeleteDialog}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </Card >
  )
}

export default ApiKeys
