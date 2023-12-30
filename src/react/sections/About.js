import Resume from "../components/resume";

export default function About(){
    return (<div>
        <div className="flex align-center justify-center">
            <img className="object-fit w-72 h-72 rounded-full" src="./images/profile.jpg" />
        </div>
        <h1 className="my-4 text-xl font-bold">About Me</h1>
        <div className="text-sm">Hello, I'm Karan, and I'm passionate about technology and the endless possibilities it offers. As a seasoned full-stack engineer, I've had the privilege of working on a diverse range of projects that have honed my skills and shaped my perspective on the ever-evolving tech landscape.</div>
        <div className="my-7">
           <Resume />
           </div>        
        <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Or just <a href="mailto:karan.preet@hotmail.com" class="text-sm text-blue-600 underline dark:text-blue-500 hover:no-underline">send me an Email.</a></p>
    </div>
    </div>)
}