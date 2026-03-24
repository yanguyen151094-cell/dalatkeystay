import { useState } from 'react';

const PHONE = '0982947645';
const ZALO_URL = `https://zalo.me/${PHONE}`;
const FACEBOOK_URL = 'https://www.facebook.com/DaLatkeystay/';

export default function FloatingContacts() {
  const [hovered, setHovered] = useState<string | null>(null);

  const buttons = [
    {
      id: 'facebook',
      href: FACEBOOK_URL,
      tooltip: 'Facebook',
      bg: 'bg-white',
      iconEl: (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/120px-2023_Facebook_icon.svg.png"
          alt="Facebook"
          className="w-7 h-7 object-contain"
        />
      ),
    },
    {
      id: 'zalo',
      href: ZALO_URL,
      tooltip: 'Zalo',
      bg: 'bg-white',
      iconEl: (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/120px-Icon_of_Zalo.svg.png"
          alt="Zalo"
          className="w-7 h-7 object-contain"
        />
      ),
    },
    {
      id: 'phone',
      href: `tel:${PHONE}`,
      tooltip: PHONE,
      bg: 'bg-amber-500',
      iconEl: (
        <div className="w-7 h-7 flex items-center justify-center">
          <i className="ri-phone-fill text-white text-xl"></i>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed right-4 bottom-24 z-40 flex flex-col gap-3">
      {buttons.map((btn) => (
        <a
          key={btn.id}
          href={btn.href}
          target={btn.id !== 'phone' ? '_blank' : undefined}
          rel={btn.id !== 'phone' ? 'noopener noreferrer' : undefined}
          className={`relative w-12 h-12 rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110 ${btn.bg}`}
          onMouseEnter={() => setHovered(btn.id)}
          onMouseLeave={() => setHovered(null)}
          aria-label={btn.tooltip}
        >
          {btn.iconEl}
          {hovered === btn.id && (
            <span className="absolute right-14 bg-stone-800 text-white text-xs font-medium px-2 py-1 rounded-md whitespace-nowrap">
              {btn.tooltip}
            </span>
          )}
        </a>
      ))}
    </div>
  );
}
