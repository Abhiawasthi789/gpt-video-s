import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { auth } from "../services/firebase";
import { addUser, removeUser } from "../store/slices/userSlice";
import { setAuthChecked } from "../store/slices/uiSlice";

export function useAuthSync() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // Ensure we read the freshest profile values (displayName/photoURL)
          // especially right after sign-up + updateProfile.
          await user.reload();
          const currentUser = auth.currentUser ?? user;
          const { uid, email, displayName, photoURL } = currentUser;
          dispatch(addUser({ uid, email, displayName, photoURL }));
        } else {
          dispatch(removeUser());
        }
      } finally {
        dispatch(setAuthChecked(true));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
}

