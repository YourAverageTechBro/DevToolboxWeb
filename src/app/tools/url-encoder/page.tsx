import UrlEncoderComponent from "@/app/tools/url-encoder/UrlEncoderComponent";
import { getUserAndSubscriptionState } from "@/actions/user";

const UrlEncoderPage = async () => {
  const { user, isProUser } = await getUserAndSubscriptionState();
  return <UrlEncoderComponent user={user} isProUser={isProUser} />;
};
export default UrlEncoderPage;
