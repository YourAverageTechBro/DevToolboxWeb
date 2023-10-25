import DiffViewerComponent from "@/app/tools/diff-viewer/DiffViewerComponent";
import { getUserAndSubscriptionState } from "@/actions/user";

const DiffViewer = async () => {
  const { user, isProUser } = await getUserAndSubscriptionState();
  return <DiffViewerComponent user={user} isProUser={isProUser} />;
};
export default DiffViewer;
