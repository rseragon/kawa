'use client'
import {
  Navbar as NextUINavbar,
  NavbarContent,
} from "@nextui-org/navbar";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";

import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { MarkDownContent } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export const Navbar = ({ blogContents }: { blogContents?: MarkDownContent[] }) => {

  const [searchFocused, setSearchFocused] = useState(false);
  const [searchList, setSearchList] = useState<MarkDownContent[]>([])
  const searchRef = useRef<HTMLInputElement>(null);

  const onInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (!blogContents) {
      setSearchList([])
      return
    }

    const search = e.target.value;

    if (!search || search.trim().length === 0) {
      setSearchList([])
      return;
    }

    const blogList = []

    for (let blog of blogContents) {
      if (blog.content.search(search) != -1) {
        blogList.push(blog)
      }
    }

    setSearchList(blogList)
  }

  const focusChangehandler = (focused: boolean) => {
    if (focused)
      setSearchFocused(true)

    //@ts-ignore
    if (searchRef.current && searchRef.current.contains(document.activeElement)) {
      return;
    }
    setSearchFocused(focused)
  }

  const searchInput = (
    <div className="w-full">
      <Input
        ref={searchRef}
        aria-label="Search"
        classNames={{
          inputWrapper: "bg-surface0 transition-all",
          input: "text-sm",
        }}
        endContent={
          <Kbd className="hidden lg:inline-block" keys={["command"]}>
            K
          </Kbd>
        }
        labelPlacement="outside"
        placeholder="Search..."
        startContent={<p></p>}
        type="search"
        onFocusChange={focusChangehandler}
        onChange={onInputChangeHandler}
      />
      <div className={`overflow-y-auto max-h-80 absolute z-60 bg-surface0 shadow rounded mt-4 p-4 mr-4 ${(searchFocused && searchList.length > 0) ? '' : 'hidden'}`}
        onTouchStart={() => {
          //@ts-ignore
          console.log(searchRef.current)
          setSearchFocused(true)
        }}
      >
        <ul className="list-none">
          {searchList.map((blog, idx) => {
            return <li key={idx}>
              <Link href={blog.data.url} className="text-text hover:bg-surface1 rounded w-full p-4">
                <FontAwesomeIcon icon={faFileLines} size="xl" className="mr-4" />
                <div>
                  <p className="text-xl">
                    {blog.data.title}
                  </p>
                  <p className="hidden text-subtext0 md:inline-block">
                    {blog.data.peek}
                  </p>
                </div>
              </Link>
            </li>
          })}
        </ul>
      </div>
    </div>
  );

  return (
    <NextUINavbar className="ml-16 lg:ml-0 bg-mantle w-[calc(100dvw-4rem)] lg:w-full text-text " isBlurred={true}>
      <NavbarContent className={`items-center font-bold ${searchFocused ? 'hidden' : ''}`}>
        <Link className="text-text" href={"/"}>
          /ˈkɑːwə/
        </Link>
      </NavbarContent>

      <NavbarContent>
        {searchInput}
      </NavbarContent>
    </NextUINavbar>
  );
};
