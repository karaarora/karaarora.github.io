import Resume from "../components/resume";

export default function Experience() {
  const companies = [
    {
      name: "Skillz",
      position: "Software Engineer",
      time: "February 2022 - December 2023",
      logo: "skillz.png",
      technologies: "Javascript, React, Ruby on Rails, Jenkins, AWS",
      link: "https://developers.skillz.com"
    },
    {
      name: "Expedia",
      position: "Software Engineer",
      time: "December 2019 - February 2022",
      logo: "expedia.png",
      technologies: "Android, Kotlin, Javascript, GraphQL, Jenkins, Splunk",
      link: "https://play.google.com/store/apps/details?id=com.expedia.bookings&hl=en&gl=US&pli=1"
    },
    {
      name: "Housing.com",
      position: "Software Engineer",
      time: "January 2018 - December 2019",
      logo: "housing.png",
      technologies: "Javascript, React, THREE.JS, jQuery, AR/VR, GraphQL, Jenkins, AWS",
      link: "https://digitour.housing.com/",
    },
  ];

  return (
    <>
      <h1 className="my-4 text-xl font-bold">Experience</h1>
      {companies.map((company, index) => (
        <Company key={index} company={company} />
      ))}
      <div className="my-12 right-0">
        <Resume />
      </div>
    </>
  );
}

function Company({ company }) {
  return (
    <div className="my-6">
      <div className="flex flex-row">
        <div className="">
          <img
            className="object-fit w-16 h-16"
            src={`./images/logos/${company.logo}`}
          />
        </div>
        <div className="mx-4">
          <div className="text-md font-bold">{company.name}</div>
          <div className="text-sm">{company.position}</div>
          <div className="text-xs my-1">{company.time}</div>
        </div>
      </div>
      <div className="my-2 text-sm">
        <span className="font-bold">Technologies: </span>{company.technologies}
      </div>
      <div className="my-2 text-sm">
      <a href={company.link} className="text-sm text-blue-600 underline dark:text-blue-500 hover:no-underline">Primary ownership area</a>
      </div>
    </div>
  );
}
