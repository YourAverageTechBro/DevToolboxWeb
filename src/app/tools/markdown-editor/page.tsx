import MarkdownEditorComponent from "@/app/tools/markdown-editor/MarkdownEditorComponent";
import { getUserAndSubscriptionState } from "@/actions/user";

const MarkdownEditorPage = async () => {
  const { user, isProUser } = await getUserAndSubscriptionState();
  return <MarkdownEditorComponent user={user} isProUser={isProUser} />;
};
export default MarkdownEditorPage;
