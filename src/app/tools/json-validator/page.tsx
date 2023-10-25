import JsonValidatorComponent from "@/app/tools/json-validator/JsonValidatorComponent";
import { getUserAndSubscriptionState } from "@/actions/user";

const JsonValidator = async () => {
  const { user, isProUser } = await getUserAndSubscriptionState();
  return <JsonValidatorComponent user={user} isProUser={isProUser} />;
};
export default JsonValidator;
