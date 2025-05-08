import React from 'react';

interface BusSeatSelectorProps {
  selectedSeats: string[];
  onSeatSelect: (seatId: string) => void;
}

const BusSeatSelector: React.FC<BusSeatSelectorProps> = ({ 
  selectedSeats, 
  onSeatSelect
}) => {
  // Generate a list of all seats
  const generateSeats = () => {
    const seats = [];
    // Define seat rows and numbers
    const rows = ['A', 'B', 'C', 'D'];
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    // Pre-booked seats (for demo)
    const bookedSeats = ['A1', 'A2', 'B3', 'C5', 'D6', 'D7', 'B8', 'C9'];
    
    for (const row of rows) {
      for (const num of numbers) {
        const seatId = `${row}${num}`;
        const isBooked = bookedSeats.includes(seatId);
        const isSelected = selectedSeats.includes(seatId);
        
        seats.push({
          id: seatId,
          isBooked,
          isSelected
        });
      }
    }
    
    return seats;
  };
  
  const seats = generateSeats();
  
  return (
    <div className="bus-seat-selector">
      {/* Bus front */}
      <div className="text-center mb-6">
        <div className="h-8 w-32 mx-auto bg-gray-300 rounded-t-3xl"></div>
        <p className="text-xs text-gray-500 mt-1">Driver</p>
      </div>
      
      {/* Seats */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {/* Column labels */}
        <div className="col-span-5 grid grid-cols-5 gap-2 mb-2">
          <div></div>
          <div className="text-center text-xs text-gray-500">1</div>
          <div className="text-center text-xs text-gray-500">2</div>
          <div></div>
          <div className="text-center text-xs text-gray-500">3</div>
        </div>
        
        {/* Seat rows */}
        {['A', 'B', 'C', 'D'].map(row => (
          <React.Fragment key={row}>
            {/* Row label */}
            <div className="flex items-center justify-center text-xs text-gray-500">
              {row}
            </div>
            
            {/* First column seats */}
            {[1, 2].map(col => {
              const seatId = `${row}${col}`;
              const seat = seats.find(s => s.id === seatId);
              
              return (
                <button
                  key={seatId}
                  onClick={() => !seat?.isBooked && onSeatSelect(seatId)}
                  disabled={seat?.isBooked}
                  className={`h-10 w-10 rounded-md flex items-center justify-center text-xs font-medium ${
                    seat?.isBooked 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : seat?.isSelected
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-200 hover:bg-gray-300'
                  } transition-colors duration-200`}
                >
                  {seatId}
                </button>
              );
            })}
            
            {/* Aisle */}
            <div className="flex items-center justify-center">
              <div className="w-4"></div>
            </div>
            
            {/* Second column seats */}
            {[3, 4].map(col => {
              const seatId = `${row}${col}`;
              const seat = seats.find(s => s.id === seatId);
              
              return (
                <button
                  key={seatId}
                  onClick={() => !seat?.isBooked && onSeatSelect(seatId)}
                  disabled={seat?.isBooked}
                  className={`h-10 w-10 rounded-md flex items-center justify-center text-xs font-medium ${
                    seat?.isBooked 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : seat?.isSelected
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-200 hover:bg-gray-300'
                  } transition-colors duration-200`}
                >
                  {seatId}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Second section of seats */}
      <div className="grid grid-cols-5 gap-2">
        {/* Column labels */}
        <div className="col-span-5 grid grid-cols-5 gap-2 mb-2">
          <div></div>
          <div className="text-center text-xs text-gray-500">5</div>
          <div className="text-center text-xs text-gray-500">6</div>
          <div></div>
          <div className="text-center text-xs text-gray-500">7</div>
        </div>
        
        {/* Seat rows */}
        {['A', 'B', 'C', 'D'].map(row => (
          <React.Fragment key={`${row}-2`}>
            {/* Row label */}
            <div className="flex items-center justify-center text-xs text-gray-500">
              {row}
            </div>
            
            {/* First column seats */}
            {[5, 6].map(col => {
              const seatId = `${row}${col}`;
              const seat = seats.find(s => s.id === seatId);
              
              return (
                <button
                  key={seatId}
                  onClick={() => !seat?.isBooked && onSeatSelect(seatId)}
                  disabled={seat?.isBooked}
                  className={`h-10 w-10 rounded-md flex items-center justify-center text-xs font-medium ${
                    seat?.isBooked 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : seat?.isSelected
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-200 hover:bg-gray-300'
                  } transition-colors duration-200`}
                >
                  {seatId}
                </button>
              );
            })}
            
            {/* Aisle */}
            <div className="flex items-center justify-center">
              <div className="w-4"></div>
            </div>
            
            {/* Second column seats */}
            {[7, 8].map(col => {
              const seatId = `${row}${col}`;
              const seat = seats.find(s => s.id === seatId);
              
              return (
                <button
                  key={seatId}
                  onClick={() => !seat?.isBooked && onSeatSelect(seatId)}
                  disabled={seat?.isBooked}
                  className={`h-10 w-10 rounded-md flex items-center justify-center text-xs font-medium ${
                    seat?.isBooked 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : seat?.isSelected
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-200 hover:bg-gray-300'
                  } transition-colors duration-200`}
                >
                  {seatId}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      
      {/* Last row of seats */}
      <div className="grid grid-cols-5 gap-2 mt-4">
        {/* Column labels */}
        <div className="col-span-5 grid grid-cols-5 gap-2 mb-2">
          <div></div>
          <div className="text-center text-xs text-gray-500">9</div>
          <div className="text-center text-xs text-gray-500">10</div>
          <div></div>
          <div></div>
        </div>
        
        {/* Seat rows */}
        {['A', 'B', 'C', 'D'].map(row => (
          <React.Fragment key={`${row}-3`}>
            {/* Row label */}
            <div className="flex items-center justify-center text-xs text-gray-500">
              {row}
            </div>
            
            {/* Last row seats */}
            {[9, 10].map(col => {
              const seatId = `${row}${col}`;
              const seat = seats.find(s => s.id === seatId);
              
              return (
                <button
                  key={seatId}
                  onClick={() => !seat?.isBooked && onSeatSelect(seatId)}
                  disabled={seat?.isBooked}
                  className={`h-10 w-10 rounded-md flex items-center justify-center text-xs font-medium ${
                    seat?.isBooked 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : seat?.isSelected
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-200 hover:bg-gray-300'
                  } transition-colors duration-200`}
                >
                  {seatId}
                </button>
              );
            })}
            
            {/* Empty space for the last two cells */}
            <div className="flex items-center justify-center">
              <div className="w-4"></div>
            </div>
            <div></div>
          </React.Fragment>
        ))}
      </div>
      
      {/* Bus rear */}
      <div className="text-center mt-6">
        <div className="h-2 w-full mx-auto bg-gray-300 rounded-b-sm"></div>
      </div>
    </div>
  );
};

export default BusSeatSelector;