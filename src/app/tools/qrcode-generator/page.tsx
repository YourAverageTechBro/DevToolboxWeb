import QrCodeGeneratorComponent from "@/app/tools/qrcode-generator/QrCodeGeneratorComponent";
import { getUserAndSubscriptionState } from "@/actions/user";

const QrCodeGeneratorPage = async () => {
  const { user, isProUser } = await getUserAndSubscriptionState();
  return <QrCodeGeneratorComponent user={user} isProUser={isProUser} />;
};
export default QrCodeGeneratorPage;
