
import React from 'react';

const AboutUs = () => {
  return (
    <div className="bg-gradient-to-b from-white via-gray-100 to-gray-200 py-10 px-4 sm:px-6 lg:px-20">
      <div className="max-w-7xl mx-auto shadow-lg rounded-lg bg-white p-8">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-8 underline decoration-blue-500">
          About Us
        </h1>
        <p className="text-lg text-gray-600 mb-6 text-justify leading-relaxed">
          Welcome to the <span className="font-semibold text-blue-600">Smart Construction Monitoring Platform</span>, a revolutionary solution designed to transform the way road construction projects are monitored and managed in Indian cities. Our platform leverages cutting-edge machine learning and aerial drone-based imaging technologies to ensure accurate, efficient, and real-time progress tracking of construction activities.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-500 inline-block">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            We aim to empower urban local bodies (ULBs), state agencies, and central organizations with an innovative solution that eliminates the need for frequent field visits by technical experts. By automating the monitoring process, we enable stakeholders to focus on enhancing project efficiency, reducing costs, and ensuring timely completion of construction projects.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-500 inline-block">The Problem We Address</h2>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-2">
            <li>Limited availability of technical experts for site visits.</li>
            <li>Delayed reporting and inefficient tracking mechanisms.</li>
            <li>Difficulty in identifying errors or inconsistencies promptly.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-500 inline-block">Our Solution</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            The Smart Construction Monitoring Platform provides a machine learning-based software solution capable of processing aerial/drone-based images to identify the stages of road construction. This innovative approach ensures accurate monitoring and reporting by:
          </p>
          <ol className="list-decimal list-inside text-gray-600 leading-relaxed space-y-2">
            <li>
              <span className="font-medium text-blue-600">Image Analysis</span>: Identifying the stage of construction activities, such as installation of utility ducts, macadamization, road construction, and pedestrian infrastructure.
            </li>
            <li>
              <span className="font-medium text-blue-600">Progress Comparison</span>: Comparing uploaded site images with previous data to assess the progress of work.
            </li>
            <li>
              <span className="font-medium text-blue-600">Error Detection</span>: Validating uploaded images and inputs to ensure accuracy, prompting corrections if necessary.
            </li>
            <li>
              <span className="font-medium text-blue-600">Customized Monitoring</span>: Allowing users to input specific activity details (e.g., type of construction activity, road stretch location) for tailored analysis.
            </li>
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-500 inline-block">Key Features</h2>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-2">
            <li><span className="font-medium text-blue-600">User-Friendly Interface</span>: Easily upload images and input project details.</li>
            <li><span className="font-medium text-blue-600">Real-Time Analysis</span>: Generate detailed reports on construction stages and road lengths completed.</li>
            <li><span className="font-medium text-blue-600">AI-Powered Insights</span>: Employ machine learning algorithms trained on road construction datasets to deliver precise results.</li>
            <li><span className="font-medium text-blue-600">Error Management</span>: Detect incorrect or inconsistent inputs, ensuring reliable data processing.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-500 inline-block">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            We envision a future where construction monitoring is:
          </p>
          <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-2">
            <li>Automated and efficient.</li>
            <li>Accurate and reliable.</li>
            <li>Scalable to various types of infrastructure projects beyond road construction.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-500 inline-block">Who We Are</h2>
          <p className="text-gray-600 leading-relaxed">
            We are a team of dedicated technologists, data scientists, and urban planners working under the guidance of the Ministry of Housing and Urban Affairs, Smart Cities Mission. Our collaborative efforts aim to harness the power of artificial intelligence to solve real-world challenges in infrastructure management.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-500 inline-block">Get in Touch</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Join us in revolutionizing construction monitoring! Whether you are a policymaker, contractor, or urban planner, our platform is here to make your projects more efficient and transparent.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Contact us today to learn more about how we can assist in your construction monitoring needs. Together, let’s build smarter cities for a better tomorrow.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;


