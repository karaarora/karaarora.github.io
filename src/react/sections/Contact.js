import Resume from "../components/resume";

export default function Contact() {
    return (<>
        <h1 className="my-4 text-xl font-bold">Contact Me</h1>
        <div className="text-sm">
        Hello there! I'm thrilled to hear from you. Whether you have an exciting project in mind, want to discuss collaboration opportunities, or simply want to say hello, feel free to reach out. Your thoughts and ideas are always welcome.
        </div>
        <div className="text-sm my-4">
            <span className="font-bold">Linkedin: </span><a className="text-sm text-blue-600 underline dark:text-blue-500 hover:no-underline" href="https://www.linkedin.com/in/karanpreetsingharora/">karanpreetsingharora</a>
        </div>
        <div className="text-sm my-4">
            <span className="font-bold">Email: </span><a className="text-sm text-blue-600 underline dark:text-blue-500 hover:no-underline" href="mailto:karan.preet@hotmail.com">karan[dot]preet[at]hotmail</a>
        </div>
        <div className="my-8">
            <Resume />
        </div>
    </>)
}