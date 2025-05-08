import React, { useEffect, useRef } from 'react';
import { Bus as BusType } from '../../data/buses';
import { BusRoute } from '../../data/busRoutes';

interface BusMapProps {
  bus: BusType;
  route: BusRoute;
}

const BusMap: React.FC<BusMapProps> = ({ bus, route }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // This is a simplified map simulation for demo purposes
  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    const drawMap = () => {
      const container = mapContainerRef.current;
      if (!container) return;
      
      // Set container dimensions
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      // Clear previous content
      container.innerHTML = '';
      
      // Create SVG map
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      
      // Draw a simple road
      const roadPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      roadPath.setAttribute('d', `M 50,${height - 50} C 100,${height - 150} ${width - 150},150 ${width - 50},50`);
      roadPath.setAttribute('stroke', '#ccc');
      roadPath.setAttribute('stroke-width', '20');
      roadPath.setAttribute('fill', 'none');
      svg.appendChild(roadPath);
      
      // Add start and end points
      // Start point (bottom left)
      const startPoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      startPoint.setAttribute('cx', '50');
      startPoint.setAttribute('cy', `${height - 50}`);
      startPoint.setAttribute('r', '8');
      startPoint.setAttribute('fill', '#4CAF50');
      svg.appendChild(startPoint);
      
      // Start label
      const startLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      startLabel.setAttribute('x', '65');
      startLabel.setAttribute('y', `${height - 50}`);
      startLabel.setAttribute('fill', '#333');
      startLabel.setAttribute('font-size', '12');
      startLabel.setAttribute('alignment-baseline', 'middle');
      startLabel.textContent = route.from;
      svg.appendChild(startLabel);
      
      // End point (top right)
      const endPoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      endPoint.setAttribute('cx', `${width - 50}`);
      endPoint.setAttribute('cy', '50');
      endPoint.setAttribute('r', '8');
      endPoint.setAttribute('fill', '#F44336');
      svg.appendChild(endPoint);
      
      // End label
      const endLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      endLabel.setAttribute('x', `${width - 65}`);
      endLabel.setAttribute('y', '50');
      endLabel.setAttribute('fill', '#333');
      endLabel.setAttribute('font-size', '12');
      endLabel.setAttribute('text-anchor', 'end');
      endLabel.setAttribute('alignment-baseline', 'middle');
      endLabel.textContent = route.to;
      svg.appendChild(endLabel);
      
      // Bus position (somewhere along the path based on the current time)
      // This is a simplified calculation for demo purposes
      const now = new Date();
      const [departHours, departMinutes] = route.departureTime.split(':').map(Number);
      const [arrivalHours, arrivalMinutes] = route.arrivalTime.split(':').map(Number);
      
      const departTime = departHours * 60 + departMinutes;
      const arrivalTime = arrivalHours * 60 + arrivalMinutes;
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      // Calculate progress (0 to 1) based on time
      let progress = 0;
      if (currentTime >= departTime && currentTime <= arrivalTime) {
        progress = (currentTime - departTime) / (arrivalTime - departTime);
      } else if (currentTime > arrivalTime) {
        progress = 1;
      }
      
      // Get point at progress along the path
      const busPosition = calculatePointOnCurve(
        50, height - 50,
        100, height - 150,
        width - 150, 150,
        width - 50, 50,
        progress
      );
      
      // Bus icon
      const busIcon = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      busIcon.setAttribute('cx', `${busPosition.x}`);
      busIcon.setAttribute('cy', `${busPosition.y}`);
      busIcon.setAttribute('r', '10');
      busIcon.setAttribute('fill', bus.status === 'delayed' ? '#FF9800' : '#1976D2');
      svg.appendChild(busIcon);
      
      // Bus icon inner
      const busIconInner = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      busIconInner.setAttribute('x', `${busPosition.x}`);
      busIconInner.setAttribute('y', `${busPosition.y + 4}`);
      busIconInner.setAttribute('fill', 'white');
      busIconInner.setAttribute('font-size', '10');
      busIconInner.setAttribute('text-anchor', 'middle');
      busIconInner.setAttribute('alignment-baseline', 'middle');
      busIconInner.textContent = '🚌';
      svg.appendChild(busIconInner);
      
      // Progress indicator
      const progressIndicator = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      progressIndicator.setAttribute('x', `${width / 2}`);
      progressIndicator.setAttribute('y', `${height - 20}`);
      progressIndicator.setAttribute('fill', '#666');
      progressIndicator.setAttribute('font-size', '14');
      progressIndicator.setAttribute('text-anchor', 'middle');
      
      if (bus.status === 'delayed') {
        progressIndicator.textContent = 'Bus is delayed';
        progressIndicator.setAttribute('fill', '#FF9800');
      } else if (progress === 0) {
        progressIndicator.textContent = 'Bus departing soon';
      } else if (progress === 1) {
        progressIndicator.textContent = 'Bus has arrived';
      } else {
        progressIndicator.textContent = `${Math.round(progress * 100)}% of journey complete`;
      }
      
      svg.appendChild(progressIndicator);
      
      // Add SVG to container
      container.appendChild(svg);
    };
    
    // Calculate point on a cubic Bezier curve
    const calculatePointOnCurve = (
      x1: number, y1: number,
      cp1x: number, cp1y: number,
      cp2x: number, cp2y: number,
      x2: number, y2: number,
      t: number
    ) => {
      const term1 = Math.pow(1 - t, 3) * x1;
      const term2 = 3 * Math.pow(1 - t, 2) * t * cp1x;
      const term3 = 3 * (1 - t) * Math.pow(t, 2) * cp2x;
      const term4 = Math.pow(t, 3) * x2;
      
      const term5 = Math.pow(1 - t, 3) * y1;
      const term6 = 3 * Math.pow(1 - t, 2) * t * cp1y;
      const term7 = 3 * (1 - t) * Math.pow(t, 2) * cp2y;
      const term8 = Math.pow(t, 3) * y2;
      
      return {
        x: term1 + term2 + term3 + term4,
        y: term5 + term6 + term7 + term8
      };
    };
    
    // Initial draw
    drawMap();
    
    // Redraw on resize
    const resizeObserver = new ResizeObserver(() => {
      drawMap();
    });
    
    resizeObserver.observe(container);
    
    // Simulate movement with interval
    const interval = setInterval(() => {
      drawMap();
    }, 5000);
    
    return () => {
      clearInterval(interval);
      resizeObserver.disconnect();
    };
  }, [bus, route]);
  
  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full min-h-[400px] bg-gray-50 rounded-lg"
    ></div>
  );
};

export default BusMap;