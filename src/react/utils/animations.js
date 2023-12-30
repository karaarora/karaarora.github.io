
import gsap from "gsap";

export function turnRight(model) {
    model.isWalking = -1
    gsap.to(model.position, {
        x: -0.7,
        duration: 1,
        ease: "power2.inOut"
    })
    gsap.timeline()
    .add(gsap.to(model.rotation, {
        y: -Math.random() * Math.PI/2,
        duration: 1,
        ease: "power2.inOut"
    })).add( gsap.to(model.rotation, {
        y: Math.PI/2,
        duration: 1,
        ease: "power2.inOut"
    }))
    setTimeout(() => {
        model.isWalking = 0
    }, 2000)
}

export function walkAndFaceUp(model) {
    model.isWalking = 1
    gsap.to(model.rotation, {
        y: 0,
        duration: 1,
        ease: "power1.inOut"
    })
    setTimeout(() => {
        model.isWalking = 0
    }, 1000)
}