import { Button } from "@/app/components/common/Button";
import {
  createLifetimeCheckoutSession,
  createYearlyCheckoutSession,
} from "@/actions/stripe";
import { getUserAndSubscriptionState } from "@/actions/user";

export default async function HistoryPage() {
  const { user, isProUser } = await getUserAndSubscriptionState();
  if (isProUser) {
    return <div> hi pro user</div>;
  } else {
    return (
      <div
        className={
          "w-full h-1/2 flex flex-col justify-center items-center bg-gray-700 py-8 rounded-md"
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
                  <input
                    type="hidden"
                    name="priceId"
                    value={process.env.NEXT_PUBLIC_YEARLY_PRODUCT_ID}
                  />
                  {/*<input type="hidden" name="userId" value={user?.id} />*/}
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
