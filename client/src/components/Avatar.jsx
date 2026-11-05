import PresetAvatar from "./PresetAvatar.jsx";

const Avatar = ({ user, large }) => (
  <span className={`avatar ${large ? "avatar-lg" : ""}`}>
    {user?.avatar?.url ? (
      <img src={user.avatar.url} alt="" />
    ) : user?.avatar?.preset ? (
      <PresetAvatar id={user.avatar.preset} />
    ) : (
      user?.name?.[0]?.toUpperCase()
    )}
  </span>
);

export default Avatar;
