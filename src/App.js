import React, { useState, useEffect } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const App = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [roomData, setRoomData] = useState({
    room1: false,
    room2: false,
    room3: false,
    room4: false,
  });

  useEffect(() => {
    const datePicker = flatpickr("#datepicker", {
      // Flatpickr configuration options
      dateFormat: 'Y-m-d',
      minDate: 'today',
      onChange: (selectedDates) => {
        setSelectedDate(selectedDates[0] ? selectedDates[0].toISOString() : '');
      },
    });

    // Cleanup function
    return () => {
      datePicker.destroy();
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = {
      room1Cb: roomData.room1,
      room2Cb: roomData.room2,
      room3Cb: roomData.room3,
      room4Cb: roomData.room4,
      selectedDate,
    };

    fetch('/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).catch((error) => console.error('Error saving checkbox state:', error));

    setSelectedDate('');
    resetRoomData();
    flatpickr('#datepicker').clear();
  };

  const changeImage = (rectangleId, checkboxId) => {
    const image = document.getElementById(rectangleId);
    const redSource = image.src.replace('green', 'red');
    const greenSource = image.src.replace('red', 'green');

    if (image.src === redSource) {
      image.src = greenSource;
    } else {
      image.src = redSource;
    }

    const checkbox = document.getElementById(checkboxId);
    checkbox.checked = !checkbox.checked;

    setRoomData((prevRoomData) => ({
      ...prevRoomData,
      [checkboxId]: !prevRoomData[checkboxId],
    }));
  };

  const resetRoomData = () => {
    setRoomData({
      room1: false,
      room2: false,
      room3: false,
      room4: false,
    });
  };

  const showDays = async () => {
    try {
      const response = await fetch('/rooms/days/');
      const data = await response.json();

      const datesContainer = document.getElementById("datesContainer");
      datesContainer.innerHTML = "";

      for (const dateString of data) {
        const dateElement = document.createElement("div");
        dateElement.textContent = dateString;
        dateElement.className = "dateButton";

        datesContainer.appendChild(dateElement);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <h2>Select date:</h2>
      <input id="datepicker" type="text" placeholder="Select date" />
      <button id="showDaysButton" type="button" onClick={showDays}>
        Show reserved days
      </button>
      <div id="datesContainer"></div>

      <form id="roomsForm" onSubmit={handleSubmit}>
        <img
          className="rectangle"
          id="rectangle1"
          src="images/green1.png"
          alt="Green Rectangle 1"
          width="200"
          height="auto"
          onClick={() => changeImage('rectangle1', 'room1Cb')}
        />
        {/* Repeat similar code for other rectangles */}
        <button type="submit">SUBMIT</button>
      </form>
    </div>
  );
};

export default App;
