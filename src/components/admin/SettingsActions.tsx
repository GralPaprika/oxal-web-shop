'use client';

import { Button } from '@/components/ui/Button';
import { PlusIcon, KeyIcon } from '@heroicons/react/24/outline';

interface SettingsActionsProps {
  changePasswordLabel: string;
  newAdminLabel: string;
}

export function SettingsActions({
  changePasswordLabel,
  newAdminLabel
}: SettingsActionsProps) {
  
  const handleChangePassword = () => {
    // TODO: Implement change password functionality
    console.log('Change password clicked');
  };

  const handleNewAdmin = () => {
    // TODO: Implement new admin functionality
    console.log('New admin clicked');
  };

  return (
    <div className="flex items-center gap-3">
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={handleChangePassword}
      >
        <KeyIcon className="h-4 w-4" />
        {changePasswordLabel}
      </Button>
      <Button 
        className="flex items-center gap-2"
        onClick={handleNewAdmin}
      >
        <PlusIcon className="h-4 w-4" />
        {newAdminLabel}
      </Button>
    </div>
  );
}