import { Button } from "@/app/components/common/Button";
import {
  createLifetimeCheckoutSession,
  createYearlyCheckoutSession,
  redirectToCustomerPortal,
} from "@/actions/stripe";
import { getUserAndSubscriptionState } from "@/actions/user";
import Link from "next/link";
import prisma from "@/db/prisma";
import { getPathFromToolType } from "@/utils/clientUtils";

const fetchUserHistory = async (userId: string) =>
  await prisma.history.findMany({
    where: {
      userId: userId,
    },
  });

export default async function HistoryPage() {
  const { user, isProUser } = await getUserAndSubscriptionState();

  if (user && isProUser) {
    const history = await fetchUserHistory(user.id);
    return (
      <div
        className={
          "w-full h-full flex flex-col items-center bg-gray-700 py-8 rounded-md overflow-y-scroll"
        }
      >
        <p className={"text-4xl font-bold mb-4"}> History: </p>
        <form className={"mb-4"} action={redirectToCustomerPortal}>
          <input type="hidden" name="userId" value={user?.id} />
          <Button type="submit">Manage billing</Button>
        </form>
        <div className={"w-full flex flex-col"}>
          {history.map((entry, index) => (
            <div
              key={entry.id}
              className={`w-full p-4 ${
                index % 2 === 0 ? "bg-gray-800" : "bg-gray-300 text-black"
              } rounded-md`}
            >
              {entry.metadata &&
                Object.entries(entry.metadata).map(([_, value]) => (
                  <Link
                    key={entry.id}
                    className={"flex justify-between"}
                    href={`/tools/${getPathFromToolType(entry.toolType)}`}
                  >
                    <p className={"text-lg"}> {entry.toolType} </p>
                    <p className={"text-lg"}> {value} </p>
                  </Link>
                ))}
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={
          "w-full h-full flex flex-col justify-center items-center bg-gray-700 py-8 rounded-md"
        }
      >
        <p className={"text-4xl px-36 text-center font-bold"}>
          Upgrade to DevToolbox Pro to save your Dev Toolbox history
        </p>
        <p className={"text-2xl px-36 text-center font-medium"}>
          Never worry about losing your work again — we will back everything up
          for you automatically.
        </p>
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-row justify-center mt-4 gap-12 flex-wrap">
            <div className="flex flex-col items-center gap-4 justify-between w-[345px] rounded-3xl p-4 shadow-homeVideo bg-white">
              <div className="flex flex-col items-center">
                <div className="text-blue-950 my-4 pb-2 text-2xl font-bold w-4/5 border-b-2 text-center border-blue-950">
                  Yearly Plan
                </div>
                <div className="text-blue-950 text-4xl font-bold">
                  $10 / year
                </div>
              </div>
              <div className="mb-4">
                <form action={createYearlyCheckoutSession}>
                  <input type="hidden" name="userId" value={user?.id} />
                  <Button type="submit">Upgrade</Button>
                </form>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 justify-between w-[345px] rounded-3xl p-4 shadow-homeVideo bg-white">
              <div className="flex flex-col items-center">
                <div className="text-blue-950 my-4 pb-2 text-2xl font-bold border-b-2 text-center border-blue-950">
                  Lifetime Access
                </div>
                <div className="text-blue-950 text-4xl font-bold">$30</div>
              </div>
              <div className="mb-4">
                <form action={createLifetimeCheckoutSession}>
                  <input type="hidden" name="userId" value={user?.id} />
                  <Button type="submit">Upgrade</Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
