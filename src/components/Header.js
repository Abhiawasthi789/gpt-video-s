import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { LOGO, SUPPORTED_LANGUAGES } from "../shared/constants";
import { auth } from "../services/firebase";
import { addUser, removeUser } from "../store/slices/userSlice";
import { toggleGptSearchView, resetGptMovieResuts } from "../store/slices/gptSlice";
import { changeLanguage } from "../store/slices/configSlice";
import { startLoading, stopLoading } from "../store/slices/uiSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useSelector((store) => store.user);
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);
  const handleSignOut = async () => {
    dispatch(startLoading());
    try {
      await signOut(auth);
    } catch (error) {
      navigate("/error");
    } finally {
      dispatch(stopLoading());
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(
          addUser({
            uid: uid,
            email: email,
            displayName: displayName,
            photoURL: photoURL,
          })
        );
        // Only force redirect from auth page; keep current protected route.
        if (location.pathname === "/") {
          navigate("/browse");
        }
      } else {
        dispatch(removeUser());
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [dispatch, navigate, location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleGptSearchClick = () => {
    dispatch(toggleGptSearchView());
    !showGptSearch && dispatch(resetGptMovieResuts());
    navigate("/browse");
    setIsMenuOpen(false);
  };

  const handleLanguageChange = (e) => {
    dispatch(changeLanguage(e.target.value));
  };

  return (
    <div className="absolute z-10 flex w-full flex-col bg-gradient-to-b from-black px-4 py-3 md:flex-row md:justify-between md:px-8 md:py-2">
      <img className="mx-auto w-32 md:mx-0 md:w-44" src={LOGO} alt="logo" />
      {user && (
        <div className="mt-2 flex items-center justify-center gap-2 md:mt-0 md:justify-between md:gap-2 md:p-2">
          {showGptSearch && (
            <select
              className="m-1 rounded bg-gray-900 p-2 text-sm text-white md:m-2 md:text-base"
              onChange={handleLanguageChange}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.identifier} value={lang.identifier}>
                  {lang.name}
                </option>
              ))}
            </select>
          )}
          <button
            className="mx-1 my-1 rounded-lg bg-purple-800 px-3 py-2 text-sm text-white md:mx-4 md:my-2 md:px-4 md:text-base"
            onClick={handleGptSearchClick}
          >
            {showGptSearch ? "Homepage" : "GPT Search"}
          </button>
          <div className="relative" ref={menuRef}>
            <button
              className="flex items-center gap-2 rounded bg-black/30 px-2 py-1"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Open account menu"
            >
              <img
                className="h-9 w-9 rounded object-cover md:h-10 md:w-10"
                alt="usericon"
                src={user?.photoURL}
              />
              <span className="hidden text-xs text-white md:inline">▼</span>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 rounded bg-zinc-900/95 p-3 shadow-xl">
                <p className="truncate text-sm font-semibold text-white">
                  {user?.displayName || "Netflix User"}
                </p>
                <p className="truncate pt-1 text-xs text-zinc-400">{user?.email}</p>
                <button
                  onClick={handleSignOut}
                  className="mt-3 w-full rounded bg-red-700 px-3 py-2 text-sm font-semibold text-white hover:bg-red-800"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default Header;
