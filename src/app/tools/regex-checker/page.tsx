import RegexCheckerComponent from "@/app/tools/regex-checker/RegexCheckerComponent";
import { getUserAndSubscriptionState } from "@/actions/user";

const RegexCheckerPage = async () => {
  const { user, isProUser } = await getUserAndSubscriptionState();
  return <RegexCheckerComponent user={user} isProUser={isProUser} />;
};
export default RegexCheckerPage;
