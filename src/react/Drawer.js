import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import About from './sections/About';
import Experience from './sections/Experience';
import TechStack from './sections/TechStack';
import Contact from './sections/Contact';

const Drawer = ({ isOpen, onClose, selectedIndex }) => {
  const [isVisible, setIsVisible] = useState(false);

  const navComponentMap = {
    0: <About />,
    1: <Experience />,
    2: <TechStack />,
    3: <Contact />,
  }

  console.log(navComponentMap[selectedIndex])

  useEffect(() => {
    if (isOpen) {
      openBox();
    } else {
      closeBox();
    }
  }, [isOpen]);

  const openBox = () => {
    const box = document.getElementById('myBox');

    box.style.opacity = 0;
    box.style.display = 'block';
    gsap.to(box, { duration: 0.5, x: 0, opacity: 1 });

    setIsVisible(true);
  };

  const closeBox = () => {
    const box = document.getElementById('myBox');

    gsap.to(box, { duration: 0.5, x: 700, onComplete: hideBox });
  };

  const hideBox = () => {
    const box = document.getElementById('myBox');
    box.style.display = 'none';
    box.style.opacity = 1;
    setIsVisible(false);
    // Notify the external component that the drawer is closed
  };

  return (
    <div
      id="myBox"
      className={`${
        isVisible ? 'block' : 'hidden'
      } fixed top-0 right-0 h-screen p-4 bg-white border shadow-md w-full sm:w-1/3`}
    >
        <button onClick={() => {
            closeBox();
            onClose();
        }}>X</button>
        <div className='m-5'>
        {navComponentMap[selectedIndex]}
        </div>
    </div>
  );
};

export default Drawer;
