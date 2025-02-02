// import { useState } from "react";
import background from "/background.svg";
import "./App.css";

import * as motion from "motion/react-client";
import { useEffect, useRef, useState } from "react";

function Slot({ names }: { names: string[] }) {
  const REPEAT_COUNT = 4; // How many times we repeat the list to allow for a longer "spin"

  const [itemHeight, setItemHeight] = useState(0);
  const itemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (itemRef.current) {
      // Measure the rendered pixel height:
      setItemHeight(itemRef.current.offsetHeight);
      console.log(itemHeight);
    }
  }, []);

  // Repeated list for spinning effect
  const repeatedNames = Array(REPEAT_COUNT).fill(names).flat();

  // State to store the random "target" index for the spin
  const [targetIndex, setTargetIndex] = useState(0);
  // State to trigger re-renders for the spin
  const [spinning, setSpinning] = useState(false);

  // Ref to keep track of the spin count to force a re-animation
  const spinCountRef = useRef(0);

  // A function to handle the spin logic
  const handleSpin = () => {
    setSpinning(true);

    // Increase spin count to force a re-run of the animation with a key
    spinCountRef.current += 1;

    // Choose a random name from the array
    const randomNameIndex = Math.floor(Math.random() * names.length);

    // We want the reel to land on the random name somewhere in the *middle* of the repeated list
    // so that we have enough items above to simulate spinning. 
    // For simplicity, pick an offset somewhere in the second repetition:
    const startOfSecondRepetition = names.length; // index offset for second repetition start
    const chosenIndex = startOfSecondRepetition + randomNameIndex;

    setTargetIndex(chosenIndex);
  };

  // The final y offset: we move the reel up so that the target name is in the "visible" slot
  const finalY = -(targetIndex * itemHeight);

  return (
    <div style={{ textAlign: 'center', top: "2vw" }}>
      {/* This div is used only to measure the height of one line */}
      <div 
        ref={itemRef} 
        style={{ visibility: "hidden", pointerEvents: "none", whiteSpace: "nowrap" }}
      >
        <h2>{names[0]}</h2>
      </div>

      <div
        style={{
          overflow: 'hidden',
          width: '300px',
          height: `${itemHeight}px`,
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <motion.div
          key={spinCountRef.current} // Changing key forces the animation to re-trigger
          animate={{ y: finalY }}
          initial={{ y: 0 }}
          transition={{
            duration: 2,    // total spin duration
            ease: 'easeInOut',
          }}
          onAnimationComplete={() => setSpinning(false)}
        >
          {repeatedNames.map((name, idx) => (
            <div
              key={`${name}-${idx}`}
              style={{
                height: itemHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: '3.5rem',
              }}
            >
              <h2>{name}</h2>
            </div>
          ))}
        </motion.div>
      </div>

      <button
        onClick={handleSpin}
        disabled={spinning}
        style={{ 
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          marginTop: 0,
        }}
      >
        <h3 style={{marginTop: 0,}}>抽奖！</h3>
      </button>
    </div>
  );
}

function App() {
  const names = [
    "jonnyjonny",
    "Gege",
    "万里",
    "有鸽",
    "无鸽",
  ];

  return (
    <main style={{ backgroundImage: `url(${background})` }}>
      <h1 style={{ position: "fixed", fontSize: "5vw", top: "14vw"}}>新春嘉年华</h1>
      <h2 style={{ position: "fixed", fontSize: "5vw", top: "19vw" }}>二等奖</h2>

      <Slot names={names} />
    </main>
  );
}

export default App;