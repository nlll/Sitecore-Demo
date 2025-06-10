/* eslint-disable */
import type { AppProps } from 'next/app';
import { I18nProvider } from 'next-localization';
import { SitecorePageProps } from 'lib/page-props';
import Bootstrap from 'src/Bootstrap';
import { SessionProvider } from "next-auth/react";
import { Session } from 'next-auth';

import 'assets/main.scss';

interface ExtendedPageProps extends SitecorePageProps {
  session?: Session | null;
}

function App({ Component, pageProps }: AppProps<ExtendedPageProps>): JSX.Element {
  const { dictionary, ...rest } = pageProps;

  return (
    <>
      <Bootstrap {...pageProps} />
      <SessionProvider session={pageProps.session}>
        <I18nProvider lngDict={dictionary} locale={pageProps.locale}>
          <Component {...rest} />
        </I18nProvider>
      </SessionProvider>
    </>
  );
}

export default App;