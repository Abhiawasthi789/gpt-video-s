import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { auth } from "../services/firebase";
import { addUser, removeUser } from "../store/slices/userSlice";
import { setAuthChecked } from "../store/slices/uiSlice";

export function useAuthSync() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(addUser({ uid, email, displayName, photoURL }));
      } else {
        dispatch(removeUser());
      }
      dispatch(setAuthChecked(true));
    });

    return () => unsubscribe();
  }, [dispatch]);
}

