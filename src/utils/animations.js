import gsap from "gsap";

export function updateArmRotation(model, bones, mouse) {
  // Calculate rotation angles based on mouse position
  const armRotationX = (mouse.y * Math.PI) / 4; // Example scaling factor (adjust as needed)
  const armRotationY = (mouse.x * Math.PI) / 4; // Example scaling factor (adjust as needed)

  gsap.to(bones.leftUpperArm.rotation, {
    x: -armRotationX,
    y: -armRotationY,
    duration: 0.3,
  });
  gsap.to(bones.rightUpperArm.rotation, {
    x: armRotationX,
    y: armRotationY,
    duration: 0.3,
  });
}

export function turnRight(model) {
    gsap.to(model.rotation, {
        y: Math.PI/2,
        duration: 1,
        ease: "power2.inOut"
    })
}
export function updateHeadRotation(mouse, bones, isWalking) {
  // Calculate rotation angles based on mouse position
  const angleX = (mouse.x * Math.PI) / 8; // Example scaling factor (adjust as needed)
  const angleY = (mouse.y * Math.PI) / 8; // Example scaling factor (adjust as needed)

  if (!isWalking) {
    // Use GSAP to smoothly animate the head rotation
    gsap.to(bones.headBone.rotation, {
      x: -angleY,
      y: angleX,
      z: 0,
      duration: 0.3, // Adjust the duration for the desired smoothness
    });
  }
}

export function stopWalkingAnimation(model) {
    // Calculate rotation angles based on mouse position
    gsap.to(model.rotation, {
        y:  0,
        duration: 1,
        ease: "power2.inOut",
      });
  }
  
export function updateArmsMotion(bones, clock) {
  const rockingSpeed = 1; // Adjust as needed
  const rockingCycleDuration = 1; // Duration of one complete rocking cycle (seconds)

  const rockingPhase =
    (clock.elapsedTime * rockingSpeed) % rockingCycleDuration;

  // Define rocking motion parameters (adjust as needed)
  const armRotation = (Math.sin(rockingPhase * Math.PI * 2) * Math.PI) / 20;
  const forearmRotation = (Math.sin(rockingPhase * Math.PI * 2) * Math.PI) / 8;
  const handRotation = (Math.sin(rockingPhase * Math.PI * 2) * Math.PI) / 8;

  // GSAP tweens for smooth animations
  gsap.to(bones.leftUpperArm.rotation, {
    x: bones.leftUpperArm.initialRotation + armRotation,
    duration: 0.3,
  });
  gsap.to(bones.leftForearm.rotation, {
    x: bones.leftForearm.initialRotation + forearmRotation,
    duration: 0.3,
  });
  gsap.to(bones.leftHand.rotation, {
    x: bones.leftHand.initialRotation + handRotation,
    duration: 0.3,
  });
  gsap.to(bones.rightUpperArm.rotation, {
    x: bones.rightUpperArm.initialRotation - armRotation,
    duration: 0.3,
  });
  gsap.to(bones.rightForearm.rotation, {
    x: bones.rightForearm.initialRotation - forearmRotation,
    duration: 0.3,
  });
  gsap.to(bones.rightHand.rotation, {
    x: bones.rightHand.initialRotation - handRotation,
    duration: 0.3,
  });
}

export function updateWalkingAnimation(bones, clock) {
  const walkSpeed = 1; // Adjust as needed
  const walkCycleDuration = 1; // Duration of one complete walk cycle (seconds)

  const walkPhase = (clock.elapsedTime * walkSpeed) % walkCycleDuration;

  const thighRotation = (Math.cos(walkPhase * Math.PI * 2) * Math.PI) / 8;
  const calfRotation = (Math.sin(walkPhase * Math.PI * 2) * Math.PI) / 8;
  const toeRotation = (Math.sin(walkPhase * Math.PI * 2) * Math.PI) / 16;

  // Calculate the target rotations for both legs based on the walking direction
  const targetLeftThighRotation =
    bones.leftThigh.initialRotation - thighRotation;
  const targetLeftCalfRotation = bones.leftCalf.initialRotation + calfRotation;
  const targetLeftToeRotation = bones.leftToe.initialRotation + toeRotation;
  const targetRightThighRotation =
    bones.rightThigh.initialRotation + thighRotation;
  const targetRightCalfRotation =
    bones.rightCalf.initialRotation - calfRotation;
  const targetRightToeRotation = bones.rightToe.initialRotation - toeRotation;

  // GSAP tweens for smooth animations
  gsap.to(bones.leftThigh.rotation, {
    x: targetLeftThighRotation,
    duration: 0.3,
  });
  gsap.to(bones.leftCalf.rotation, {
    x: targetLeftCalfRotation,
    duration: 0.3,
  });
  gsap.to(bones.leftToe.rotation, { x: targetLeftToeRotation, duration: 0.3 });
  gsap.to(bones.rightThigh.rotation, {
    x: targetRightThighRotation,
    duration: 0.3,
  });
  gsap.to(bones.rightCalf.rotation, {
    x: targetRightCalfRotation,
    duration: 0.3,
  });
  gsap.to(bones.rightToe.rotation, {
    x: targetRightToeRotation,
    duration: 0.3,
  });

  const bobbleAmount = 0.1; // Adjust as needed
  const headBobble = Math.sin(walkPhase * Math.PI * 2) * bobbleAmount;
  gsap.to(bones.headBone.rotation, { x: headBobble, duration: 0.3 });
}
