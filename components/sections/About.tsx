export default function About() {
  const stats = [
    { value: "15+", label: "Years Experience" },
    { value: "200+", label: "Projects Completed" },
    { value: "50+", label: "Expert Team Members" },
    { value: "98%", label: "Client Satisfaction" },
  ];

  const team = [
    { name: "John Smith", role: "CEO & Founder", initials: "JS" },
    { name: "Sarah Johnson", role: "Lead Architect", initials: "SJ" },
    { name: "Mike Davis", role: "Project Manager", initials: "MD" },
    { name: "Lisa Brown", role: "Design Director", initials: "LB" },
  ];

  return (
    <section id="about" className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">About Us</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Dedicated to delivering superior construction services since 2010
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <span className="text-8xl">🏢</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-primary mb-4">Our Story</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Founded in 2010, BuildCo has grown from a small local contractor to
              one of the region&apos;s most trusted construction companies. We
              pride ourselves on quality craftsmanship, innovative solutions, and
              unwavering commitment to client satisfaction.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Every project we undertake is a partnership. We listen, plan, and
              execute with precision, ensuring your vision becomes reality. Our
              team of experts brings decades of combined experience to every job.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-6 text-center shadow-sm"
            >
              <div className="text-3xl font-bold text-accent">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-2xl font-bold text-primary text-center mb-10">Meet Our Team</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-primary">{member.initials}</span>
                </div>
                <h4 className="font-semibold text-primary">{member.name}</h4>
                <p className="text-sm text-gray-500 mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
