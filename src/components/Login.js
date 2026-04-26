import React, { useRef, useState } from 'react'
import Header from './Header'
import { checkValidData } from '../shared/validate';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../services/firebase";
import { useDispatch } from 'react-redux';
import { addUser } from '../store/slices/userSlice';
import { BG_URL, USER_AVATAR } from '../shared/constants';

const Login = () => {
  const [isSignInForm, setSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();

  const email = useRef(null);
  const password = useRef(null);
  const name = useRef(null);
  const handleAction = () => {
    const errorMessage = checkValidData(email.current.value, password.current.value);
    setErrorMessage(errorMessage);
    if (errorMessage) return;

    if (!isSignInForm) {
      createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, {
            displayName: name.current.value,
            photoURL: USER_AVATAR,
          })
            .then(() => {
              const { uid, email, displayName, photoURL } = auth.currentUser;
              dispatch(
                addUser({
                  uid: uid,
                  email: email,
                  displayName: displayName,
                  photoURL: photoURL,
                })
              );
            })
            .catch((error) => {
              setErrorMessage(error.message);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
        });
    } else {
      signInWithEmailAndPassword(auth, email.current.value, password.current.value)
        .then((userCredential) => {
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
        });
    }

  }
  const toggleSign = () => {
    setSignInForm(!isSignInForm);
  }
  return (
    <div className="relative min-h-screen">
      <Header />

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <img
          src={BG_URL}
          alt="bg"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Form Container */}
      <div className="flex justify-center items-center min-h-screen px-4">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full max-w-md bg-black/80 p-6 md:p-10 rounded-lg text-white"
        >
          <h1 className="font-bold text-2xl md:text-3xl py-4">
            Sign {isSignInForm ? "In" : "Up"}
          </h1>

          {!isSignInForm && (
            <input
              ref={name}
              type="text"
              placeholder="Full Name"
              className="p-3 my-2 w-full bg-gray-700 rounded"
            />
          )}

          <input
            ref={email}
            type="text"
            placeholder="Email Address"
            className="p-3 my-2 w-full bg-gray-700 rounded"
          />

          <input
            ref={password}
            type="password"
            placeholder="Password"
            className="p-3 my-2 w-full bg-gray-700 rounded"
          />

          <p className="text-red-500 text-sm py-2">{errorMessage}</p>

          <button
            onClick={handleAction}
            className="p-3 my-4 bg-red-700 w-full rounded-lg hover:bg-red-800 transition"
          >
            Sign {isSignInForm ? "In" : "Up"}
          </button>

          <p
            className="text-sm cursor-pointer mt-2"
            onClick={toggleSign}
          >
            {isSignInForm
              ? "New here? Sign Up"
              : "Already registered? Sign In"}
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login;