import React from 'react';
import { Avatar } from 'tailchat-design';
import { useUserInfo } from 'tailchat-shared';
import { SettingsAccount } from '@/components/modals/SettingsView/Account';

const ProfileRow: React.FC<{
  icon: string;
  label: string;
  value?: React.ReactNode;
}> = ({ icon, label, value }) => (
  <div className="flex min-w-0 items-center gap-4 border-b border-white/8 px-4 py-4 last:border-b-0">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-lg text-violet-200">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="mt-1 break-words text-sm font-medium text-white">
        {value || 'Не указано'}
      </div>
    </div>
  </div>
);

/**
 * Telegram-inspired profile screen for the current KIVO account.
 */
export const PersonalProfile: React.FC = React.memo(() => {
  const userInfo = useUserInfo();

  if (!userInfo) return null;

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden text-white">
      <div className="mx-auto w-full max-w-2xl px-3 pb-8 pt-4 sm:px-6 sm:pt-7">
        <div className="mb-4 flex items-center justify-between px-1">
          <div>
            <div className="text-xl font-semibold tracking-tight">Профиль</div>
            <div className="mt-1 text-xs text-gray-400">Информация вашего аккаунта</div>
          </div>
          <div className="rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1 text-xs text-violet-200">
            KIVO
          </div>
        </div>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#171b2b]/90 shadow-xl shadow-black/20">
          <div className="relative h-28 overflow-hidden bg-gradient-to-r from-violet-700/80 via-indigo-600/70 to-cyan-600/70">
            <div className="absolute -right-8 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-16 left-10 h-36 w-36 rounded-full bg-fuchsia-400/20 blur-2xl" />
          </div>
          <div className="relative px-5 pb-5">
            <div className="-mt-12 flex items-end justify-between">
              <div className="rounded-full border-4 border-[#171b2b] bg-[#171b2b]">
                <Avatar size={92} src={userInfo.avatar} name={userInfo.nickname} />
              </div>
              <a
                href="#profile-edit"
                className="mb-1 rounded-full border border-violet-300/25 bg-violet-500/15 px-4 py-2 text-sm font-medium text-violet-100 transition hover:bg-violet-500/25"
              >
                Редактировать
              </a>
            </div>
            <div className="mt-3 min-w-0">
              <div className="truncate text-2xl font-bold">{userInfo.nickname}</div>
              <div className="mt-1 text-sm text-gray-400">Аккаунт KIVO</div>
            </div>
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#171b2b]/85">
          <ProfileRow icon="✉" label="Электронная почта" value={userInfo.email} />
          <ProfileRow icon="🆔" label="ID пользователя" value={userInfo._id} />
        </section>

        <section id="profile-edit" className="mt-6 scroll-mt-4">
          <div className="mb-3 px-1">
            <div className="text-base font-semibold">Редактирование профиля</div>
            <div className="mt-1 text-xs text-gray-400">
              Измените фотографию, имя и данные аккаунта
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#171b2b]/85 p-4 sm:p-5">
            <SettingsAccount />
          </div>
        </section>
      </div>
    </div>
  );
});
PersonalProfile.displayName = 'PersonalProfile';
