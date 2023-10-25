import LineSortAndDedupeComponent from "@/app/tools/line-sort-and-dedupe/LineSortAndDedupeComponent";
import { getUserAndSubscriptionState } from "@/actions/user";

const LineSortAndDedupe = async () => {
  const { user, isProUser } = await getUserAndSubscriptionState();
  return <LineSortAndDedupeComponent user={user} isProUser={isProUser} />;
};
export default LineSortAndDedupe;
