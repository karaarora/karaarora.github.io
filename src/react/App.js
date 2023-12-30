import { Header } from "./Header";
import { Nav } from "./Nav";
import Drawer from "./Drawer"
import Footer from "./sections/Footer";
import { turnRight, walkAndFaceUp } from "./utils/animations";

import { useState } from "react";

export default function App(model) {
    
    const onNavItemPress = (index) => {
        window.isNavOpen = true
        setSelectedNav(index)
        turnRight(model.model)
    }

    const onDrawerClosed = () => {
        window.isNavOpen = false
        setSelectedNav(-1)
        walkAndFaceUp(model.model)
    }

    const [selectedNav, setSelectedNav] = useState(-1)

    return(
        <>
            <div className="">
                <Header />
                <Nav selectedIndex={selectedNav} onNavItemPress={onNavItemPress} />
                <Drawer isOpen={selectedNav !== -1} onClose={onDrawerClosed} selectedIndex={selectedNav}/>
                <Footer />
                </div>
        </>
    )
}