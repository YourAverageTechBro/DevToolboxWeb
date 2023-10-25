import StringConverterComponent from "@/app/tools/string-converter/StringConverterComponent";
import { getUserAndSubscriptionState } from "@/actions/user";

const StringConverterPage = async () => {
  const { user, isProUser } = await getUserAndSubscriptionState();
  return <StringConverterComponent user={user} isProUser={isProUser} />;
};
export default StringConverterPage;
