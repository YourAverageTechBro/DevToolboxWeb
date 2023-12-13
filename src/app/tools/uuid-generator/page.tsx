import UuidGeneratorComponent from "@/app/tools/uuid-generator/UuidGeneratorComponent";
import { getUserAndSubscriptionState } from "@/actions/user";

const UuidGeneratorPage = async () => {
  const { user, isProUser } = await getUserAndSubscriptionState();
  return <UuidGeneratorComponent user={user} isProUser={isProUser} />;
};
export default UuidGeneratorPage;
