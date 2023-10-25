"use client";

import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function HeaderBar({
  premiumEnabled,
}: {
  premiumEnabled: boolean;
}) {
  const pathname = usePathname();
  const analysisPage = pathname.includes("analyze");
  const isDashboardPath = pathname.includes("dashboard");
  const isUpgradePage = pathname.includes("upgrade");

  return (
    <>
      {analysisPage ? (
        <Disclosure as="nav" className="bg-blue-950">
          {() => (
            <>
              <div className="mx-auto px-4 sm:px-6 lg:px-8 ">
                <div className="flex h-16 justify-between items-center">
                  <div className="flex">
                    <div className="flex flex-shrink-0 items-center">
                      <Link href="/dashboard/researchProjects">
                        <img
                          className="h-9 w-auto"
                          src="/assets/nexus_logo_white.png"
                          alt="Nexus"
                        />
                      </Link>
                    </div>
                  </div>
                  {/* <div className="text-white text-xl font-semibold">Project Name</div> */}
                  <div className="flex items-center gap-4">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </div>
              </div>
            </>
          )}
        </Disclosure>
      ) : (
        <Disclosure as="nav" className="bg-white">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
                <div className="flex h-16 justify-between">
                  <div className="flex">
                    <div className="-ml-2 mr-2 flex items-center md:hidden">
                      {/* Mobile menu button */}
                      <Disclosure.Button
                        className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500
                              focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-800"
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XMarkIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        ) : (
                          <Bars3Icon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </Disclosure.Button>
                    </div>
                    <div className="flex flex-shrink-0 items-center">
                      <Link href="/dashboard/researchProjects">
                        <img
                          className="h-9 w-auto"
                          src="/assets/nexus_logo.png"
                          alt="Nexus"
                        />
                      </Link>
                    </div>
                    <div className="hidden md:ml-4 md:flex md:space-x-8">
                      <Link
                        href="/dashboard/researchProjects"
                        className={`inline-flex items-center ${
                          analysisPage || isDashboardPath
                            ? "border-blue-950"
                            : "border-white"
                        }  border-b-4 px-1 pt-2 text-base font-bold text-blue-950`}
                      >
                        Projects
                      </Link>
                    </div>
                    {premiumEnabled && (
                      <div className="hidden md:ml-4 md:flex md:space-x-8">
                        <Link
                          href="/upgrade"
                          className={`inline-flex items-center ${
                            isUpgradePage ? "border-blue-950" : "border-white"
                          }  border-b-4 px-1 pt-2 text-base font-bold text-blue-950`}
                        >
                          Upgrade
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div>
                  <Link
                    href="/dashboard/researchProjects"
                    className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-bold  hover:bg-blue-950 hover:text-white sm:pl-5 sm:pr-6"
                  >
                    Projects
                  </Link>
                </div>

                <div>
                  <Link
                    href="/upgrade"
                    className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-bold  hover:bg-blue-950 hover:text-white sm:pl-5 sm:pr-6"
                  >
                    Upgrade
                  </Link>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      )}
    </>
  );
}
