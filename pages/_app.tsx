import "../src/style/index.css";

import { Auth } from "@supabase/ui";
import type { CustomAppPage } from "next/app";
import Head from "next/head";
import { memo, useEffect } from "react";
import { AuthLayout } from "src/layout";
import { client } from "src/lib/SupabaseClient";

const App: CustomAppPage = ({ Component, pageProps }) => {
  useEffect(() => {
    if (localStorage.theme === "dark") {
      document.body.classList.add("dark");
    } else if (localStorage.theme === "light") {
      document.body.classList.remove("dark");
    } else {
      const isLight = window.matchMedia(
        "(prefers-color-scheme: light)"
      ).matches;
      if (isLight) {
        document.body.classList.remove("dark");
      } else if (!isLight) {
        document.body.classList.add("dark");
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>QinTodo</title>
      </Head>
      <div className="text-slate-800 dark:text-gray-400 bg-white dark:bg-[#22272E]">
        <Auth.UserContextProvider supabaseClient={client}>
          <AuthLayout>
            <Component {...pageProps} />
          </AuthLayout>
        </Auth.UserContextProvider>
      </div>
    </>
  );
};

export default memo(App);
