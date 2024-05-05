'use client';

import Link from "next/link";
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faFolderOpen, faGift, faHouse, faInfo, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faReact } from "@fortawesome/free-brands-svg-icons";

export default function Sidebar() {
  const [showFullSidebar, setShowFullSidebar] = useState(false);

  useEffect(() => {
    if (window === undefined)
      return;

    if (window.innerWidth >= 1024)
      setShowFullSidebar(true)
  }, [])

  return (
    <>
      <div className={`lg:hidden fixed top-0 z-50`}>
        <div className={`h-16 bg-mantle flex items-center justify-center w-16 p-4`} onClick={() => setShowFullSidebar(prev => !prev)}>
          <FontAwesomeIcon icon={faBars} size="2xl" color="white" />
        </div>
      </div>
      {/* For mobile with toggleable sidebar */}
      <div className={`lg:hidden z-30 bg-mantle fixed w-[260px] inset-y-0 left-0 transform ${showFullSidebar ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out min-h-screen`}>
        <SideBarContents toggleSideBar={setShowFullSidebar} />
      </div>

      {/* for bigger screens */}
      <div className={`hidden lg:block w-[260px] min-h-screen bg-mantle pb-4`}>
        <SideBarContents className="fixed" />
      </div>
    </>
  );
}


function SideBarContents({ toggleSideBar, className }: { toggleSideBar?: Dispatch<SetStateAction<boolean>> | undefined, className?: string }) {

  const onClickHandler = toggleSideBar !== undefined ? () => toggleSideBar(false) : () => { }


  return <div className={`flex flex-col w-[260px] mt-8 m-4 h-[calc(100dvh-4rem)] ${className ?? ''}`}>
    <header className="my-10 pr-10 pl-5 w-full">
      <Link href={"/"} className="">
        <img src={"https://cdn.jsdelivr.net/gh/rseragon/blog-assets@main/public/icon.png"}
          alt="blog-logo"
          className="w-[117px] h-auto border-4 rounded-full aspect-auto box-border border-text transition-all transform"
        />
      </Link>
      <div className="mt-5 mb-2">
        <p className="text-blue/70 hover:text-blue text-3xl font-black leading-tight tracking-normal">
          <Link href={"/"}>Kawa</Link>
        </p>
        <p className="text-subtext0 hover:text-subtext1">
          /ˈkɑːwə/  『川』<br />
          Knowledge is like a river, always flowing, never in control.
        </p>
      </div>
    </header>

    <nav className="flex flex-col grow w-full text-text">
      <ul className="mb-5 flex flex-wrap list-none">
        <SideBarNavItem href="/" onClickHandler={onClickHandler}>
          <FontAwesomeIcon icon={faHouse} className="mr-5" />
          Home
        </SideBarNavItem>
        <SideBarNavItem href="/blog" onClickHandler={onClickHandler}>
          <FontAwesomeIcon icon={faFolderOpen} className="mr-5" />
          Blog
        </SideBarNavItem>
        <SideBarNavItem href="/about" onClickHandler={onClickHandler}>
          <FontAwesomeIcon icon={faInfoCircle} className="mr-5" />
          About
        </SideBarNavItem>
      </ul>
    </nav>
    <div className="text-text flex flex-row w-full p-2 gap-1 items-center">
      <Link href={"https://github.com/rseragon"} >
        <FontAwesomeIcon icon={faGithub} size="lg" />
      </Link>
      <span className="w-[3px] text-xl  text-subtext0 mx-1">|</span>
      <p className="">Built with hate on </p>
      <FontAwesomeIcon icon={faReact} style={{ color: "#74C0FC", }} size="lg" />
    </div>
  </div>
}


function SideBarNavItem({ children, href, onClickHandler }: { children: ReactNode, href: string, onClickHandler: any }) {
  return <Link href={href} className="w-full" onClick={onClickHandler}>
    <li className="mb-1 w-full hover:border-b py-2.5 px-6 flex items-baseline rounded-lg hover:bg-base">
      {children}
    </li>
  </Link>
}
