import React, { useState, useEffect } from 'react';

const ClockComponent = () => {
    const [backgroundColor, setBackgroundColor] = useState(getRandomColor());
    const [textColor, setTextColor] = useState(getRandomColor());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setBackgroundColor(getRandomColor());
            setTextColor(getRandomColor());
        }, 10000);

        return () => clearInterval(intervalId);
    }, []);

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    const clockStyle = {
        backgroundColor: backgroundColor,
        color: textColor,
        padding: '10px',
        borderRadius: '5px',
        display: 'inline-block'
    };

    return (
        <div style={clockStyle}>
            {new Date().toLocaleTimeString()}
        </div>
    );
};

export default ClockComponent;
