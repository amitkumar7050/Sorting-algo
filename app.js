// Import necessary libraries
import React, { useState } from 'react';
import './App.css';

// Generate random array of integers
const generateRandomArray = (size) => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
};

const App = () => {
  const [array, setArray] = useState(generateRandomArray(50));
  const [speed, setSpeed] = useState(100);
  const [arraySize, setArraySize] = useState(50);
  const [isSorting, setIsSorting] = useState(false);
  const [selectedSort, setSelectedSort] = useState(null);

  // Utility to pause execution for visualization
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Visualize sorting by modifying array bar colors
  const updateArrayBars = (indices, color) => {
    const bars = document.getElementsByClassName('array-bar');
    indices.forEach((i) => {
      bars[i].style.backgroundColor = color;
    });
  };

  // Bubble Sort Implementation
  const bubbleSort = async () => {
    const arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        updateArrayBars([j, j + 1], 'red');
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
        }
        await sleep(speed);
        updateArrayBars([j, j + 1], 'turquoise');
      }
    }
  };

  // Merge Sort Helper Functions
  const merge = async (arr, l, m, r) => {
    let left = arr.slice(l, m + 1);
    let right = arr.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      updateArrayBars([k], 'red');
      if (left[i] <= right[j]) {
        arr[k++] = left[i++];
      } else {
        arr[k++] = right[j++];
      }
      setArray([...arr]);
      await sleep(speed);
      updateArrayBars([k - 1], 'turquoise');
    }
    while (i < left.length) {
      updateArrayBars([k], 'red');
      arr[k++] = left[i++];
      setArray([...arr]);
      await sleep(speed);
      updateArrayBars([k - 1], 'turquoise');
    }
    while (j < right.length) {
      updateArrayBars([k], 'red');
      arr[k++] = right[j++];
      setArray([...arr]);
      await sleep(speed);
      updateArrayBars([k - 1], 'turquoise');
    }
  };

  const mergeSortHelper = async (arr, l, r) => {
    if (l < r) {
      const m = Math.floor((l + r) / 2);
      await mergeSortHelper(arr, l, m);
      await mergeSortHelper(arr, m + 1, r);
      await merge(arr, l, m, r);
    }
  };

  const mergeSort = async () => {
    const arr = [...array];
    await mergeSortHelper(arr, 0, arr.length - 1);
  };

  // Quick Sort Helper Functions
  const partition = async (arr, low, high) => {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      updateArrayBars([j, high], 'red');
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        await sleep(speed);
      }
      updateArrayBars([j, high], 'turquoise');
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    await sleep(speed);
    return i + 1;
  };

  const quickSortHelper = async (arr, low, high) => {
    if (low < high) {
      const pi = await partition(arr, low, high);
      await quickSortHelper(arr, low, pi - 1);
      await quickSortHelper(arr, pi + 1, high);
    }
  };

  const quickSort = async () => {
    const arr = [...array];
    await quickSortHelper(arr, 0, arr.length - 1);
  };

  const startSorting = async () => {
    setIsSorting(true);
    if (selectedSort === 'bubble') await bubbleSort();
    else if (selectedSort === 'merge') await mergeSort();
    else if (selectedSort === 'quick') await quickSort();
    setIsSorting(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="title">Sorting Algorithm Visualizer</h1>
        <div className="controls">
          <button className="control-button" onClick={() => setArray(generateRandomArray(arraySize))} disabled={isSorting}>
            Generate New Array
          </button>
          <button className="control-button" onClick={() => setSelectedSort('bubble')} disabled={isSorting}>
            Bubble Sort
          </button>
            
          <button className="control-button" onClick={() => setSelectedSort('merge')} disabled={isSorting}>
            Merge Sort
          </button>
          <button className="control-button" onClick={() => setSelectedSort('quick')} disabled={isSorting}>
            Quick Sort
          </button>
          <button className="control-button start-button" onClick={startSorting} disabled={isSorting || !selectedSort}>
            Start Sorting
          </button>
        </div>
        <div className="sliders">
          <div className="slider-container">
            <label>Array Size</label>
            <input
              type="range"
              min="10"
              max="100"
              value={arraySize}
              onChange={(e) => {
                setArraySize(Number(e.target.value));
                setArray(generateRandomArray(Number(e.target.value)));
              }}
              disabled={isSorting}
            />
          </div>
          <div className="slider-container">
            <label>Sorting Speed</label>
            <input
              type="range"
              min="10"
              max="500"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={isSorting}
            />
          </div>
        </div>
        <div className="array-container">
          {array.map((value, idx) => (
            <div
              className="array-bar"
              key={idx}
              style={{ height: `${value}%` }}
            ></div>
          ))}
        </div>
      </header>
    </div>
  );
};

export default App;
