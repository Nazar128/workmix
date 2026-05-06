import { LucideIcon } from 'lucide-react';
import React from 'react'

interface AdminCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description: string;
}

export default function AdminCard({ title, value, icon: Icon, description}: AdminCardProps)
{
    return(
        <div className='bg-gradient-to-r from-purple-800 via-indigo-600 to-blue-400 p-6 text-center justify-center rounded-lg'>
            <div className='flex flex-col '>
                <div>
                    <Icon size={36} className='w-6 h-6 text-gray-300 mx-auto' />
                </div>
                <div className='mx-auto text-center justify-center mt-3'>
                    <p className='text-sm font-medium text-gray-300 '>{title}</p>
                    <h3 className='text-2xl font-bold text-white mt-1'>{value}</h3>
                    
                </div>
                <div className='text-center justify-center mt-3'>
                    <p className='text-gray-300 mt-6'>{description}</p>
                </div>

            </div>
        </div>
    )
}