import UnixTimeConverterComponent from "@/app/tools/unix-time-converter/UnixTimeConverterComponent";
import { getUserAndSubscriptionState } from "@/actions/user";

const UnixTimeConverter = async () => {
  const { user, isProUser } = await getUserAndSubscriptionState();
  return <UnixTimeConverterComponent user={user} isProUser={isProUser} />;
};
export default UnixTimeConverter;
