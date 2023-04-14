const removeLiftBtn = document.querySelector('.remove_lift');
const addLiftBtn = document.querySelector('.add_lift');
const removeFloorBtn = document.querySelector('.remove_floor');
const addFloorBtn = document.querySelector('.add_floor');
const downArrow = document.querySelector('.down');
const generatedFloors = document.querySelector('.main').childNodes;
const groundFloorUpBtn = document.querySelector('.ground-up');
const groundFloorDownBtn = document.querySelector('.ground-down');

let numberOfLifts = 1;
let numberOfFloors = 1;
let liftsReqQueue = [];

removeLiftBtn.addEventListener('click', () => {
  if (numberOfLifts == 1) return;
  let lifts = document.querySelectorAll('.lift');

  let lastLift = lifts[lifts.length - 1];

  lastLift.remove();
  numberOfLifts--;
});

addLiftBtn.addEventListener('click', () => {
  let width = window.innerWidth;
  if (width < 769 && numberOfLifts >= (width - 80) / 70) return;
  if (width >= 769 && numberOfLifts >= (width - 80) / 70) return;
  numberOfLifts++;
  let lifts = document.querySelectorAll('.lift');
  let lastLift = lifts[lifts.length - 1];

  let newLift = document.createElement('div');
  newLift.classList.add('lift');
  newLift.setAttribute('data-pos', 0);
  newLift.setAttribute('data-state', 'free');
  newLift.innerHTML = `
  <div class="door"></div>
  <div class="door"></div>`;

  lastLift.after(newLift);
});

const main = document.querySelector('.main');

function doorsAnimation(liftDoorsArr, floorNum, movingLift, previousPosition) {
  let doorOpeningDuration = Math.abs(
    Number(previousPosition) - Number(floorNum)
  );

  setTimeout(() => {
    liftDoorsArr[0].style.width = `0`;
    liftDoorsArr[0].style.transition = `all ease-in-out 2.5s`;
    liftDoorsArr[1].style.width = `0`;
    liftDoorsArr[1].style.transition = `all ease-in-out 2.5s`;
  }, 1000 * doorOpeningDuration * 2);

  setTimeout(() => {
    liftDoorsArr[0].style.width = `25px`;
    liftDoorsArr[0].style.transition = `all ease-in-out 2.5s`;
    liftDoorsArr[1].style.width = `25px`;
    liftDoorsArr[1].style.transition = `all ease-in-out 2.5s`;
  }, 1000 * doorOpeningDuration * 2 + 2500);

  setTimeout(() => {
    movingLift.setAttribute('data-state', 'free');
    if (liftsReqQueue.length !== 0) {
      moveLiftTo(liftsReqQueue[0]);
    }
    liftsReqQueue.shift();
  }, 1000 * doorOpeningDuration * 2 + 5000);
}

function checkForExistingLift(liftsArr, floorNum) {
  let existingLift = liftsArr.find(
    (lift) => Number(lift.dataset.pos) == floorNum
  );
  return existingLift;
}

const moveLiftTo = (floorNum) => {
  const lifts = document.querySelector('.lift_container').childNodes;
  const liftsArr = Array.from(lifts);
  liftsArr.pop();
  liftsArr.shift();
  const existingLift = checkForExistingLift(liftsArr, floorNum);
  if (existingLift) {
    let existingLiftDoorsArr = existingLift.querySelectorAll('.door');
    doorsAnimation(existingLiftDoorsArr, floorNum, existingLift, floorNum);
  } else {
    const freeLiftsArr = liftsArr.filter(
      (lift) => lift.dataset.state === 'free'
    );

    if (freeLiftsArr.length === 0) {
      liftsReqQueue.push(Number(floorNum));
    }

    let previousPosition;
    const movingLift = freeLiftsArr[0];
    
    movingLift.setAttribute('data-state', 'busy');
    let distance = floorNum * 110;
    movingLift.style.transform = `translateY(-${distance + floorNum * 2}px)`;
    let currentPosLift = movingLift.dataset.pos;
    let liftSpeed = 2 * Math.abs(Number(floorNum) - Number(currentPosLift));
    movingLift.style.transition = `transform ${liftSpeed}s ease-in`;
    previousPosition = currentPosLift;
    let liftDoorsArr = movingLift.querySelectorAll('.door');
    doorsAnimation(liftDoorsArr, floorNum, movingLift, previousPosition);
    movingLift.setAttribute('data-pos', floorNum);
  }
};

addFloorBtn.addEventListener('click', () => {
  let newFloor = document.createElement('div');
  main.prepend(newFloor);
  newFloor.classList.add('floor_container');
  newFloor.setAttribute('data-floorNum', numberOfFloors);
  newFloor.innerHTML = `<div class="arrow_container">
  <i class="fa-solid fa-circle-chevron-up fa-2xl up"></i>
  <i class="fa-solid fa-circle-chevron-down fa-2xl down"></i>
  </div>`;
  let floorReqNum = newFloor.getAttribute('data-floorNum');
  const singleUpArrowBtn = document.querySelector('.up');
  const singleDownArrowBtn = document.querySelector('.down');
  singleUpArrowBtn.addEventListener('click', () => moveLiftTo(floorReqNum));
  singleDownArrowBtn.addEventListener('click', () => moveLiftTo(floorReqNum));
  numberOfFloors++;
});

removeFloorBtn.addEventListener('click', () => {
  if (numberOfFloors == 1) return;
  let floors = document.querySelectorAll('.floor_container');
  const lifts = document.querySelector('.lift_container').childNodes;
  const liftsArr = Array.from(lifts);
  liftsArr.pop();
  liftsArr.shift();
  let lastFloor = floors[0];
  lastFloor.remove();
  numberOfFloors--;
});

groundFloorUpBtn.addEventListener('click', () => moveLiftTo(0));
groundFloorDownBtn.addEventListener('click', () => moveLiftTo(0));

// const lifts2 = lifts.querySelectorAll('.lift');
// const liftsArr = Array.from(lifts2);
// console.log('liftsArr,lifts2', liftsArr,lifts2);

/* Logic for sorting the freed lifts will go here */
// const sortedFreeLifts = getSortedFreeLifts(freeLiftsArr, floorNum);
// const movingLift = sortedFreeLifts[0];
