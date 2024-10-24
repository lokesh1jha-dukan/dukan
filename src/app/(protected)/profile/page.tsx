"use client";
import MyAddress from '@/components/block/page/profile/myAddress';
import MyOrders from '@/components/block/page/profile/myOrders';
import React, { useEffect, useState } from 'react';
import { AiFillHome } from "react-icons/ai";
import isAuthenticatedAndUserId from '../utils';
import { useRouter } from 'next/navigation';
import { fetchInsideTryCatch } from '@/lib/client/apiUtil';
import { useDevice } from '@/lib/client/hooks/useDevice';

type Props = {};

function Profile({ }: Props) {
  const [activeTab, setActiveTab] = useState('My Address');
  const { isMobile } = useDevice();
  // isMobile = true
  const router = useRouter()

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  const logout = async () => {
    const response = await fetchInsideTryCatch('/api/logout');
    if (response) {
      router.push('/auth/login')
    }
  };

  async function isAuthenticated() {
    let auth: any = await isAuthenticatedAndUserId()
    if (!auth.isAuthenticated) {
      router.push('/auth/login')
    }
    if (auth.isAuthenticated && auth.userData?.user?.role === "admin") {
      router.push('/admin')
    }
  }

  useEffect(() => {
    isAuthenticated()
  }, [])

  return (
    <>

      <div className='container'>

        <div className="flex h-screen">
          <div className=" bg-gray-100 p-4 h-screen w-[100px] sm:w-[190px] h-screen">
            <header>
              <h1 className="text-3xl font-bold">Profile</h1>
              <div className='flex items-center mt-2 '
                onClick={() => window.location.href = '/products'}>Back to Home
                <AiFillHome
                  className='w-7 h-7 ml-1 lg:w-5 lg:h-5 bg-red-300 p-1 rounded-full cursor-pointer'
                  onClick={() => window.location.href = '/products'}
                />
              </div>

            </header>
            <br />
            <ul>
              <li
                className={`cursor-pointer mb-2 ${activeTab === 'My Address' && 'font-bold'
                  }`}
                onClick={() => handleTabChange('My Address')}
              >
                My Address
              </li>
              <li
                className={`cursor-pointer mb-2 ${activeTab === 'My Orders' && 'font-bold'
                  }`}
                onClick={() => handleTabChange('My Orders')}
              >
                My Orders
              </li>
              <li className="cursor-pointer mb-2" onClick={logout}>
                Logout
              </li>
            </ul>
          </div>

          <div className="w-3/4 p-4">
            {activeTab === 'My Address' && <MyAddress />}
            {activeTab === 'My Orders' && <MyOrders />}
          </div>
        </div>
      </div>

    </>
  );
}

export default Profile;
