import {NAV} from "./constants"

export function Nav({selectedIndex, onNavItemPress}) {
    
    return (
        <div className="text-black p-4 my-10">
            {NAV.map((navItem, index) => (<div className={`my-2 cursor-pointer ${selectedIndex === index ? "mx-2 underline" : ""}`} key={index} onClick={() => onNavItemPress(index)}>{navItem}</div>))}
        </div>
    )
}