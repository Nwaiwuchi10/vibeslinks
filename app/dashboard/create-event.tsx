import React from 'react';
import CreateEventMain from '@/pages/Home/CreateEvent/CreateEventMain';
import { useRouter } from 'expo-router';

export default function DashboardCreateEventScreen() {
  const router = useRouter();
  
  const handleFinish = () => {
    router.replace('/dashboard');
  };

  return <CreateEventMain onFinish={handleFinish} />;
}
