import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import authService from "../../api/authService";
import { setCurrentUser } from "../../../store/userSlice";

const useFetchCurrentUser = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.getCurrentUser();
      setUser(data);
      dispatch(setCurrentUser(data));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, error, refresh: fetchUser };
};

export default useFetchCurrentUser;
