import Base64ImageEncoderComponent from "@/app/tools/base64imageencoder/Base64ImageEncoderComponent";
import {getUserAndSubscriptionState} from "@/actions/user";

const Base64ImageEncoder = async () => {
    const {user, isProUser} = await getUserAndSubscriptionState();
    return <Base64ImageEncoderComponent user={user} isProUser={isProUser}/>;
};
export default Base64ImageEncoder;
