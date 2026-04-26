import React, { useRef, useState } from "react";
import Header from "../layout/Header";
import { checkValidData } from "../../shared/validate";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../services/firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../../store/slices/userSlice";
import { BG_URL, USER_AVATAR } from "../../shared/constants";
import { startLoading, stopLoading } from "../../store/slices/uiSlice";

const Login = () => {
  const [isSignInForm, setSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();

  const email = useRef(null);
  const password = useRef(null);
  const name = useRef(null);

  const handleAction = async () => {
    const message = checkValidData(email.current.value, password.current.value);
    setErrorMessage(message);
    if (message) return;

    if (!isSignInForm && !name.current?.value?.trim()) {
      setErrorMessage("Name is required for sign up");
      return;
    }

    dispatch(startLoading());
    try {
      if (!isSignInForm) {
        console.log('test sign up');
        
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.current.value,
          password.current.value
        );
        const user = userCredential.user;
        console.log('test sign up user', user);

        try {
          await updateProfile(user, {
            displayName: name.current.value.trim(),
            photoURL: USER_AVATAR,
          });

          await user.reload();
          const currentUser = auth.currentUser ?? user;
          const { uid, email: currentEmail, displayName, photoURL } = currentUser;
          dispatch(
            addUser({
              uid,
              email: currentEmail,
              displayName,
              photoURL,
            })
          );
        } catch (e) {
          console.error("updateProfile failed", e);
          throw e;
        }
      } else {
        await signInWithEmailAndPassword(
          auth,
          email.current.value,
          password.current.value
        );
      }
    } catch (error) {
      const errorCode = error.code ?? "auth/error";
      const msg = error.message ?? "Something went wrong";
      setErrorMessage(errorCode + "-" + msg);
    } finally {
      dispatch(stopLoading());
    }
  };

  const toggleSign = () => {
    setSignInForm(!isSignInForm);
  };
  return (
    <div className="relative min-h-screen">
      <Header />
      <div className="fixed inset-0 -z-10">
        <img src={BG_URL} alt="bg" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-full max-w-md absolute p-12 bg-black/80 my-36 mx-auto right-0 left-0 text-white rounded-lg"
      >
        <h1 className="font-bold text-3xl py-4">
          {isSignInForm ? "Sign In" : "Sign Up"}
        </h1>

        {!isSignInForm && (
          <input
            ref={name}
            type="text"
            placeholder="Full Name"
            className="p-4 my-4 w-full bg-gray-700 rounded"
          />
        )}
        <input
          ref={email}
          type="text"
          placeholder="Email Address"
          className="p-4 my-4 w-full bg-gray-700 rounded"
        />
        <input
          ref={password}
          type="password"
          placeholder="Password"
          className="p-4 my-4 w-full bg-gray-700 rounded"
        />
        <p className="text-red-500 font-bold text-lg py-2">{errorMessage}</p>
        <button
          className="p-4 my-6 bg-red-700 w-full rounded-lg"
          onClick={handleAction}
        >
          {isSignInForm ? "Sign In" : "Sign Up"}
        </button>
        <p className="py-4 cursor-pointer" onClick={toggleSign}>
          {isSignInForm
            ? "New to Netflix? Sign Up Now"
            : "Already registered? Sign In Now."}
        </p>
      </form>
    </div>
  );
};
export default Login;