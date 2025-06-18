import React from 'react'
import Image from 'next/image'

export default function About() {
  const team = [
    {
      name: 'Dr. Mohsin Furkh',
      role: 'Founder & Lead Instructor',
      bio: 'PhD from University of Hyderabad, qualified UGC NET JRF 3 times and UGC NET 2 times. Expertise in deep learning and medical imaging.',
      image: '/images/Mohsin_Pic.jpg',
    },
    {
      name: 'Sayima Mukhtar',
      role: 'Technical Lead',
      bio: 'B.Tech and M.Tech in Computer Science. Experienced in software development and computer science education.',
      image: '/images/Sayima_Pic.jpeg',
    },
  ]

  return (
    <div className="space-y-12">
      {/* About Section */}
      <section>
        <h1>About UGC NET CS Practice Platform</h1>
        <p className="text-lg">
          Welcome to the most comprehensive practice platform for UGC NET Computer
          Science examination. Our platform is designed by experts who have
          successfully cleared the exam multiple times and understand what it takes
          to succeed.
        </p>
      </section>

      {/* Mission Section */}
      <section className="card">
        <h2>Our Mission</h2>
        <p>
          Our mission is to provide high-quality, accessible preparation resources
          for UGC NET Computer Science aspirants. We believe in:
        </p>
        <ul className="list-disc list-inside space-y-2 mt-4">
          <li>Comprehensive coverage of all topics</li>
          <li>Regular updates with latest exam patterns</li>
          <li>Affordable and accessible learning resources</li>
          <li>Community-driven support system</li>
        </ul>
      </section>

      {/* Team Section */}
      <section>
        <h2>Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {team.map((member) => (
            <div key={member.name} className="card flex flex-col items-center text-center p-6">
              <div className="relative w-48 h-48 rounded-full overflow-hidden mb-6">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>
              <h3 className="mb-2">{member.name}</h3>
              <p className="text-primary font-medium mb-4">{member.role}</p>
              <p className="text-gray-600">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="card">
        <h2>Contact Us</h2>
        <p>
          Have questions or suggestions? We'd love to hear from you. Reach out to
          us at:
        </p>
        <div className="mt-4">
          <p>
            Email:{' '}
            <a href="mailto:contact@ugcnetcs.com" className="text-primary hover:underline">
              contact@ugcnetcs.com
            </a>
          </p>
          <p>
            Follow us on:{' '}
            <a
              href="https://twitter.com/ugcnetcs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Twitter
            </a>
            {' | '}
            <a
              href="https://linkedin.com/company/ugcnetcs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              LinkedIn
            </a>
          </p>
        </div>
      </section>
    </div>
  )
} 