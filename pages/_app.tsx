import { SessionProvider } from "next-auth/react";
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../globals.css';

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Buttertech | Agent Smith-Heffa Multimodal AI</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Montreal-based Deep Tech startup for autonomous surveillance." />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default App;
