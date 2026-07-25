const endDate = new Date("nov 25, 2026 00:00:00");

const interval = setInterval(() => {
  const currentDate = new Date(),
    timeLeft = endDate.getTime() - currentDate.getTime(); // in ms

  if (timeLeft <= 0) {
    clearInterval(x);
    return;
  }

  
    const msInDay = 24 * 60 * 60 * 1000;

  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000),
    minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)),
    hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    // 3. Extract components sequentially from the remainder
    let months = (endDate.getFullYear() - currentDate.getFullYear()) * 12 + (endDate.getMonth() - currentDate.getMonth()),
     currentTarget = new Date(currentDate);
    currentTarget.setMonth(currentTarget.getMonth() + months);
   

     if (currentTarget > endDate) {
        months--;
        currentTarget = new Date(currentDate);
        currentTarget.setMonth(currentTarget.getMonth() + months);
    }
    const diffMs = endDate - currentTarget;
    days = Math.floor(diffMs / msInDay);

  // Get elements by class name
  let countdownElements = document.getElementsByClassName("countdown-element");

  // Loop through the elements and update their content
  for (const countdownElement of countdownElements) {
    let className = countdownElement.classList[1]; // Get the second class name
    switch (className) {
      case "months":
        countdownElement.innerHTML = months;
        break;
      case "days":
        countdownElement.innerHTML = days;
        break;
      case "hours":
        countdownElement.innerHTML = hours;
        break;
      case "minutes":
        countdownElement.innerHTML = minutes;
        break;
      case "seconds":
        countdownElement.innerHTML = seconds;
        break;
      default:
        break;
    }
  }
}, 1000);

// const swiper = new Swiper(".progress-slide-carousel", {
//   loop: true,
//   fraction: true,
//   autoplay: {
//     delay: 5000,
//     disableOnInteraction: false,
//   },
//   pagination: {
//     el: ".progress-slide-carousel .swiper-pagination",
//     type: "progressbar",
//   },
// });
