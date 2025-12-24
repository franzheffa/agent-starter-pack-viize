import Layout from '../../components/Layout';
import Head from 'next/head';

const About = () => (
  <Layout>
    <Head>
      <title>About Buttertech | Digital-Native Agentic AI</title>
    </Head>
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>About Buttertech Inc.</h1>
      
      <section style={{ marginBottom: '30px' }}>
        <h2>Business Description</h2>
        <p>Buttertech is a Montreal-based Deep Tech startup. We specialize in Agentic AI orchestrations, solving the problem of real-time multimodal data ingestion for global camera networks.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>Our Products</h2>
        <p><strong>Agent Smith-Heffa Gateway:</strong> A production-grade platform connecting Flutter mobile interfaces to Prisma-accelerated PostgreSQL databases. Current Stage: Production Beta.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>Team</h2>
        <p><strong>Franz Heffa (Founder & Architect):</strong> Google Cloud Partner and NVIDIA Expert with certifications in Small Language Models and Responsible AI.</p>
      </section>
    </div>
  </Layout>
);

export default About;
