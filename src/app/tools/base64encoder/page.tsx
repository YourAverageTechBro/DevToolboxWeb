import Bas64EncoderComponent from "@/app/tools/base64encoder/Base64EncoderClientComponent";
import { getUserAndSubscriptionState } from "@/actions/user";

const Base64Encoder = async () => {
  const { user, isProUser } = await getUserAndSubscriptionState();
  return <Bas64EncoderComponent user={user} isProUser={isProUser} />;
};
export default Base64Encoder;
