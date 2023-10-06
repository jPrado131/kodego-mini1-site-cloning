/*
 DOM READY
***************************/
document.addEventListener('DOMContentLoaded', function () {

  const containers = document.querySelectorAll('.jpx-listAllMovies')

  if (containers && containers.length > 0) {
    for (let i = 0; i < containers.length; i++) {
      fetchJsonData(containers[i])
    }
  }

  // ON WINDOW SCROLL ADD HEADER CLASS
  const elemHeader = document.querySelector("header");

  window.addEventListener("scroll", function () {
    // Check if the window is scrolled to the top
    if (window.scrollY === 0) {
      // Remove a class to the element when scrolled to the top
      elemHeader.classList.remove("bg-black");
    } else {
      // Add the class if scrolled away from the top
      elemHeader.classList.add("bg-black");
    }
  });

  // SET FORMATED DATE
  const dateContainer = document.querySelector('#dateContainer')
  getFormatedDateToday(dateContainer)

});
/*
  GET DATE TODAY format (Monday, July 17th)
***************************/
function getFormatedDateToday(container) {
  // Create a new Date object with the current date
  const today = new Date();

  // Define the weekdays and months arrays
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Get the day of the week, month, and day of the month
  const dayOfWeek = weekdays[today.getDay()];
  const month = months[today.getMonth()];
  const day = today.getDate();

  // Get the suffix for the day of the month
  const suffix = getNumberSuffix(day);

  // Format the date string
  const formattedDate = dayOfWeek + ", " + month + " " + day + suffix;

  // Output the formatted date
  container.innerHTML = formattedDate
}


/*
  Function to get the suffix for the day of the month
***************************/
function getNumberSuffix(number) {
  if (number >= 11 && number <= 13) {
    return "th";
  }

  const lastDigit = number % 10;
  switch (lastDigit) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}


/*
  FETCH JSON DATA
***************************/
function fetchJsonData(container) {

  const id = container.getAttribute('id');
  const category = container.getAttribute('data-movie-category');
  const moviePerSlide = container.getAttribute('data-movie-per-slide');

  // console.log('id:', id)
  // console.log(`json/movies/${category}.json`)

  fetch(`json/movies/${category}.json`)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok.");
    })
    .then(function (data) {

      // Use the data from the JSON file
      //console.log(data);
      LayoutSlider(id, moviePerSlide, data);

    })
    .catch(function (error) {
      console.log("Error:", error.message);
    });
}

/*
  SLIDERS MAIN LAYOUT
***************************/
function LayoutSlider(id, moviePerSlide, data) {
  const movieItems = data.movieList;
  let movieList = "";
  let itemSlideCounter = 0;

  if (movieItems && movieItems.length > 0) {
    for (let i = 0; i < movieItems.length; i++) {
      movieList +=
        `<div class="img-wrap" style="width:calc(100%/${moviePerSlide})">
        <a href="${movieItems[i].url}" class="show">
          <div class="poster">
            <img class="poster img-fluid" src="${movieItems[i].imageDir}" alt="${movieItems[i].title}" >
          </div>
          <div class="content">
              <div class="title">${movieItems[i].title}</div>
          </div>
        </a>
      </div>`;

      itemSlideCounter++;

      if ((itemSlideCounter == moviePerSlide) || (i == movieItems.length - 1)) {
        appendSliderItem(id, `<div class="img-box">${movieList}</div>`)
        itemSlideCounter = 0;
        movieList = "";
      }

    }
  }
}

/*
  APPEND SLIDER ITEM
***************************/
function appendSliderItem(id, appendHtml) {
  const slider = document.getElementById(id);
  const carouselInner = slider.querySelector('.carousel-inner');
  const newItem = document.createElement('div');

  newItem.className = 'carousel-item';
  if (carouselInner.childElementCount === 0) {
    newItem.classList.add('active');
  }
  //console.log('appendHtml', appendHtml)

  newItem.innerHTML = appendHtml
  carouselInner.appendChild(newItem);
}
