"use client"
import { v4 as uuidv4 } from 'uuid'
import ProductCard from './product-card'
import { ShoppingBag, Users, Box } from 'lucide-react';
export default function ProductActionCards() {
  const ProductsData = [
    {
      id: uuidv4(),
      title: 'Weekly sales',
      amount: '714k',
      growthPercentage: '40%',
      badgeColor: 'bg-chart-2/10',
      badgetxtcolor: "text-chart-2",
      icon: ShoppingBag,

    },
    {
      id: uuidv4(),
      title: 'Conversion Rate',
      amount: '5.3%',
      growthPercentage: '20%',
      badgeColor: 'bg-rose-600/10',
      badgetxtcolor: "text-rose-600",
      icon: Users,

    },
    {
      id: uuidv4(),
      title: 'Ad Campaign Clicks',
      amount: '11,510',
      growthPercentage: '40%',
      badgeColor: 'bg-chart-2/10',
      badgetxtcolor: 'text-chart-2',
      icon: Box,

    },
  ]
  return (
    <div className='grid grid-cols-12 gap-6'>
      {ProductsData.map((product) => (
        <div className='xl:col-span-4 col-span-12' key={product.id}>
          <ProductCard
            title={product.title}
            amount={product.amount}
            growthPercentage={product.growthPercentage}
            badgeColor={product.badgeColor}
            icon={product.icon}

            badgetxtcolor={product.badgetxtcolor}
          />
        </div>
      ))}
    </div>
  )
}
