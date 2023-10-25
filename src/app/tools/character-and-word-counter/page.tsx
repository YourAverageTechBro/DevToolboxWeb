import CharacterAndWordCounterComponent from "@/app/tools/character-and-word-counter/CharacterAndWordCounterComponent";
import { getUserAndSubscriptionState } from "@/actions/user";

const CharacterAndWordCounterPage = async () => {
  const { user, isProUser } = await getUserAndSubscriptionState();
  return <CharacterAndWordCounterComponent user={user} isProUser={isProUser} />;
};
export default CharacterAndWordCounterPage;
