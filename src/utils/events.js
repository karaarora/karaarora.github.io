import gsap from "gsap"
import { updateWalkingAnimation, stopWalkingAnimation } from "./animations";

export const onKeyDown = (model, bones, clock) =>
  (event) => {
    if (event.code === "ArrowRight") {
      if (!model.isWalking) {
        gsap.to(model.rotation, {
          y: Math.PI / 2,
          duration: 1,
          ease: "power2.inOut",
        });
        updateWalkingAnimation(bones, clock);
        model.isWalking = 1;
      }
    } else if (event.code === "ArrowLeft") {
      if (!model.isWalking) {
        gsap.to(model.rotation, {
          y: -Math.PI / 2,
          duration: 1,
          ease: "power2.inOut",
        });
        updateWalkingAnimation(bones, clock);
        model.isWalking = -1;
      }
    }
  };

export const onKeyUp = (model) => 
  (event) => {
    if (event.code === "ArrowRight") {
      model.isWalking = 0;
      stopWalkingAnimation(model);
    }
    if (event.code === "ArrowLeft") {
      model.isWalking = false;
      stopWalkingAnimation(model);
    }
  };
