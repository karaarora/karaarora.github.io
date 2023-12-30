import { Icon } from '@iconify/react';

export default function TechStack() {


    return (<>
    <h1 className="my-4 text-xl font-bold">Tech I use</h1>
    <div className='grid grid-cols-5 gap-6'>
        <TechItem icon="ri:javascript-line" text="Javascript" />
        <TechItem icon="mdi:react" text="React" />
        <TechItem icon="skill-icons:threejs-dark" text="Three.JS" />
        <TechItem icon="teenyicons:angular-outline" text="Angular"/>
        <TechItem icon="mdi:nodejs" text="Node JS" />
        <TechItem icon="mdi:language-ruby-on-rails" text="Ruby on Rails" />
        <TechItem icon="teenyicons:python-outline" text="Python" />
        <TechItem icon="icon-park-outline:html-five" text="HTML" />
        <TechItem icon="nonicons:css-16" text="CSS" />
        <TechItem icon="cib:kotlin" text="Kotlin" />
        <TechItem icon="mdi:graphql" text="GraphQL" />
        <TechItem icon="cib:mysql" text="MySQL" />
        <TechItem icon="teenyicons:mongodb-outline" text="MongoDB" />
        <TechItem icon="mdi:aws" text="AWS" />
        <TechItem icon="devicon-plain:argocd" text="ArgoCD" />
        <TechItem icon="simple-icons:jenkins" text="Jenkins" />
        <TechItem icon="mdi:github" text="Github" />
        <TechItem icon="simple-icons:jest" text="Jest" />
        <TechItem icon="tabler:brand-cypress" text="Cypress" />
    </div>
    <div className='my-4 text-right text-md font-semibold'>..and more</div>
    </>)
}


function TechItem({icon, text}) {
    
    const ICON_WIDTH = 48;
    const ICON_HEIGHT = 48;

    return (
        <div className='flex flex-col justify-center items-center'>
            <Icon icon={icon} width={ICON_WIDTH} height={ICON_HEIGHT}/>
            <div className="text-sm text-gray-500">{text}</div>
        </div>
    )
}