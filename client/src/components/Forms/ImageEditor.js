import React, { useRef, useState } from "react";

const ImageEditor = ({ imageUrl, onCoordinatesChange }) => {
    const [coordinates, setCoordinates] = useState([]);
    const canvasRef = useRef();

    const handleCanvasClick = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newCoordinates = [...coordinates, { x, y }];
        setCoordinates(newCoordinates);
        onCoordinatesChange(newCoordinates);
    };

    const clearCanvas = () => {
        setCoordinates([]);
        onCoordinatesChange([]);
    };

    return (
        <div>
            <h4>Mark Points on the Image</h4>
            <div style={{ position: "relative" }}>
                <img
                    src={imageUrl}
                    alt="To be analyzed"
                    style={{ maxWidth: "100%", maxHeight: "500px" }}
                    onClick={handleCanvasClick}
                />
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                    }}
                />
            </div>
            <button onClick={clearCanvas}>Clear Points</button>
            <p>Selected Coordinates: {JSON.stringify(coordinates)}</p>
        </div>
    );
};

export default ImageEditor;
