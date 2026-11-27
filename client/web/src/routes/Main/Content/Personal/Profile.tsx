import React, { useState } from 'react';
import { Avatar } from 'tailchat-design';
import { useUserInfo } from 'tailchat-shared';
import { SettingsAccount } from '@/components/modals/SettingsView/Account';

type ProfileTab = 'info' | 'gifts';

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

/** Telegram-inspired profile with information and gift showcase tabs. */
export const PersonalProfile: React.FC = React.memo(() => {
  const userInfo = useUserInfo();
  const [activeTab, setActiveTab] = useState<ProfileTab>('info');

  if (!userInfo) return null;

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden text-white">
      <div className="mx-auto w-full max-w-2xl px-3 pb-8 pt-4 sm:px-6 sm:pt-7">
        <div className="mb-4 flex items-center justify-between px-1">
          <div>
            <div className="text-xl font-semibold tracking-tight">Профиль</div>
            <div className="mt-1 text-xs text-gray-400">Ваш профиль KIVO</div>
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
                onClick={() => setActiveTab('info')}
                className="mb-1 rounded-full border border-violet-300/25 bg-violet-500/15 px-4 py-2 text-sm font-medium text-violet-100 transition hover:bg-violet-500/25"
              >
                Редактировать
              </a>
            </div>
            <div className="mt-3 min-w-0">
              <div className="truncate text-2xl font-bold">{userInfo.nickname}</div>
              <div className="mt-1 text-sm text-gray-400">Пользователь KIVO</div>
            </div>
          </div>
          <div className="grid grid-cols-2 border-t border-white/10 bg-black/10">
            <button
              type="button"
              onClick={() => setActiveTab('info')}
              className={`relative px-3 py-4 text-sm font-semibold transition ${activeTab === 'info' ? 'text-violet-200' : 'text-gray-400 hover:text-white'}`}
            >
              Информация
              {activeTab === 'info' && <span className="absolute inset-x-7 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" />}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gifts')}
              className={`relative px-3 py-4 text-sm font-semibold transition ${activeTab === 'gifts' ? 'text-violet-200' : 'text-gray-400 hover:text-white'}`}
            >
              Подарки
              {activeTab === 'gifts' && <span className="absolute inset-x-7 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" />}
            </button>
          </div>
        </section>

        {activeTab === 'info' ? (
          <>
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
          </>
        ) : (
          <section className="mt-4">
            <div className="mb-3 flex items-center justify-between px-1">
              <div>
                <div className="text-base font-semibold">Коллекция подарков</div>
                <div className="mt-1 text-xs text-gray-400">Подарки, которые видят посетители профиля</div>
              </div>
              <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-200">0 подарков</span>
            </div>
            <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-violet-300/20 bg-[#171b2b]/75 px-6 py-9 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500/20 to-cyan-400/10 text-4xl shadow-lg shadow-violet-950/30">
                🎁
              </div>
              <div className="text-base font-semibold text-white">Подарков пока нет</div>
              <div className="mt-2 max-w-xs text-sm leading-6 text-gray-400">
                Полученные подарки будут появляться здесь. Их смогут просматривать другие пользователи.
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-[#171b2b]/75 p-4">
              <div className="text-sm font-semibold text-white">Подарки KIVO</div>
              <p className="mt-1 text-xs leading-5 text-gray-400">
                Здесь будет каталог подарков и отправка подарка другому пользователю. Для настоящих отправок нужна серверная система подарков и баланс — она пока не подключена.
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
});
PersonalProfile.displayName = 'PersonalProfile';
