import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';

const Whiteboard: React.FC = () => {
  const [lines, setLines] = useState<Array<any>>([]);
  const isDrawing = useRef(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8081');

    ws.current.onmessage = (message: any) => {
      const line = JSON.parse(message.data);
      setLines((prevLines) => [...prevLines, line]);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleMouseDown = () => {
    isDrawing.current = true;
    setLines([...lines, { points: [] }]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());

    if (ws.current) {
      ws.current.send(JSON.stringify(lastLine));
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMousemove={handleMouseMove}
      onMouseup={handleMouseUp}
    >
      <Layer>
        {lines.map((line, i) => (
          <Line
            key={i}
            points={line.points}
            stroke="#df4b26"
            strokeWidth={5}
            tension={0.5}
            lineCap="round"
            globalCompositeOperation="source-over"
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default Whiteboard;
