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

  const [vavg, setVavg] = useState(1);
  const [iavg, setIavg] = useState(2);
  const [ptot, setPtot] = useState(3);
  const [etot, setEtot] = useState(4);
  const [pv1, setPV1] = useState(5);
  const [pv2, setPV2] = useState(6);
  const [pv3, setPV3] = useState(7);
  const [batt1, setBatt1] = useState("No Battery");
  const [batt2, setBatt2] = useState(8);
  const [batt3, setBatt3] = useState(9);
  const [temp1, setTemp1] = useState(10);
  const [temp2, setTemp2] = useState(11);
  const [temp3, setTemp3] = useState(12);
  const [dailCon, setDailCon] = useState(13);
  const [totalCon, setTotalCon] = useState(14);
  const [saving, setSaving] = useState(15);

  useEffect(() => {
    const intervalId = setInterval(() => {

      fetch('http://127.0.0.1:1880/bss/status')
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          let inverters = data.inverters;
          let smartLogger = data.smartLogger;

          let inverter1 = inverters[0];
          let inverter2 = inverters[1];
          let inverter3 = inverters[2];

          let inv1_Vavg = (inverter1.V[0] + inverter1.V[1] + inverter1.V[2])/3;
          let inv2_Vavg = (inverter2.V[0] + inverter2.V[1] + inverter2.V[2])/3;
          let inv3_Vavg = (inverter3.V[0] + inverter3.V[1] + inverter3.V[2])/3;

          let inv1_Iavg = (inverter1.A[0] + inverter1.A[1] + inverter1.A[2])/3;
          let inv2_Iavg = (inverter2.A[0] + inverter2.A[1] + inverter2.A[2])/3;
          let inv3_Iavg = (inverter3.A[0] + inverter3.A[1] + inverter3.A[2])/3;

          let Vavg = 0;
          let Vavg_dv = 0;
          if (inv1_Vavg > 1) {
            Vavg_dv = Vavg_dv + 1;
            Vavg = Vavg + inv1_Vavg;
          }
          if (inv2_Vavg > 1) {
            Vavg_dv = Vavg_dv + 1;
            Vavg = Vavg + inv2_Vavg;
          }
          if (inv3_Vavg > 1) {
            Vavg_dv = Vavg_dv + 1;
            Vavg = Vavg + inv3_Vavg;
          }

          if (Vavg_dv > 0) {
            Vavg = Vavg / Vavg_dv;
          }

          let Iavg = 0;
          let Iavg_dv = 0;
          if (inv1_Iavg > 0) {
            Iavg_dv = Iavg_dv + 1;
            Iavg = Iavg + inv1_Iavg;
          }
          if (inv2_Iavg > 0) {
            Iavg_dv = Iavg_dv + 1;
            Iavg = Iavg + inv2_Iavg;
          }
          if (inv3_Iavg > 0) {
            Iavg_dv = Iavg_dv + 1;
            Iavg = Iavg + inv3_Iavg;
          }

          if (Iavg_dv > 0) {
            Iavg = Iavg / Iavg_dv;
          }

          setVavg(Vavg.toFixed(2));
          setIavg(Iavg.toFixed(2));

        })
        .catch((err) => {
          console.log(err.message);
        });

    }, 1500);

    return () => clearInterval(intervalId);
  }, []);

  const data = {
    labels: ['PV-INV1', 'PV-INV2', 'PV-INV3'],
    datasets: [
      {
        label: 'PV',
        data: [pv1, pv2, pv3],
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
            <p class="text-white">{vavg}</p>
            V
          </div>
          <div class="flex justify-between">
            Aavg:
            <p class="text-white">{iavg}</p>
            A
          </div>
          <div class="flex justify-between">
            Ptot:
            <p class="text-white">{ptot}</p>
            kW
          </div>
          <div class="flex justify-between pt-12">
            Etot:
            <p class="text-white">{etot}</p>
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
            <p class="text-white">{pv1}</p>
            W
          </div>
          <div class="flex justify-between">
            <pre>BATT :</pre>
            <p class="text-white"></p>
            {batt1}
          </div>
          <div class="flex justify-between">
            Temp:
            <p class="text-white">{temp1}</p>
            ํC
          </div>
        </div>
      </div>
      <div className="absolute top-[40px] left-[1093.5px] w-[190px] h-[158px] text-yellow-text">
        <div className="h-[40px] flex items-center text-2xl px-2"><p>Inverter <span class="text-white">No.2</span></p></div>
        <div className="h-[226px] flex-col space-y-0 px-4">
          <div class="flex justify-between">
            <pre>PV  :</pre>
            <p class="text-white">{pv2}</p>
            W
          </div>
          <div class="flex justify-between">
            <pre>BATT :</pre>
            <p class="text-white">{batt2}</p>
            %
          </div>
          <div class="flex justify-between">
            Temp:
            <p class="text-white">{temp2}</p>
            ํC
          </div>
        </div>
      </div>
      <div className="absolute top-[40px] left-[1296px] w-[190px] h-[158px] text-yellow-text">
        <div className="h-[40px] flex items-center text-2xl px-2"><p>Inverter <span class="text-white">No.3</span></p></div>
        <div className="h-[226px] flex-col space-y-0 px-4">
          <div class="flex justify-between">
            <pre>PV  :</pre>
            <p class="text-white">{pv3}</p>
            W
          </div>
          <div class="flex justify-between">
            <pre>BATT :</pre>
            <p class="text-white">{batt3}</p>
            %
          </div>
          <div class="flex justify-between">
            Temp:
            <p class="text-white">{temp3}</p>
            ํC
          </div>
        </div>
      </div>

      <div className="absolute top-[420px] left-[1195px] w-[300px] h-[247px] text-yellow-text">
        <div className="h-[70px] ps-2 flex items-center"><div><p className="text-2xl">Power Consumption</p><p className="text-white text-xs font-bold">Kung Krabane Bay Royal Development project</p></div></div>
        <div className="h-[177px] flex-col space-y-4 p-2 text-xl">
          <div class="flex justify-between">
            <pre className="bg-yellow-bg text-black rounded-md px-2">Daily Usage  </pre>
            <p class="text-white">{dailCon}</p>
            kWh
          </div>
          <div class="flex justify-between">
            <pre className="bg-yellow-bg text-black rounded-md px-2">Totally Usage</pre>
            <p class="text-white">{totalCon}</p>
            kWh
          </div>
          <div class="flex justify-between">
            <pre className="bg-yellow-bg text-black rounded-md px-2">Total savings</pre>
            <p class="text-white">{saving}</p>
            ฿
          </div>
        </div>
      </div>
      <video src={Video_Full} autoPlay loop muted />
    </div>
  );
}

export default App;
