import React from 'react';

const SvgFilters: React.FC = () => {
    return (
        <svg
            style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <filter id="glitch-vibe" x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.05 0.002" numOctaves="2" result="noise" seed="0">
                        <animate attributeName="seed" from="0" to="100" dur="2s" repeatCount="indefinite" />
                    </feTurbulence>
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G">
                        <animate attributeName="scale" values="0;0;0;3;0;0;5;0;0;2;0;10;0" dur="2s" repeatCount="indefinite" />
                    </feDisplacementMap>
                </filter>

                <filter id="rgb-split" x="-20%" y="-20%" width="140%" height="140%">
                    <feOffset in="SourceGraphic" dx="2" dy="0" result="red" />
                    <feOffset in="SourceGraphic" dx="-2" dy="0" result="blue" />
                    <feBlend mode="screen" in="red" in2="SourceGraphic" result="blend1" />
                    <feBlend mode="screen" in="blue" in2="blend1" result="blend2" />
                </filter>
            </defs>
        </svg>
    );
};

export default SvgFilters;
