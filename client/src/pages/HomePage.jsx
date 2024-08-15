import React, { useState, useCallback, useRef, useEffect } from "react";
import { useTransition, animated, useSpringRef } from "@react-spring/web";

export function HomePage() {
  const ref = useRef([]);
  const [items, set] = useState([]);

  const transitions = useTransition(items, {
    from: {
      opacity: 0,
      height: 0,
      innerHeight: 0,
      transform: "perspective(600px) rotateX(0deg)",
      color: "#8fa5b6",
    },
    enter: [
      { opacity: 1, height: 80, innerHeight: 80 },
      { transform: "perspective(600px) rotateX(0deg)" },
    ],
    leave: [
      { color: "#c23369" },
      { innerHeight: 0 },
      { opacity: 0, height: 0 },
    ],
    update: { color: "#28b4d7" },
  });

  const reset = useCallback(() => {
    ref.current.forEach(clearTimeout);
    ref.current = [];
    set([]);
    ref.current.push(
      setTimeout(
        () => set(["Are You", "Spending Too", "Much Of", "Your Dhan ? ? ? "]),
        2000
      )
    );
    ref.current.push(
      setTimeout(() => set(["Then Track Your Dhan", "Using"]), 5000)
    );
    ref.current.push(setTimeout(() => set(["Spent-Dhan"]), 8000));
  }, []);

  useEffect(() => {
    reset();
    return () => ref.current.forEach(clearTimeout);
  }, [reset]);

  return (
    <div className="flex items-center justify-center bg-green-200 h-[60vh]">
      <div className="min-w-[100px] p-5 mx-auto h-full">
        {transitions(({ innerHeight, ...rest }, item) => (
          <animated.div
            className="overflow-hidden w-full text-white flex justify-start items-center text-4xl font-extrabold uppercase will-change-transform-opacity-height whitespace-nowrap cursor-pointer leading-[80px]"
            style={rest}
            onClick={reset}
          >
            <animated.div style={{ overflow: "hidden", height: innerHeight }}>
              {item}
            </animated.div>
          </animated.div>
        ))}
      </div>
    </div>
  );
}

// Second Component: Card
export function Card() {
  const [index, set] = useState(0);
  const onClick = () => set((state) => (state + 1) % 3);
  const transRef = useSpringRef();
  const transitions = useTransition(index, {
    ref: transRef,
    keys: null,
    from: { opacity: 0, transform: "translate3d(100%,0,0)" },
    enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
    leave: { opacity: 0, transform: "translate3d(-50%,0,0)" },
  });

  useEffect(() => {
    transRef.start();
  }, [index]);

  const pages = [
    ({ style }) => (
      <animated.div
        style={style}
        className="absolute w-full h-full flex justify-center items-center text-black font-bold text-[2em] will-change-transform-opacity text-shadow"
      >
        Spent-Dhan is designed with simplicity in mind, making it easy for users
        of all tech levels to manage their expenses.
      </animated.div>
    ),
    ({ style }) => (
      <animated.div
        style={style}
        className="absolute w-full h-full flex justify-center items-center text-black font-bold text-[2em] will-change-transform-opacity text-shadow"
      >
        With Spent-Dhan, users can create and track personalized budgets based
        on their individual financial goals.
      </animated.div>
    ),
    ({ style }) => (
      <animated.div
        style={style}
        className="absolute w-full h-full flex justify-center items-center text-black font-bold text-[2em] will-change-transform-opacity text-shadow"
      >
        Users can track their expenses in real-time and receive timely alerts
        for overspending, upcoming bills, or unusual transactions.
      </animated.div>
    ),
  ];

  return (
    <div
      className="relative flex fill h-[300px] w-full mx-auto border-4 border-white"
      onClick={onClick}
      style={{ backgroundColor: "#EFEBCE" }} // Apply the default background color
    >
      {transitions((style, i) => {
        const Page = pages[i];
        return <Page style={style} />;
      })}
    </div>
  );
}

// Main Component: Combined HomePage and Card
export default function CombinedComponent() {
  return (
    <div className="h-screen">
      <HomePage />
      <Card />
    </div>
  );
}
