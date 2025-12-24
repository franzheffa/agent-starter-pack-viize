import Layout from '../../components/Layout';

const About = () => (
  <Layout>
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', color: '#333' }}>
      <h1>About Buttertech Inc.</h1>
      
      <section>
        <h2>Business Description</h2>
        <p>Buttertech is a Montreal-based Deep Tech startup building the future of autonomous multimodal surveillance. We solve the problem of passive monitoring by injecting Agentic AI into global camera networks.</p>
      </section>

      <section>
        <h2>Our Products</h2>
        <p><strong>Agent Smith-Heffa Gateway:</strong> A production-grade multimodal orchestrator connecting Flutter interfaces to Prisma-accelerated high-performance databases. Current Stage: Production / Beta Launch.</p>
      </section>

      <section>
        <h2>Team Information</h2>
        <p><strong>Franz Heffa (Founder & Architect):</strong> Google Cloud Partner, Kaggle Certified Python Coder, and NVIDIA Stack Expert with over 20 years of vision for large-scale infrastructure.</p>
      </section>

      <section>
        <h2>Target Audience</h2>
        <p>Industrial partners, smart city developers, and enterprises requiring real-time vision-to-data synchronization at global scale.</p>
      </section>
    </div>
  </Layout>
);

export default About;
