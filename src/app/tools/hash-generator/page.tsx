import HashGeneratorComponent from "@/app/tools/hash-generator/HashGeneratorComponent";
import { getUserAndSubscriptionState } from "@/actions/user";

const HashGenerator = async () => {
  const { user, isProUser } = await getUserAndSubscriptionState();
  return <HashGeneratorComponent user={user} isProUser={isProUser} />;
};
export default HashGenerator;
