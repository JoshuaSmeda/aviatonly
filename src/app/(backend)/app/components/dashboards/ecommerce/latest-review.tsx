'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu'
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { CirclePlus, EllipsisVertical, SearchIcon, SquarePen, Trash, Funnel } from 'lucide-react'


const RatingStars = ({ rating }: { rating: number }) => {
    return (
        <div className='flex space-x-0.5'>
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    xmlns='http://www.w3.org/2000/svg'
                    className={`h-4 w-4 ${star <= rating ? 'text-orange-600' : 'text-gray-300'
                        }`}
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.462a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118l-3.39-2.462a1 1 0 00-1.176 0l-3.39 2.462c-.784.57-1.838-.197-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.045 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.974z' />
                </svg>
            ))}
        </div>
    )
}

const LatestReview = () => {
    /*Table Action*/
    const tableActionData = [
        {
            icon: CirclePlus,
            listtitle: 'Add',
        },
        {
            icon: SquarePen,
            listtitle: 'Edit',
        },
        {
            icon: Trash,
            listtitle: 'Delete',
        },
    ]

    const LatestReviewData = [
        {
            img: 'https://images.shadcnspace.com/assets/products/dash-image-6.png',
            name: 'iPhone 13 pro max-Pacific Blue-128GB storage',
            profile:
                'https://images.shadcnspace.com/assets/profiles/user-1.jpg',
            customername: 'Arlene McCoy',
            customeremail: 'macoy@arlene.com',
            review: 5,
            reviewtext:
                'This theme is great. Clean and easy to understand. Perfect for those who don t havetime to',
            time: 'Nov 8',
            statuscolor: 'bg-teal-400/10 text-teal-400',
            statustext: 'Confimred',
        },
        {
            img: 'https://images.shadcnspace.com/assets/products/dash-image-7.png',
            name: 'Apple MacBook Pro 13 inch-M1-8/256GB-space',
            profile:
                'https://images.shadcnspace.com/assets/profiles/user-3.jpg',
            customername: 'Jerome Bell',
            customeremail: 'belljerome@yahoo.com',
            review: 4,
            reviewtext:
                'It is a Mac, after all. Once you have gone Mac,there s no going back. My first Maclastedover nine years',
            time: 'Nov 7',
            statuscolor: 'bg-muted text-primary',
            statustext: 'Pending',
        },
        {
            img: 'https://images.shadcnspace.com/assets/products/dash-image-8.png',
            name: 'PlayStation 5 DualSense Wireless Controller',
            profile:
                'https://images.shadcnspace.com/assets/profiles/user-7.jpg',
            customername: 'Jacob Jones',
            customeremail: 'jones009@hotmail.com',
            review: 4,
            reviewtext:
                ' The best experience we could hope for.Customer service team is amazing and thequality of their products',
            time: 'Nov 6',
            statuscolor: 'bg-muted text-primary',
            statustext: 'Pending',
        },
        {
            img: 'https://images.shadcnspace.com/assets/products/dash-image-9.png',
            name: 'Amazon Basics Mesh, Mid-Back, Swivel Office',
            profile:
                'https://images.shadcnspace.com/assets/profiles/user-8.jpg',
            customername: 'Messey Jones',
            customeremail: 'jones009@hotmail.com',
            review: 3,
            reviewtext:
                ' The controller is quite comfy for me. Despiteits increased size, the controller still fits well',
            time: 'Nov 5',
            statuscolor: 'bg-teal-400/10 text-teal-400',
            statustext: 'Confimred',
        },
        {
            img: 'https://images.shadcnspace.com/assets/products/dash-image-10.png',
            name: 'Sony X85J 75 Inch Sony 4K Ultra HD LED Smart',
            profile:
                'https://images.shadcnspace.com/assets/profiles/user-9.jpg',
            customername: 'Annette Black',
            customeremail: 'blackanne@yahoo.com',
            review: 3,
            reviewtext:
                ' The controller is quite comfy for me. Despiteits increased size, the controller still fits well',
            time: 'Nov 4',
            statuscolor: 'bg-muted text-primary',
            statustext: 'Pending',
        },
    ]

    return (
        <>

            <Card className='w-full py-6 gap-6'>
                <div className='sm:flex items-center justify-between px-6'>
                    <div>
                        <h5 className='text-lg font-semibold text-foreground'>
                            Latest Reviews
                        </h5>
                        <p className='text-sm font-normal text-muted-foreground'>
                            Reviewed received across all channels
                        </p>
                    </div>

                    <div className='flex gap-4 sm:mt-0 mt-3'>

                        <InputGroup className="h-9 rounded-full">
                            <InputGroupInput placeholder="Search" />
                            <InputGroupAddon>
                                <SearchIcon size={18} className='size-4.5' />
                            </InputGroupAddon>
                        </InputGroup>

                        <DropdownMenu>
                            <DropdownMenuTrigger className='outline-none'>
                                <span className='h-9 w-9 flex justify-center items-center rounded-full hover:bg-card  text-foreground cursor-pointer border border-border'>
                                    <Funnel size={18} />
                                </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {tableActionData.map((items, index) => (
                                    <DropdownMenuItem
                                        key={index}
                                        className='flex gap-3 font-normal cursor-pointer'>
                                        <items.icon size={18} />
                                        <span>{items.listtitle}</span>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className='overflow-x-auto'>
                    <Table className='border-b'>
                        <TableHeader className='text-center'>
                            <TableRow className='hover:bg-transparent'>
                                <TableHead className='text-base font-semibold pb-2 ps-7'>
                                    #
                                </TableHead>
                                <TableHead className='text-base font-semibold pb-2'>
                                    Products
                                </TableHead>
                                <TableHead className='text-base font-semibold pb-2'>
                                    Customer
                                </TableHead>
                                <TableHead className='text-base font-semibold pb-2'>
                                    Reviews
                                </TableHead>
                                <TableHead className='text-base font-semibold pb-2'>
                                    Status
                                </TableHead>
                                <TableHead className='text-base font-semibold pb-2'>
                                    Time
                                </TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className='divide-y divide-border'>
                            {LatestReviewData.map((item, index) => (
                                <TableRow key={index} className='hover:bg-transparent'>
                                    <TableCell className='whitespace-nowrap ps-6 py-8'>
                                        <Checkbox className='cursor-pointer' />
                                    </TableCell>
                                    <TableCell className='whitespace-nowrap '>
                                        <div className='flex gap-3 items-center'>
                                            <img
                                                src={item.img}
                                                alt='icon'
                                                className='h-[60px] w-[60px] rounded-lg'
                                                width={60}
                                                height={60}
                                            />
                                            <div className='truncat line-clamp-2 sm:text-wrap max-w-56'>
                                                <h6 className='text-sm font-medium text-foreground'>{item.name}</h6>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className='whitespace-nowrap'>
                                        <div className='flex gap-3 items-center'>
                                            <img
                                                src={item.profile}
                                                alt='icon'
                                                className='h-8 w-8 rounded-full'
                                                width={32}
                                                height={32}
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
                                    <TableCell className='whitespace-nowrap flex flex-col gap-2'>
                                        <RatingStars rating={item.review} />
                                        <p className='text-sm font-normal text-muted-foreground truncat line-clamp-2 text-wrap max-w-56'>
                                            {item.reviewtext}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`${item.statuscolor} font-normal`} >
                                            {item.statustext}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className='whitespace-nowrap'>
                                        <p className='text-sm font-normal text-foreground'>
                                            {item.time}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <span className='h-9 w-9 flex justify-center items-center rounded-full hover:bg-accent hover:text-accent-foreground cursor-pointer'>
                                                    <EllipsisVertical size={16} />
                                                </span>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                {tableActionData.map((items, index) => (
                                                    <DropdownMenuItem
                                                        key={index}
                                                        className='flex gap-3 font-normal cursor-pointer'>
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
                <div className='sm:flex items-center justify-between px-6 '>
                    <small className='text-sm font-normal text-muted-foreground'>
                        1-6 of 32
                    </small>

                    <div className='flex gap-3 cursor-pointer '>
                        <small className='text-sm font-medium text-muted-foreground'>
                            Previous
                        </small>
                        <small className='text-sm font-medium text-muted-foreground'>
                            Next
                        </small>
                    </div>
                </div>
            </Card>

        </>
    )
}

export default LatestReview
