import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { Outlet } from "react-router-dom";
import  powerIcon  from "../assets/power-on.svg";
import profileIcon from "../assets/user.svg";
import appLogo from "../assets/logo.svg";

const tabs = [
  { label: "Overview", path: "/dashboard" },
  { label: "New Challenge", path: "/create" },
  { label: "Challenges", path: "/my-challenges" },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const activeIndex = useMemo(() => {
    return tabs.findIndex((tab) => {
      if (tab.path === "/create") {
        return location.pathname.startsWith("/create");
      }
      else if(tab.path === "/my-challenges") {
        return location.pathname.startsWith("/my-challenges");
      }

      return location.pathname === tab.path;
    });
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="h-screen bg-custom-100/60 min-h-[100dvh] w-full overflow-hidden">
      {/* HEADER */}
      
      <header className="fixed top-0 left-0 right-0 h-12
bg-custom-400/50 backdrop-blur-md 
text-white shadow-xl rounded-b-[5%]
flex justify-between items-center px-4 z-50 border-[0.50px]">

  {/* LOGO */}
  <div className="flex items-center">
    {/* <span className="text-indigo-400">100</span>
    <span>DAYS</span> */}
    <img src={appLogo} alt="logo" className="w-12" onClick={() =>{navigate('/dashboard')}}/>
  </div>

  {/* PROFILE */}
  <div className="relative">
    <button
  onClick={() => setOpen(!open)}
  className="relative z-20 w-9 h-9 rounded-full flex items-center justify-center border-[0.25px] drop-shadow-md"
>

  {/* Gradient background layer */}
  <span
    className="absolute inset-0 rounded-full 
    bg-gradient-to-br from-indigo-300 via-indigo-400 to-indigo-600
    blur-[0.40px]"
  ></span>

  {/* Icon */}
  <img
    src={profileIcon}
    alt="prf"
    className="relative h-5 w-5 opacity-80"
  />

</button>

    {open && (
      <div className="fixed right-3 top-1 w-[90px] h-[110px] flex flex-col-reverse bg-neutral-700/60 backdrop-blur-3xl shadow-lg rounded-md rounded-tr-[20%] p-2">
        <button
  onClick={logout}
  className="flex items-center gap-2 text-red-500 text-sm w-full text-left [text-shadow:0_1px_12px_rgba(0,0,0,1)]"
>
  <img src={powerIcon} className="w-4 h-4 opacity-80 [text-shadow:0_1px_12px_rgba(0,0,0,1)]" />
  Logout
</button>
      </div>
    )}
  </div>
</header>

      {/* MAIN CONTENT */}
      <main className="pt-16 pb-16 h-screen overflow-y-auto p-4 bg-custom-100/60"  onClick={()=>{setOpen(false)}}>
        <Outlet />
      </main>

      {/* ARC NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 h-12 z-50">
        {/* Stronger Curved Base */}
        <div className="absolute bottom-0 left-0 right-0 h-12 
        bg-custom-400/50 backdrop-blur-md
text-white shadow-[0_-16px_35px_rgba(0,0,0,0.35)]
rounded-t-[55%] border-[0.50px]
" />

        <div className="absolute bottom-1 left-0 right-0 flex justify-center">
          <div className="relative w-80 h-12 flex items-center justify-center">
            {tabs.map((tab, index) => {
              const offset = index - activeIndex;

              let transform = "";
              let style = "";

              if (offset === 0) {
                transform = "translate-y-[-12px]";
                style =
                  "text-slate-200 [text-shadow:0_2px_12px_rgba(0,0,0,0.50)] text-xl scale-125 font-bold px-5 drop-shadow-lg ";
              } else if (offset === -1 || offset === 2) {
                transform = "translate-x-[-105px] translate-y-[10px]";
                style = "text-indigo-400 [text-shadow:0_1px_12px_rgba(0,0,0,1)] text-sm font-bold ";
              } else if (offset === 1 || offset === -2) {
                transform = "translate-x-[105px] translate-y-[10px]";
                style = "text-indigo-400 [text-shadow:0_1px_12px_rgba(0,0,0,1)] text-sm font-bold";
              }

              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className={`absolute transition-all duration-500 ease-out ${transform} ${style}`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
