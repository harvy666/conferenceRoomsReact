const maxDate = new Date();
maxDate.setDate(maxDate.getDate() + 7);


//TODO dinamically change BG color of weekdays if I change back to all green on a selected date
document.addEventListener("DOMContentLoaded", () => {
  let datePicker = flatpickr("#datepicker", { 
    locale: {
      firstDayOfWeek: 1,
    },
    minDate: "today",
    maxDate: maxDate,
    onChange: function (selectedDates) {
      var myDiv = document.getElementById("rooms");
      myDiv.style.display = "block";
      console.log("Changing!!!")


      if (selectedDates.length > 0) {
        //const selectedDate = selectedDates[0].toLocaleDateString('hu-HU');
        const selectedDate = selectedDates[0].toLocaleDateString('hu-HU', { timeZone: 'Europe/Budapest' });
        fetch(`/rooms/data/?selectedDate=${selectedDate}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(response => response.json())
          .then(data => {
            // Update checkboxes/images based on the data received from the server
            updateCheckboxes(data);
          })
          .catch(error => {  
            console.error("Error fetching data:");
          });
      }
        
    function updateCheckboxes(data) {
    // Update checkboxes/images based on the data received from the server
    document.getElementById("room1Cb").checked = data.room1;
    document.getElementById("room2Cb").checked = data.room2;
    document.getElementById("room3Cb").checked = data.room3;
    document.getElementById("room4Cb").checked = data.room4;

    updateImages("room1Cb", "rectangle1");
    updateImages("room2Cb", "rectangle2");
    updateImages("room3Cb", "rectangle3");
    updateImages("room4Cb", "rectangle4");
    }
    },
  });

  let form = document.getElementById("roomsForm");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let room1Cb = document.getElementById("room1Cb").checked;
    let room2Cb = document.getElementById("room2Cb").checked;
    let room3Cb = document.getElementById("room3Cb").checked;
    let room4Cb = document.getElementById("room4Cb").checked;
    const selectedDate = document.getElementById("datepicker").value;

    let formData = {
      room1Cb,
      room2Cb,
      room3Cb,
      room4Cb,
      selectedDate,
    };

    fetch("/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }).catch((error) => {console.error("Error saving checkbox state:", error);});

    //set stuff back to starting values
    document.getElementById("room1Cb").checked = false;
    document.getElementById("room2Cb").checked = false;
    document.getElementById("room3Cb").checked = false;
    document.getElementById("room4Cb").checked = false;
    // Set minDate and maxDate options again after clearing the date picker
    datePicker.set("minDate", "today");
    datePicker.set("maxDate", maxDate);
    datePicker.clear();
    //hide everything again
    var myDiv = document.getElementById("rooms");
    myDiv.style.display = "none";
    resetImage(); 
    showDays();   
  });
});

function changeImage(rectangleId, checkboxId) { // eslint-disable-line no-unused-vars
  var image = document.getElementById(rectangleId);
  var redSource = image.src.replace("green", "red");
  var greenSource = image.src.replace("red", "green");

  if (image.src === redSource) {
    image.src = greenSource;
  } else {
    image.src = redSource;
  }

  var checkbox = document.getElementById(checkboxId);
  checkbox.checked = !checkbox.checked;
}

function resetImage() {
  let images = document.getElementsByClassName("rectangle");
  [...images].forEach(element => {
    element.src = element.src.replace("red", "green");
  });
}

function updateImages(checkboxId, rectangleId) {
  const checkbox = document.getElementById(checkboxId);
  const rectangle = document.getElementById(rectangleId);

  if (checkbox.checked) {
    // If checkbox is checked, show red image
    rectangle.src = rectangle.src.replace("green", "red");
  } else {
    // If checkbox is unchecked, show green image
    rectangle.src = rectangle.src.replace("red", "green");
  }
}

async function showDays() {
  var datesContainer = document.getElementById("datesContainer");
  datesContainer.innerHTML = ""; // Clear previous content

  try {
      const response = await fetch('/rooms/days/', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      const data = await response.json();
      console.log(data);

      for (var i = 0; i < 8; i++) {
          var date = new Date();
          date.setDate(date.getDate() + i);

          var dateString = date.toISOString().split('T')[0];

          var dateElement = document.createElement("div");
          dateElement.textContent = dateString;
          dateElement.className = "dateButton"; // Apply a class for styling

          // Check if the date is in the data
          if (data.includes(dateString)) {
              dateElement.style.backgroundColor = "red";
          } else {
              dateElement.style.backgroundColor = "green";
          }

          datesContainer.appendChild(dateElement);
      }
  } catch (error) {
      console.error('Error:', error);
  }
}

