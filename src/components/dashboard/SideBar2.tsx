"use client";

import React, { useState, useEffect } from 'react';
import { MessageSquare, Bell, Bookmark, X } from 'lucide-react';
import ChatTest from '../chat/Chat';
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export default function SideBar2() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userInitials, setUserInitials] = useState("??");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("users")
          .select("name, avatar_url")
          .eq("id", user.id)
          .single();
        
        if (profile) {
          if (profile.avatar_url) {
            setUserAvatar(profile.avatar_url);
          }
          if (profile.name) {
            const initials = profile.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);
            setUserInitials(initials);
          }
        }
      }
    };
    fetchUser();
  }, []);

  return (
    <div className=" h-full bg-purple-950/20 backdrop-blur-[12px] border-l-2  border-white/10  ">
      <div className="h-full bg-purple-50/40 flex flex-row-reverse relative z-150 select-none pointer-events-auto ">
      <div className="w-16 h-full   flex flex-col items-center py-6 justify-between relative z-30 pointer-events-auto">
        <div className="flex flex-col gap-6 items-center w-full">
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`p-3 rounded-xl transition-all relative cursor-pointer ${
              isChatOpen 
                ? 'bg-purple-50 text-purple-600 border border-purple-100' 
                : 'text-gray-50 hover:bg-[#be9edc] hover:text-gray-800'
            }`}
          >
            <MessageSquare size={22} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-purple-500 rounded-full ring-2 ring-white"></span>
          </button>
          <button className="p-3 rounded-xl text-gray-50 hover:bg-[#be9edc] hover:text-gray-800 transition cursor-pointer">
            <Bell size={22} />
          </button>
          <button className="p-3 rounded-xl text-gray-50 hover:bg-[#be9edc] hover:text-gray-800 transition cursor-pointer">
            <Bookmark size={22} />
          </button>
        </div>
        
        <button 
          onClick={() => window.location.href = '/dashboard/profile'} 
          className="w-9 h-9 rounded-full overflow-hidden transition-all duration-200 hover:scale-105 active:scale-95 ring-2 ring-purple-500/20 hover:ring-purple-500/50 cursor-pointer shadow-sm flex items-center justify-center"
        >
          {userAvatar ? (
            <Image 
              src={userAvatar} 
              alt="Profil" 
              width={36} 
              height={36} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold uppercase tracking-wider">
              {userInitials}
            </div>
          )}
        </button>
      </div>
      
      <div 
        style={{ width: isChatOpen ? '360px' : '0px' }}
        className="h-full bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 transition-all duration-300 ease-in-out overflow-hidden flex flex-col relative z-20 shadow-2xl border-l border-white/10 pointer-events-auto"
      >
        <div className="w-[360px] h-full flex flex-col min-w-[360px] relative p-4 overflow-hidden">
          <div className="w-full flex justify-between items-center mb-2 pb-2 border-b border-white/10">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-200">Organizasyon Sohbeti</span>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="p-1.5 rounded-lg bg-white/10 text-purple-200 hover:text-white hover:bg-white/20 transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 h-full overflow-hidden">
            <ChatTest />
          </div>
        </div>
      </div>
    </div>
    </div>
 
    
  );
}