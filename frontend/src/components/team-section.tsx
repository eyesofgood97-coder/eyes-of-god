import CardI from "./ui/cardi";

const teamMembers = [
  {
    name: "MIGUEL RAMIRES GONZALEZ",
    projects: 42,
    availability: 95,
    contributions: 1832,
  },
  {
    name: "ALDAHIR UBILLUZ GARCIA",
    projects: 37,
    availability: 88,
    contributions: 1574,
  },
  {
    name: "ALBERT JAYME ARONE",
    projects: 29,
    availability: 92,
    contributions: 1206,
  },
  {
    name: "ISAIAS RAMOS LOPEZ",
    projects: 34,
    availability: 90,
    contributions: 1419,
  },
  {
    name: "RICHARD HUAMAN PERALTA",
    projects: 25,
    availability: 85,
    contributions: 963,
  },
];

export default function TeamSection() {
  return (
    <section className="w-full max-w-5xl py-16 bg-background flex flex-col items-center justify-center mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-10 tracking-wide">
        DEVELOPMENT TEAM
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-18">
        {teamMembers.map((member, i) => (
          <CardI
            key={i}
            name={member.name}
            projects={member.projects}
            availability={member.availability}
            contributions={member.contributions}
          />
        ))}
      </div>
    </section>
  );
}
