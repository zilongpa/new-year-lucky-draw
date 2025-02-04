import { createContext, useState, useEffect, Dispatch, SetStateAction } from 'react';

// 定义 Context 类型
interface DrawContextType {
    title: string;
    subtitle: string;
    participants: string[];
    spinning: boolean;
    currentIndex: number;
    setTitle: Dispatch<SetStateAction<string>>;
    setSubtitle: Dispatch<SetStateAction<string>>;
    setParticipants: Dispatch<SetStateAction<string[]>>;
    setSpinning: Dispatch<SetStateAction<boolean>>;
    setCurrentIndex: Dispatch<SetStateAction<number>>;
}

function getStoredValue(arg0: string, arg1: string): string {
    let item = localStorage.getItem(arg0)
    if (item){
      return item
    }
    return arg1
}

function getStoredValues(arg0: string, arg1: any): any {
  let item = localStorage.getItem(arg0)
  if (item){
    return JSON.parse(item)
  }
  return arg1
}

// 先提供默认值（setters 需要匹配正确的函数签名）
export const DrawContext = createContext<DrawContextType>({
    title: "新春嘉年华",
    subtitle: "三等奖",
    participants: ["原神", "崩坏星穹铁道", "绝区零"],
    spinning: false,
    currentIndex: 0,
    setTitle: () => { },
    setSubtitle: () => { },
    setParticipants: () => { },
    setSpinning: () => { },
    setCurrentIndex: () => { },
});

export const DrawProvider = ({ children }: { children: any }) => {
    const [title, setTitle] = useState(() => getStoredValue("title", "新春嘉年华"));
    const [subtitle, setSubtitle] = useState(() => getStoredValue("subtitle", "三等奖"));
    const [participants, setParticipants] = useState(() => getStoredValues("participants", ["原神", "崩坏星穹铁道", "绝区零"]));
    const [spinning, setSpinning] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(() => Number(getStoredValue("currentIndex", "0")));

    // 同步状态到 localStorage
    useEffect(() => {
        localStorage.setItem("title", title);
    }, [title]);

    useEffect(() => {
        localStorage.setItem("subtitle", subtitle);
    }, [subtitle]);

    useEffect(() => {
        localStorage.setItem("participants", JSON.stringify(participants));
    }, [participants]);

    useEffect(() => {
      localStorage.setItem("currentIndex", String(currentIndex));
  }, [currentIndex]);

    return (
        <DrawContext.Provider value={{
            title, setTitle,
            subtitle, setSubtitle,
            participants, setParticipants,
            spinning, setSpinning,
            currentIndex, setCurrentIndex,
        }}>
            {children}
        </DrawContext.Provider>
    );
};

