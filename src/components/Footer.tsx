import { memo } from 'react';


const Footer = memo(() => (
  <footer className="relative w-full h-full font-[11px] p-6 bg-[#D8E6BE] flex flex-col">
    <div className="mb-3">
      <p className="py-1">나의 덕질을 공유해보세요!</p>
      <p className="py-1">취향 공유 플랫폼 Dukpool입니다.</p>
    </div>
    <div className="flex justify-between items-center">
      <div>
        <p>COPYRIGHT © 2023 DUKPOOL ALL RIGHTS RESERVED</p>
      </div>

    </div>
  </footer>
));

Footer.displayName = 'Footer';

export default Footer;
