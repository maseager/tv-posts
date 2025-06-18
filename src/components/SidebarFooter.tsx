import React from 'react';

const SidebarFooter: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mt-6">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-gray-400">
          <a href="#" className="hover:text-white transition-colors text-sm">About</a>
          <a href="#" className="hover:text-white transition-colors text-sm">Discord</a>
          <a href="#" className="hover:text-white transition-colors text-sm">Privacy</a>
        </div>
        <div className="pt-3 border-t border-gray-700">
       <div className="text-gray-400 text-[10px]">
  © 2025 TV Posts Inc. All rights reserved.
</div>
        </div>
      </div>
    </div>
  );
};

export default SidebarFooter;