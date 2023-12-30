import { MODEL } from "./constants";

export function handleScreenResize(camera, renderer) {
  return () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
}

export function initializeBones(model) {
    const bones = {}
    bones.headBone = model.getObjectByName(MODEL.HEAD)
    bones.leftEyeBone = model.getObjectByName(MODEL.LEFT.EYE)
    bones.rightEyeBone = model.getObjectByName(MODEL.RIGHT.EYE)
    bones.pelvis = model.getObjectByName("ValveBipedBip01_Pelvis_01");
    bones.leftThigh = model.getObjectByName("ValveBipedBip01_L_Thigh_02");
    bones.leftCalf = model.getObjectByName("ValveBipedBip01_L_Calf_03");
    bones.leftToe = model.getObjectByName("ValveBipedBip01_L_Toe0_05");
    bones.rightThigh = model.getObjectByName("ValveBipedBip01_R_Thigh_064");
    bones.rightCalf = model.getObjectByName("ValveBipedBip01_R_Calf_065");
    bones.rightToe = model.getObjectByName("ValveBipedBip01_R_Toe0_067");

    bones.leftUpperArm = model.getObjectByName("ValveBipedBip01_L_UpperArm_010");
    bones.leftForearm = model.getObjectByName("ValveBipedBip01_L_Forearm_011");
    bones.leftHand = model.getObjectByName("ValveBipedBip01_L_Hand_012");
    bones.rightUpperArm = model.getObjectByName("ValveBipedBip01_R_UpperArm_041");
    bones.rightForearm = model.getObjectByName("ValveBipedBip01_R_Forearm_042");
    bones.rightHand = model.getObjectByName("ValveBipedBip01_R_Hand_043");

    bones.leftUpperArm.initialRotation = bones.leftUpperArm.rotation.x;
    bones.leftForearm.initialRotation = bones.leftForearm.rotation.x;
    bones.leftHand.initialRotation = bones.leftHand.rotation.x;
    bones.rightUpperArm.initialRotation = bones.rightUpperArm.rotation.x;
    bones.rightForearm.initialRotation = bones.rightForearm.rotation.x;
    bones.rightHand.initialRotation = bones.rightHand.rotation.x;

    bones.leftThigh.initialRotation = bones.leftThigh.rotation.x;
    bones.leftCalf.initialRotation = bones.leftCalf.rotation.x;
    bones.leftToe.initialRotation = bones.leftToe.rotation.x;
    bones.rightThigh.initialRotation = bones.rightThigh.rotation.x;
    bones.rightCalf.initialRotation = bones.rightCalf.rotation.x;
    bones.rightToe.initialRotation = bones.rightToe.rotation.x;
    return bones;
}