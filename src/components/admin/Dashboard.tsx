import { createClient } from '@/lib/supabase/server';
import React from 'react'
import AdminCard from './AdminCard';
import { on } from 'events';
import { Activity, Building2, FolderKanban, UserPlus, Users } from 'lucide-react';

export default async function Dashboard() {
const supabase = await createClient();

const oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
const oneWEekAgoISO = oneWeekAgo.toISOString();

const [
    {count: projectCount},
    {count: memberCount},
    {count: orgCount},
    {count: activeProjectCount},
    {count: newUsersCount}
 ] =  await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('organizations').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('users').select('*', { count: 'exact', head: true }).gte('created_at', oneWEekAgoISO)
    ]);



    return (
        <div className='p-6 mx-auto justify-center'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                <AdminCard 
                title=" Toplam Kullanıcı"
                value={memberCount ?? 0}
                icon={Users}
                description='Sistemdeki tüm kayıtlı üyeler'
                />
                <AdminCard 
                title=" Yeni Kullanıcılar (7 gün)"
                value={newUsersCount ?? 0}
                icon={UserPlus}
                description='Son 7 gün içinde kaydolan kullanıcılar'
                />
                <AdminCard 
                title=" Toplam Proje"
                value={projectCount ?? 0}
                icon={FolderKanban}
                description='Oluşturulan tüm projeler'
                />
                <AdminCard 
                title=" Aktif Projeler"
                value={activeProjectCount ?? 0}
                icon={Activity}
                description='Şu an devam eden projeler'
                />
               
                <AdminCard 
                title=" Organizasyonlar"
                value={orgCount ?? 0}
                icon={Building2}
                description='Kayıtlı kurum ve kuruluşlar'
                />
            </div>
        </div>
    )
}