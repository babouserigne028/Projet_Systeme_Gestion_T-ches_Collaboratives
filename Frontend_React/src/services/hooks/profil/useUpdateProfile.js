import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import utilisateurService from "../../api/utilisateurService";
import { setCurrentUser } from "../../../store/userSlice";

const useUpdateProfile = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = useCallback(
    async (userId, data) => {
      setLoading(true);
      setError(null);
      try {
        const updatedUser = await utilisateurService.updateUser(userId, data);
        dispatch(setCurrentUser(updatedUser));
        return updatedUser;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  return { updateProfile, loading, error };
};

export default useUpdateProfile;
