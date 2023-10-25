import UrlParserComponent from "@/app/tools/url-parser/UrlParserComponent";
import { getUserAndSubscriptionState } from "@/actions/user";

const UrlParserPage = async () => {
  const { user, isProUser } = await getUserAndSubscriptionState();
  return <UrlParserComponent user={user} isProUser={isProUser} />;
};
export default UrlParserPage;
