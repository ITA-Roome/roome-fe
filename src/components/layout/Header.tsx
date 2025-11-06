import HeaderLogo from "@/assets/RoomeLogo/logo-header.svg?react";
export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center py-10 bg-primary-50 w-screen">
      <HeaderLogo className="w-[120px] h-auto" />
    </header>
  );
}
