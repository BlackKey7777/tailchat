import React from 'react';
import { Avatar } from 'tailchat-design';
import { useUserInfo } from 'tailchat-shared';
import { SettingsAccount } from '@/components/modals/SettingsView/Account';

/**
 * Профиль текущего пользователя с редактированием данных аккаунта.
 */
export const PersonalProfile: React.FC = React.memo(() => {
  const userInfo = useUserInfo();

  if (!userInfo) {
    return null;
  }

  return (
    <div className="w-full h-full overflow-y-auto p-4 md:p-7">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-5">
          <div className="text-2xl font-bold text-white">Мой профиль</div>
          <div className="mt-1 text-sm text-gray-400">
            Управляйте фотографией, именем и данными своего аккаунта
          </div>
        </div>

        <div className="mb-5 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5">
          <Avatar
            size={76}
            src={userInfo.avatar}
            name={userInfo.nickname}
          />
          <div className="min-w-0">
            <div className="truncate text-xl font-semibold text-white">
              {userInfo.nickname}
            </div>
            <div className="mt-1 truncate text-sm text-gray-400">
              {userInfo.email}
            </div>
            <div className="mt-2 text-xs text-emerald-300">Ваш аккаунт KIVO</div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4 md:p-6">
          <div className="mb-4 text-lg font-semibold text-white">
            Редактирование профиля
          </div>
          <SettingsAccount />
        </div>
      </div>
    </div>
  );
});
PersonalProfile.displayName = 'PersonalProfile';
