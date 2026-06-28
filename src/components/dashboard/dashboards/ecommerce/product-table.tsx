'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import { cn } from '@/lib/utils'
import { CirclePlus, EllipsisVertical, SquarePen, Trash } from 'lucide-react'

const ProductTable = () => {
    const ProductTableData = [
        {
            id: "#123",
            name: 'iPhone 13 pro max-Pacific Blue-128GB storage',
            payment: '$180',
            paymentstatus: 'Partially paid',
            process: 45,
            processcolor: '**:data-[slot=progress-indicator]:bg-orange-400',
            statuscolor: 'bg-muted text-primary',
            statustext: 'Confirmed',
            profile: 'https://images.shadcnspace.com/assets/profiles/user-1.jpg',
            customername: 'Arlene McCoy',
            customeremail: 'macoy@arlene.com',
        },
        {
            id: "#553",
            name: 'Apple MacBook Pro 13 inch-M1-8/256GB-space',
            payment: '$120',
            paymentstatus: 'Full paid',
            process: 100,
            processcolor: '**:data-[slot=progress-indicator]:bg-emerald-600',
            statuscolor: 'bg-emerald-600/10 text-emerald-600',
            statustext: 'Completed',
            profile: 'https://images.shadcnspace.com/assets/profiles/user-3.jpg',
            customername: 'Jerome Bell',
            customeremail: 'belljerome@yahoo.com',
        },
        {
            id: "#343",
            name: 'PlayStation 5 DualSense Wireless Controller',
            payment: '$120',
            paymentstatus: 'Cancelled',
            process: 100,
            processcolor: '**:data-[slot=progress-indicator]:bg-emerald-600',
            statuscolor: 'bg-red-500/10 text-red-500',
            statustext: 'Cancelled',
            profile: 'https://images.shadcnspace.com/assets/profiles/user-7.jpg',
            customername: 'Jacob Jones',
            customeremail: 'jones009@hotmail.com',
        },
        {
            id: "#899",
            name: 'Amazon Basics Mesh, Mid-Back, Swivel Office',
            payment: '$120',
            paymentstatus: 'Cancelled',
            process: 100,
            processcolor: '**:data-[slot=progress-indicator]:bg-emerald-600',
            statuscolor: 'bg-red-500/10 text-red-500',
            statustext: 'Cancelled',
            profile: 'https://images.shadcnspace.com/assets/profiles/user-2.jpg',
            customername: 'Ben Smith',
            customeremail: 'ben@smith.com',
        },
        {
            id: "#665",
            name: 'Sony X85J 75 Inch Sony 4K Ultra HD LED Smart',
            payment: '$140',
            paymentstatus: 'Pending',
            process: 100,
            processcolor: '**:data-[slot=progress-indicator]:bg-orange-400',
            statuscolor: 'bg-muted text-primary',
            statustext: 'Confirmed',
            profile: 'https://images.shadcnspace.com/assets/profiles/user-5.jpg',
            customername: 'John Doe',
            customeremail: 'john@doe.com',
        }
    ]

    const tableActionData = [
        { icon: CirclePlus, listtitle: 'Add' },
        { icon: SquarePen, listtitle: 'Edit' },
        { icon: Trash, listtitle: 'Delete' },
    ]

    return (
        <Card className='py-0'>
            <SimpleBar className='max-h-130'>
                <div className='overflow-x-auto'>
                    <Table>
                        <TableHeader>
                            <TableRow className='hover:bg-transparent'>

                                {/* ✅ ID */}
                                <TableHead className='text-sm font-semibold ps-6 h-11'>Order Id</TableHead>

                                {/* ✅ USER */}
                                <TableHead className='text-sm font-semibold h-11'>User</TableHead>

                                <TableHead className='text-sm font-semibold h-11'>Products</TableHead>
                                <TableHead className='text-sm font-semibold h-11'>Payment</TableHead>
                                <TableHead className='text-sm font-semibold h-11'>Status</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody className='divide-y divide-border'>
                            {ProductTableData.map((item, index) => (
                                <TableRow key={index} className='hover:bg-transparent'>

                                    {/* ✅ ID COLUMN */}
                                    <TableCell className='whitespace-nowrap ps-6 py-6'>
                                        <span className='text-sm font-medium text-muted-foreground'>
                                            {item.id}
                                        </span>
                                    </TableCell>

                                    {/* ✅ USER COLUMN */}
                                    <TableCell className='whitespace-nowrap py-6'>
                                        <div className='flex items-center gap-3'>
                                            <img
                                                src={item.profile}
                                                alt='user'
                                                className='h-8 w-8 rounded-full'
                                            />
                                            <div className='truncat line-clamp-2 text-wrap max-w-56 flex flex-col gap-0.5'>
                                                <h6 className='text-base font-semibold'>
                                                    {item.customername}
                                                </h6>
                                                <p className='text-sm text-muted-foreground font-medium'>
                                                    {item.customeremail}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className='whitespace-nowrap'>
                                        <div className='flex items-center max-w-52'>
                                            <h6 className='text-sm font-medium truncate'>{item.name}</h6>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <h5 className='text-base font-medium'>
                                            {item.payment}
                                            <span className='text-foreground/70'>
                                                <span className='mx-1'>/</span>499
                                            </span>
                                        </h5>

                                        <div className='text-sm text-foreground/70 mb-2'>
                                            {item.paymentstatus}
                                        </div>

                                        <Progress
                                            value={item.process}
                                            className={cn("w-full h-1 [&>div]:h-1", `${item.processcolor}`)}
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <Badge className={`${item.statuscolor}`}>
                                            {item.statustext}
                                        </Badge>
                                    </TableCell>

                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className='outline-none'>
                                                <span className='h-9 w-9 flex justify-center items-center rounded-full hover:bg-accent cursor-pointer'>
                                                    <EllipsisVertical size={16} />
                                                </span>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent>
                                                {tableActionData.map((items, index) => (
                                                    <DropdownMenuItem key={index} className='flex gap-3'>
                                                        <items.icon size={18} />
                                                        <span>{items.listtitle}</span>
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </SimpleBar>
        </Card>
    )
}

export default ProductTable