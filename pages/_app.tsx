import Head from 'next/head';
import '../globals.css';

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Buttertech | Agent Smith-Heffa Multimodal AI</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Montreal-based Deep Tech startup for autonomous surveillance." />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
export default App;
