import ColorConverterComponent from "@/app/tools/color-converter/ColorConverterComponent";
import { getUserAndSubscriptionState } from "@/actions/user";

const ColorConverter = async () => {
  const { user, isProUser } = await getUserAndSubscriptionState();
  return <ColorConverterComponent user={user} isProUser={isProUser} />;
};
export default ColorConverter;
