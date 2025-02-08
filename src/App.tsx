// import { useState } from "react";
import background from "/background.svg";
import "./App.css";

import * as motion from "motion/react-client";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import { DrawContext } from "./drawContext";
import Header from "./components/header";

function Slot({ names }: { names: string[] }) {
  const {
    title,
    setTitle,
    subtitle,
    setSubtitle,
    participants,
    setParticipants,
    spinning,
    setSpinning,
    currentIndex,
    setCurrentIndex,
    itemHeight,
    setItemHeight,
  } = useContext(DrawContext);

  // Ref to keep track of the spin count to force a re-animation
  const spinCountRef = useRef(0);

  // The final y offset: we move the reel up so that the target name is in the "visible" slot
  // if (currentIndex >= participants.length) {
  //   setCurrentIndex(participants.length - 1)
  // }

  

  let animationParticipants = participants;
  let animationCurrentIndex = currentIndex;
  

  if (participants.length < 999) {
    for (let i = 0; i <= Math.round(999 / participants.length); i++) {
      animationParticipants = animationParticipants.concat(participants);
      animationCurrentIndex += participants.length;
    }
  }

  const initialY = -(
    useMemo<number>(() => {
      return animationCurrentIndex;
    }, []) * itemHeight
  );
  const finalY = -(animationCurrentIndex * itemHeight);

  console.log(animationParticipants.length, animationCurrentIndex);

  return (
    <div
      className="mask-of-winner"
      style={{
        overflow: "hidden",
        width: "25vw",
        // height: "5vw",
        margin: "0 auto",
        position: "absolute",
        height: `${itemHeight}px`,
        top: "57%",
      }}
    >
      <motion.div
        key={spinCountRef.current} // Changing key forces the animation to re-trigger
        animate={{ y: [spinning ? 0 : initialY, finalY] }}
        initial={{ y: initialY }}
        // style={{ position: 'absolute' }}
        transition={{
          duration: 4, // total spin duration
          bounce: 0.05,
          type: "spring", //stiffness: 349, damping: 56, mass: 4.9
        }}
      >
        {animationParticipants.map((name, idx) => (
          <div
            key={`${name}-${idx}`}
            style={{
              // height: "5vw",
              height: itemHeight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: "5vw",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                fontSize: "4vw",
              }}
            >
              {name}
            </h2>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function App() {
  const {
    title,
    setTitle,
    subtitle,
    setSubtitle,
    participants,
    setParticipants,
    spinning,
    setSpinning,
    currentIndex,
    setCurrentIndex,
    itemHeight,
    setItemHeight,
  } = useContext(DrawContext);

  const itemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateItemHeight = () => {
      if (itemRef.current) {
        if (itemRef.current.offsetHeight !== itemHeight) {
          setItemHeight(itemRef.current.offsetHeight);
        }
      }
    };

    updateItemHeight(); // Initial call to set the height

    window.addEventListener("resize", updateItemHeight); // Add event listener for resize

    return () => {
      window.removeEventListener("resize", updateItemHeight); // Cleanup event listener on unmount
    };
  }, [itemRef.current]);

  return (
    <>
      <div
        style={{
          visibility: "hidden",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          position: "fixed",
        }}
      >
        <h2
          ref={itemRef}
          style={{
            textAlign: "center",
            fontSize: "4vw",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          Reference 参考
        </h2>
      </div>
      <main style={{ backgroundImage: `url(${background})` }}>
        <h1 style={{ position: "absolute", fontSize: "4.5vw", top: "22%" }}>
          {title}
        </h1>

        <AnimatePresence mode="wait">
          <motion.h3
            style={{ position: "absolute", top: "35%", fontSize: "4vw" }}
            initial={{ x: "100%", opacity: 0 }} // start off right side
            animate={{ x: 0, opacity: 1 }} // slide to center
            exit={{ x: "-100%", opacity: 0 }} // exit to left side
            transition={{ duration: 1 }} // tweak duration for speed
          >
            {subtitle}
          </motion.h3>
        </AnimatePresence>

        <Slot names={participants} />
      </main>
      <Header></Header>
    </>
  );
}

export default App;
