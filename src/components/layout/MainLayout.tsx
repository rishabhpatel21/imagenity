import React from 'react';
import { Header } from '../Header';
import { Sidebar } from './Sidebar';
import { WorkArea } from './WorkArea';

export function MainLayout() {
  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e]">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <WorkArea />
        <Sidebar />
      </div>
    </div>
  );
}