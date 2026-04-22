import { avatars } from "../services/avatarData";
import axios from "axios";

export default function AvatarPicker({ onClose }: any) {
  const token = localStorage.getItem("token");

  const selectAvatar = async (id: string) => {
    await axios.put(
      `${import.meta.env.VITE_API_URL}/profile/avatar`,
      { avatar: id },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    localStorage.setItem("userAvatar", id);
    onClose();
    window.location.reload();
  };

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-3 gap-4 p-4">
        {avatars.map((a) => (
          <img
            key={a.id}
            src={a.src}
            onClick={() => selectAvatar(a.id)}
            className="w-20 h-20 rounded-full cursor-pointer hover:scale-110 transition"
          />
        ))}
      </div>
      <div className="flex justify-end gap-3 items-center p-4">
        <button
          onClick={onClose}
          className="mt-4 bg-custom-400/70 text-white w-20 py-2 rounded-full"
        >
          Close
        </button>
        <button
          onClick={() => selectAvatar("")}
          className="mt-4 bg-neutral-600/70 text-white w-20 py-2 rounded-full"
        >
          Default
        </button>
      </div>
    </div>
  );
}
