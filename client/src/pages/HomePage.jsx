import { useState, useCallback, useRef, useEffect } from "react";
import { useTransition, animated, useSpringRef, useSpring } from "@react-spring/web";

// Improved Navbar Component
export function Navbar() {
  const [activeItem, setActiveItem] = useState("Home");
  
  const navItems = [
    { id: "home", label: "Home" },
    { id: "features", label: "Features" },
    { id: "pricing", label: "Pricing" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" }
  ];

  return (
    <nav className="w-full bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-indigo-600">
              Spent-Dhan
            </div>
          </div>
          
          {/* Centered Navigation Items */}
          <div className="hidden md:flex justify-center flex-1">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl shadow-inner">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    activeItem === item.id
                      ? "bg-white text-indigo-600 shadow-md"
                      : "text-gray-600 hover:text-indigo-500 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Auth Buttons */}
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              Log in
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
              Sign up
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation (simplified) */}
        <div className="flex md:hidden justify-center mt-4">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-full overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all duration-300 ${
                  activeItem === item.id
                    ? "bg-white text-indigo-600 shadow-md"
                    : "text-gray-600 hover:text-indigo-500 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export function HomePage() {
  const ref = useRef([]);
  const [items, set] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  // Enhanced animations with more fluid transitions
  const transitions = useTransition(items, {
    from: {
      opacity: 0,
      height: 0,
      innerHeight: 0,
      transform: "perspective(1000px) rotateX(90deg) scale(0.8)",
      color: "#2c3e50",
    },
    enter: [
      { opacity: 1, height: 90, innerHeight: 90 },
      { transform: "perspective(1000px) rotateX(0deg) scale(1)" },
    ],
    leave: [
      { color: "#e74c3c" },
      { transform: "perspective(1000px) rotateX(-90deg) scale(0.8)" },
      { opacity: 0, height: 0, innerHeight: 0 },
    ],
    update: { color: "#3498db" },
    config: { tension: 280, friction: 24 },
  });

  // Hover animation for the container
  const hoverAnim = useSpring({
    scale: isHovered ? 1.02 : 1,
    config: { mass: 1, tension: 280, friction: 20 }
  });

  const reset = useCallback(() => {
    ref.current.forEach(clearTimeout);
    ref.current = [];
    set([]);
    ref.current.push(
      setTimeout(
        () => set(["Are You Spending", "Too Much Money", "Without Realizing It?"]),
        1500
      )
    );
    ref.current.push(
      setTimeout(() => set(["Track Your Expenses", "With Precision", "And Awareness"]), 5000)
    );
    ref.current.push(
      setTimeout(() => set(["Welcome to", "Spent-Dhan", "Your Financial Companion"]), 8500)
    );
  }, []);

  useEffect(() => {
    reset();
    return () => ref.current.forEach(clearTimeout);
  }, [reset]);

  return (
    <animated.div 
      className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 h-[60vh]"
      style={hoverAnim}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="min-w-[100px] p-5 mx-auto h-full flex flex-col justify-center">
        {transitions(({ innerHeight, ...rest }, item) => (
          <animated.div
            className="overflow-hidden w-full text-gray-800 flex justify-center items-center text-5xl font-bold uppercase will-change-transform-opacity-height whitespace-nowrap cursor-pointer leading-[90px] tracking-wide"
            style={rest}
            onClick={reset}
          >
            <animated.div 
              style={{ overflow: "hidden", height: innerHeight }}
              className="drop-shadow-md"
            >
              {item}
            </animated.div>
          </animated.div>
        ))}
        <p className="text-center mt-8 text-lg text-gray-600 font-medium">
          Click anywhere to restart animation
        </p>
      </div>
    </animated.div>
  );
}

// Enhanced Card Component
export function Card() {
  const [index, set] = useState(0);
  const [direction, setDirection] = useState(1);
  const onClick = () => {
    setDirection(1);
    set((state) => (state + 1) % 3);
  };
  
  const onPrev = (e) => {
    e.stopPropagation();
    setDirection(-1);
    set((state) => (state - 1 + 3) % 3);
  };
  
  const onNext = (e) => {
    e.stopPropagation();
    setDirection(1);
    set((state) => (state + 1) % 3);
  };

  const transRef = useSpringRef();
  const transitions = useTransition(index, {
    ref: transRef,
    keys: null,
    from: { 
      opacity: 0, 
      transform: direction > 0 ? "translate3d(100%,0,0)" : "translate3d(-100%,0,0)" 
    },
    enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
    leave: { 
      opacity: 0, 
      transform: direction > 0 ? "translate3d(-50%,0,0)" : "translate3d(50%,0,0)" 
    },
    config: { mass: 1, tension: 280, friction: 30 },
  });

  useEffect(() => {
    transRef.start();
  }, [index, transRef]);

  // Auto-advance cards
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      set((state) => (state + 1) % 3);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const pages = [
    ({ style }) => (
      <animated.div
        style={style}
        className="absolute w-full h-full flex flex-col justify-center items-center p-8 text-gray-800"
      >
        <div className="text-4xl font-bold mb-6 text-indigo-600">Easy Expense Tracking</div>
        <div className="text-xl text-center max-w-2xl">
          Spent-Dhan simplifies financial management with an intuitive interface that makes tracking expenses effortless for everyone.
        </div>
      </animated.div>
    ),
    ({ style }) => (
      <animated.div
        style={style}
        className="absolute w-full h-full flex flex-col justify-center items-center p-8 text-gray-800"
      >
        <div className="text-4xl font-bold mb-6 text-indigo-600">Smart Budget Planning</div>
        <div className="text-xl text-center max-w-2xl">
          Create personalized budgets based on your financial goals and get intelligent suggestions to optimize your spending.
        </div>
      </animated.div>
    ),
    ({ style }) => (
      <animated.div
        style={style}
        className="absolute w-full h-full flex flex-col justify-center items-center p-8 text-gray-800"
      >
        <div className="text-4xl font-bold mb-6 text-indigo-600">Real-time Insights</div>
        <div className="text-xl text-center max-w-2xl">
          Get instant notifications about unusual spending patterns, upcoming bills, and opportunities to save more money.
        </div>
      </animated.div>
    ),
  ];

  return (
    <div className="relative flex h-[400px] w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-white">
      <div 
        className="relative w-full h-full"
        onClick={onClick}
      >
        {transitions((style, i) => {
          const Page = pages[i];
          return <Page style={style} />;
        })}
        
        {/* Navigation buttons */}
        <button 
          onClick={onPrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition-colors z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={onNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition-colors z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Indicator dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {[0, 1, 2].map(i => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setDirection(i > index ? 1 : -1);
                set(i);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${i === index ? 'bg-indigo-600 scale-125' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Main Component: Combined Navbar, HomePage and Card
export default function CombinedComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white">
      <Navbar />
      <HomePage />
      <div className="flex justify-center mt-16 px-4">
        <Card />
      </div>
      <div className="text-center mt-12 mb-16">
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
          Get Started Today
        </button>
      </div>
    </div>
  );
}