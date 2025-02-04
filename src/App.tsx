// import { useState } from "react";
import background from "/background.svg";
import "./App.css";

import * as motion from "motion/react-client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";

function Slot({ names }: { names: string[] }) {
  const REPEAT_COUNT = 4; // How many times we repeat the list to allow for a longer "spin"

  let i = 0
  let ii = localStorage.getItem("itemHeight")
  if (ii) {
    i = parseInt(ii)
  }

  const [itemHeight, setItemHeight] = useState(i);
  const itemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (itemRef.current) {
      // Measure the rendered pixel height:
      setItemHeight(itemRef.current.offsetHeight);
      localStorage.setItem("itemHeight",itemRef.current.offsetHeight.toString())
    }
  }, []);

  // Repeated list for spinning effect
  const repeatedNames = Array(REPEAT_COUNT).fill(names).flat();

  // State to store the random "target" index for the spin
  let last = 0
  let l = localStorage.getItem("last")
  if (l) {
    last = parseInt(l)
  }
  const [lastIndex, setLastIndex] = useState(last);
  const [targetIndex, setTargetIndex] = useState(last);
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
    
    setLastIndex(targetIndex);
    setTargetIndex(chosenIndex);
    localStorage.setItem("last",chosenIndex.toString())
  };

  // The final y offset: we move the reel up so that the target name is in the "visible" slot
  const initialY = -(lastIndex * itemHeight);
  const finalY = -(targetIndex * itemHeight);

  console.log(initialY, finalY)

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
      className="mask-of-winner"
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
          initial={{ y: initialY }}
          transition={{
            duration: names.length/50,    // total spin duration
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
        style={{ marginTop: 0 }}
      >
        <p style={{ marginTop: 0, }}>抽奖</p>
      </button>
    </div>
  );
}

function App() {
  // [
  //   "jonnyjonny",
  //   "Gege",
  //   "万里",
  //   "有鸽",
  //   "无鸽",
  // ]
  // let a = [
  //   "jonnyjonny",
  //   "Gege",
  //   "万里",
  //   "有鸽",
  //   "无鸽",
  // ]
  let a = new Array(300);
  a.fill(Math.random()*10000,0,300)
  const [names, setNames] = useState(a);
  const stageTitles = [
    '三等奖',
    '二等奖',
    '一等奖',
  ];
  const [stageIndex, setStageIndex] = useState(0);

  const [showEditor, setShowEditor] = useState(false); // controls editor visibility
  const [nameListInput, setNameListInput] = useState(''); // text area content

  return (
    <main style={{ backgroundImage: `url(${background})` }}>
       <h1 style={{ position: "fixed", fontSize: "5vw", top: "10vw" }}>新春嘉年华</h1>
      <button
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
        }}
        onClick={() => setShowEditor(true)}
      >
        输入名单
      </button>

      {/* 抽奖名单editor */}
      {showEditor && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
          }}
        >
          <div style={{ background: '#fff', padding: '20px', width: '80%', maxWidth: '600px' }}>
            请输入抽奖名单 (one per line 或者 comma-separated):
            <textarea
              style={{ width: '100%', height: '200px' }}
              value={nameListInput}
              onChange={(e) => setNameListInput(e.target.value)}
            />
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowEditor(false)}>Cancel</button>
              <button
                onClick={() => {
                  // Split on newlines or commas, filter out empty
                  const newNames = nameListInput
                    .split(/[\n,]+/)
                    .map((n) => n.trim())
                    .filter(Boolean);

                  if (newNames.length > 0) {
                    setNames(newNames);
                  }
                  setShowEditor(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 调整抽奖键 */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 0,
          display: 'flex',
          gap: '5px',
        }}
      >
        <button
          onClick={() =>
            setStageIndex((prev) => (prev - 1 + stageTitles.length) % stageTitles.length)
          }
        >
          &larr;
        </button>
        <span>调整抽奖</span>
        <button onClick={() =>
          setStageIndex((prev) => (prev + 1) % stageTitles.length)
        }
        >
          &rarr;
        </button>
      </div>

      {/* Main content */}
      <h1 style={{ position: "fixed", fontSize: "5vw", top: "10vw" }}>新春嘉年华</h1>
      
      <AnimatePresence mode="wait">
        <motion.h3
          style={{ position: "fixed", top: "16vw", fontSize: "4vw" }}
          key={stageIndex}
          initial={{ x: '100%', opacity: 0 }}    // start off right side
          animate={{ x: 0, opacity: 1 }}      // slide to center
          exit={{ x: '-100%', opacity: 0 }}      // exit to left side
          transition={{ duration: 1 }}      // tweak duration for speed
        >
          {stageTitles[stageIndex]}
        </motion.h3>
      </AnimatePresence>

      <Slot names={names} />
    </main>
  );
}

export default App;