import React from "react";

interface Props {
  color?: string;
  speed?: string;
  size?: string;
}
const Loader = ({ color, speed, size } : Props) => {
  const dotStyle = {
    '--uib-size': size || '60px',
    '--uib-color': color || 'black',
    '--uib-speed': speed || '2.5s',
    '--uib-dot-size': `calc(${size || '60px'} * 0.18)`,
  };

  return (
    <div className="container" style={dotStyle as any}>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  );
};



export default Loader;
