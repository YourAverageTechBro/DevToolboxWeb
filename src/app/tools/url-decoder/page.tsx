import UrlDecoderComponent from "@/app/tools/url-decoder/UrlDecoderComponent";
import { getUserAndSubscriptionState } from "@/actions/user";

const UrlDecoderPage = async () => {
  const { user, isProUser } = await getUserAndSubscriptionState();
  return <UrlDecoderComponent user={user} isProUser={isProUser} />;
};
export default UrlDecoderPage;
