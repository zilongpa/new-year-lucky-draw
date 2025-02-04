import { useContext, useState } from "react";
import { DrawContext } from "../drawContext";

export default function Header() {
  const [stageIndex, setStageIndex] = useState(0);

  const [showEditor, setShowEditor] = useState(false); // controls editor visibility
  const [nameListInput, setNameListInput] = useState(''); // text area content\

  const { title, setTitle,
    subtitle, setSubtitle,
    participants, setParticipants,
    spinning, setSpinning,
    currentIndex, setCurrentIndex } = useContext(DrawContext)

  return (
    <div>
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
            <label>活动名称<br /><input defaultValue={title} placeholder="新春嘉年华" onChange={(event) => {
              setTitle(event.target.value)
            }}></input></label>
            <br />
            <label>奖项<br /><input defaultValue={subtitle} placeholder="三等奖" onChange={(event) => {
              setSubtitle(event.target.value)
            }}></input></label>
            <br />

            请输入抽奖名单 (一行一个):
            <textarea
              style={{ width: '100%', height: '200px' }}
              defaultValue={participants.join("\n")}
              onChange={(event) => {
                let arr = event.target.value.split("\n")
                  .map((n) => n.trim())
                  .filter(Boolean);
                if (arr.length > 0) {
                  setParticipants(arr)
                }
              }}
            />
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowEditor(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

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
          onClick={() => {
            setSpinning(true);

            // Choose a random name from the array
            const randomNameIndex = Math.floor(Math.random() * participants.length);

            // We want the reel to land on the random name somewhere in the *middle* of the repeated list
            // so that we have enough items above to simulate spinning. 
            // For simplicity, pick an offset somewhere in the second repetition:
            const startOfSecondRepetition = participants.length; // index offset for second repetition start
            const chosenIndex = startOfSecondRepetition + randomNameIndex;
            setCurrentIndex(chosenIndex)
          }}
          style={{ marginTop: 0 }}
        >
          <p style={{ marginTop: 0, }}>抽奖</p>
        </button>
      </div>
    </div>
  )
}