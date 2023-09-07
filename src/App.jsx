import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import { invoke } from "@tauri-apps/api/tauri";
import Video_Full from "./assets/Full.mp4"
import Grid_Only from "./assets/Grid_Only.mp4"
import PV_Only from "./assets/PV_Only.mp4"

const options = {
  indexAxis: 'y',
  elements: {
    bar: {
      borderWidth: 0,
    },
  },
  maintainAspectRatio: false,
  scales: {
    y: {
      ticks: { color: '#faf803', beginAtZero: true },
      border: {
        display: false
      },
      grid: {
        display: false
      }
    },
    x: {
      ticks: { color: '#ffffff', beginAtZero: true },
      border: {
        display: false
      },
      grid: {
        display: true,
        color: '#ffffff'
      }
    }
  },
  responsive: true,
  plugins: {
    legend: {
      display: false,
      maintainAspectRatio: false,
    }
  },
};

function App() {

  const [panals, setPanals] = useState([500,400,300]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Increment the count by 1 and update the state
      setPanals((prevCount) => [prevCount[0] + 0.25,prevCount[1] + 0.5,prevCount[2] + 0.75]);
    }, 300); // 2000 milliseconds = 2 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const data = {
    labels: ['PV-INV1', 'PV-INV2', 'PV-INV3'],
    datasets: [
      {
        label: 'PV',
        data: panals,
        backgroundColor: 'rgba(251,214,38,255)',
      }
    ],
  };

  return (
    <div className="w-full h-full">
      <div className="absolute top-[565px] left-[50px] w-[194px] h-[266px] text-yellow-text">
        <div className="h-[40px] flex items-center text-2xl px-3">Grid</div>
        <div className="h-[226px] flex-col space-y-5 p-3">
          <div class="flex justify-between">
            Vavg:
            <p class="text-white">213.51</p>
            V
          </div>
          <div class="flex justify-between">
            Aavg:
            <p class="text-white">89.41</p>
            A
          </div>
          <div class="flex justify-between">
            Ptot:
            <p class="text-white">00.00</p>
            kW
          </div>
          <div class="flex justify-between pt-12">
            Etot:
            <p class="text-white">00.00</p>
            kWh
          </div>
        </div>
      </div>

      <div className='absolute top-[40px] left-[335px] w-[427px] h-[158px] px-1'>
        <div className='h-[35px] flex items-center justify-center text-yellow-text text-2xl px-2'>Solar Panels</div>
        <div className='h-[123px]'>
          <Bar options={options} data={data} height={200} />
        </div>
      </div>

      <div className="absolute top-[40px] left-[889px] w-[190px] h-[158px] text-yellow-text">
        <div className="h-[40px] flex items-center text-2xl px-2"><p>Inverter <span class="text-white">No.1</span></p></div>
        <div className="h-[226px] flex-col space-y-0 px-4">
          <div class="flex justify-between">
            <pre>PV  :</pre>
            <p class="text-white">100.02</p>
            W
          </div>
          <div class="flex justify-between">
            <pre>BATT :</pre>
            <p class="text-white"></p>
            No Battery
          </div>
          <div class="flex justify-between">
            Temp:
            <p class="text-white">00.00</p>
            ํC
          </div>
        </div>
      </div>
      <div className="absolute top-[40px] left-[1093.5px] w-[190px] h-[158px] text-yellow-text">
        <div className="h-[40px] flex items-center text-2xl px-2"><p>Inverter <span class="text-white">No.2</span></p></div>
        <div className="h-[226px] flex-col space-y-0 px-4">
          <div class="flex justify-between">
            <pre>PV  :</pre>
            <p class="text-white">30.02</p>
            W
          </div>
          <div class="flex justify-between">
            <pre>BATT :</pre>
            <p class="text-white">51.00</p>
            %
          </div>
          <div class="flex justify-between">
            Temp:
            <p class="text-white">00.00</p>
            ํC
          </div>
        </div>
      </div>
      <div className="absolute top-[40px] left-[1296px] w-[190px] h-[158px] text-yellow-text">
        <div className="h-[40px] flex items-center text-2xl px-2"><p>Inverter <span class="text-white">No.3</span></p></div>
        <div className="h-[226px] flex-col space-y-0 px-4">
          <div class="flex justify-between">
            <pre>PV  :</pre>
            <p class="text-white">100.02</p>
            W
          </div>
          <div class="flex justify-between">
            <pre>BATT :</pre>
            <p class="text-white">38.31</p>
            %
          </div>
          <div class="flex justify-between">
            Temp:
            <p class="text-white">00.00</p>
            ํC
          </div>
        </div>
      </div>

      <div className="absolute top-[420px] left-[1195px] w-[300px] h-[247px] text-yellow-text">
        <div className="h-[70px] ps-2 flex items-center"><div><p className="text-2xl">Power Consumption</p><p className="text-white text-xs font-bold">Kung Krabane Bay Royal Development project</p></div></div>
        <div className="h-[177px] flex-col space-y-4 p-2 text-xl">
          <div class="flex justify-between">
            <pre className="bg-yellow-bg text-black rounded-md px-2">Daily Usage  </pre>
            <p class="text-white">00.00</p>
            kWh
          </div>
          <div class="flex justify-between">
            <pre className="bg-yellow-bg text-black rounded-md px-2">Totally Usage</pre>
            <p class="text-white">00.00</p>
            kWh
          </div>
          <div class="flex justify-between">
            <pre className="bg-yellow-bg text-black rounded-md px-2">Total savings</pre>
            <p class="text-white">00.00</p>
            ฿
          </div>
        </div>
      </div>
      <video src={Video_Full} autoPlay loop muted />
    </div>
  );
}

export default App;
