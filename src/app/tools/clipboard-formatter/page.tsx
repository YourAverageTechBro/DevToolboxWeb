import ClipFormatterComponent from "@/app/tools/clipboard-formatter/ClipFormatterComponent";
import { getUserAndSubscriptionState } from "@/actions/user";

const ClipFormatter = async () => {
  const { user, isProUser } = await getUserAndSubscriptionState();
  return <ClipFormatterComponent user={user} isProUser={isProUser} />;
};
export default ClipFormatter;
