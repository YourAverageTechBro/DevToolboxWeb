import { getUserAndSubscriptionState } from "@/actions/user";
import AsciiConverterComponent from "@/app/tools/ascii-converter/AsciiConverterComponent";
const AsciiConverterPage = async () => {
  const { user, isProUser } = await getUserAndSubscriptionState();
  return <AsciiConverterComponent user={user} isProUser={isProUser} />;
};
export default AsciiConverterPage;
