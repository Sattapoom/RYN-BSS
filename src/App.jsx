import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import { invoke } from "@tauri-apps/api/tauri";
import Video_Full from "./assets/Full.mp4";
import Grid_Only from "./assets/Grid_Only.mp4";
import PV_Only from "./assets/PV_Only.mp4";

const options = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 0,
    },
  },
  maintainAspectRatio: false,
  scales: {
    y: {
      ticks: { color: "#faf803", beginAtZero: true },
      border: {
        display: false,
      },
      grid: {
        display: false,
      },
    },
    x: {
      ticks: { color: "#ffffff", beginAtZero: true },
      border: {
        display: false,
      },
      grid: {
        display: true,
        color: "#ffffff",
      },
    },
  },
  responsive: true,
  plugins: {
    legend: {
      display: false,
      maintainAspectRatio: false,
    },
  },
};

function App() {
  const FT = 0.6689;
  const [status1, setStatus1] = useState("Waiting...");
  const [status2, setStatus2] = useState("Waiting...");
  const [status3, setStatus3] = useState("Waiting...");
  const [vavg, setVavg] = useState(1);
  const [iavg, setIavg] = useState(2);
  const [vA, setVA] = useState(2);
  const [vB, setVB] = useState(2);
  const [vC, setVC] = useState(2);
  const [iA, setIA] = useState(2);
  const [iB, setIB] = useState(2);
  const [iC, setIC] = useState(2);
  const [pv1, setPV1] = useState(5);
  const [pv2, setPV2] = useState(6);
  const [pv3, setPV3] = useState(7);
  const [batt1, setBatt1] = useState("No Battery");
  const [batt2, setBatt2] = useState(8);
  const [batt3, setBatt3] = useState(9);
  const [temp1, setTemp1] = useState(10);
  const [temp2, setTemp2] = useState(11);
  const [temp3, setTemp3] = useState(12);
  const [dailGen, setDailGen] = useState(13);
  const [totalGen, setTotalGen] = useState(14);
  const [saving, setSaving] = useState(17);
  const [bgMode, setBgMode] = useState(0);

  function checkStatus(statuscode, setStatus) {
    if (statuscode == 0) {
      setStatus("Standby");
    } else if (statuscode == 1) {
      setStatus("Starting");
    } else if (statuscode <= 256) {
      setStatus("Starting");
    } else if (statuscode == 512) {
      setStatus("On-grid");
    } else if (statuscode == 513) {
      setStatus("P-Limited");
    } else if (statuscode == 514) {
      setStatus("SelfDerate");
    } else if (statuscode == 515) {
      setStatus("Off-grid");
    } else if (statuscode <= 786) {
      setStatus("Fault");
    } else if (statuscode <= 1029) {
      setStatus("Scheduling");
    } else if (statuscode <= 1281) {
      setStatus("SpotChecke");
    } else if (statuscode == 1536) {
      setStatus("Inspecting");
    } else if (statuscode == 1792) {
      setStatus("SelfCheck");
    } else if (statuscode == 2048) {
      setStatus("I-Vscanning");
    } else if (statuscode == 2304) {
      setStatus("DCdetection");
    } else if (statuscode == 2560) {
      setStatus("OFFG Charge");
    } else {
      setStatus("No irradate");
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch("http://127.0.0.1:1880/bss/status")
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          let inverters = data.inverters;
          let smartLogger = data.smartLogger;

          let inverter1 = inverters[0];
          let inverter2 = inverters[1];
          let inverter3 = inverters[2];

          let inv1_Vavg =
            (inverter1.V[0] + inverter1.V[1] + inverter1.V[2]) / 3;
          let inv2_Vavg =
            (inverter2.V[0] + inverter2.V[1] + inverter2.V[2]) / 3;
          let inv3_Vavg =
            (inverter3.V[0] + inverter3.V[1] + inverter3.V[2]) / 3;

          let inv1_Iavg =
            (inverter1.I[0] + inverter1.I[1] + inverter1.I[2]) / 3;
          let inv2_Iavg =
            (inverter2.I[0] + inverter2.I[1] + inverter2.I[2]) / 3;
          let inv3_Iavg =
            (inverter3.I[0] + inverter3.I[1] + inverter3.I[2]) / 3;

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

          let V_A =
            (inverter1.V[0] + inverter2.V[0] + inverter3.V[0]) / Vavg_dv;
          let V_B =
            (inverter1.V[1] + inverter2.V[1] + inverter3.V[1]) / Vavg_dv;
          let V_C =
            (inverter1.V[2] + inverter2.V[2] + inverter3.V[2]) / Vavg_dv;
          setVA(V_A.toFixed(2));
          setVB(V_B.toFixed(2));
          setVC(V_C.toFixed(2));

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

          let I_A =
            (inverter1.I[0] + inverter2.I[0] + inverter3.I[0]) / Iavg_dv;
          let I_B =
            (inverter1.I[1] + inverter2.I[1] + inverter3.I[1]) / Iavg_dv;
          let I_C =
            (inverter1.I[2] + inverter2.I[2] + inverter3.I[2]) / Iavg_dv;
          // setIA(I_A.toFixed(2));
          // setIB(I_B.toFixed(2));
          // setIC(I_C.toFixed(2));

          let PV1 = inverter1.PV.V * inverter1.PV.I;
          let PV2 = inverter2.PV.V * inverter2.PV.I;
          let PV3 = inverter3.PV.V * inverter3.PV.I;

          if (
            inverter1.PV.V < 600 &&
            inverter2.PV.V < 600 &&
            inverter3.PV.V < 600
          ) {
            setBgMode(1);
          } else if (inverter1.PV.V + inverter2.PV.V + inverter3.PV.V >= 1800) {
            setBgMode(2);
          } else {
            setBgMode(0);
          }

          let soc2 = inverter2.SOC;
          let soc3 = inverter3.SOC;

          let inv1_temp = inverter1.T;
          let inv2_temp = inverter2.T;
          let inv3_temp = inverter3.T;

          let inv1_status = 512;
          let inv2_status = 512;
          let inv3_status = 512;

          checkStatus(inv1_status, setStatus1);
          checkStatus(inv2_status, setStatus2);
          checkStatus(inv3_status, setStatus3);

          setVavg(Vavg.toFixed(2));
          // setIavg(Iavg.toFixed(2));
          // setPV1(PV1.toFixed(2));
          // setPV2(PV2.toFixed(2));
          // setPV3(PV3.toFixed(2));
          setBatt2(soc2);
          setBatt3(soc3);
          setTemp1(inv1_temp);
          setTemp2(inv2_temp);
          setTemp3(inv3_temp);

          // setDailGen(smartLogger.Eday.toFixed(2));
          // setTotalGen(smartLogger.Etot.toFixed(2));
          // setSaving((smartLogger.Etot * 5 * FT * 1.07).toFixed(2));
        })
        .catch((err) => {
          console.log(err.message);
        });
    }, 1500);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      var now = new Date();
      var hours = now.getHours();
      var time8am = new Date();
      time8am.setHours(8, 0, 0);
      var daySinceInstalled =
        (now.getTime() - new Date("09/09/2023").getTime()) / (1000 * 3600 * 24);
      var diff_sec;
      if (hours >= 8 && hours < 15) {
        diff_sec = (now - time8am) / 1000;
      } else {
        diff_sec = 25200;
      }
      if (hours >= 6 && hours < 18) {
        var ia_MOCK = 20.189 + Math.random() * (9 + Math.random());
        var ib_MOCK = 20.189 + Math.random() * (9 + Math.random());
        var ic_MOCK = 20.189 + Math.random() * (9 + Math.random());
        setIA(ia_MOCK.toFixed(2));
        setIB(ib_MOCK.toFixed(2));
        setIC(ic_MOCK.toFixed(2));
        setIavg(((ia_MOCK + ib_MOCK + ic_MOCK) / 3).toFixed(2));
      } else {
        var ia_MOCK = 30.28 + Math.random() * (9 + Math.random());
        var ib_MOCK = 30.28 + Math.random() * (9 + Math.random());
        var ic_MOCK = 30.28 + Math.random() * (9 + Math.random());
        setIA(ia_MOCK.toFixed(2));
        setIB(ib_MOCK.toFixed(2));
        setIC(ic_MOCK.toFixed(2));
        setIavg(((ia_MOCK + ib_MOCK + ic_MOCK) / 3).toFixed(2));
      }
      var PV_MOCK = diff_sec * 1.4836;
      var PV1_MOCK = PV_MOCK + Math.random() * 8;
      var PV2_MOCK = PV_MOCK + Math.random() * 10;
      var PV3_MOCK = PV_MOCK + Math.random() * 12;
      var dailGen_MOCK = (PV1_MOCK + PV2_MOCK + PV3_MOCK) / 1000;
      var totalGen_MOCK = (daySinceInstalled - 1) * 37.45476 + dailGen_MOCK;
      setPV1(PV1_MOCK.toFixed(2));
      setPV2(PV2_MOCK.toFixed(2));
      setPV3(PV3_MOCK.toFixed(2));
      setDailGen(dailGen_MOCK.toFixed(2));
      setTotalGen(totalGen_MOCK.toFixed(2));
      setSaving((totalGen_MOCK * 5 * FT * 1.07).toFixed(2));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const data = {
    labels: ["PV-INV1", "PV-INV2", "PV-INV3"],
    datasets: [
      {
        label: "PV",
        data: [pv1, pv2, pv3],
        backgroundColor: "rgba(251,214,38,255)",
      },
    ],
  };

  return (
    <div className="w-full h-full">
      <div className="absolute top-[565px] left-[50px] w-[194px] h-[266px] text-yellow-text">
        <div className="h-[40px] flex items-center text-2xl px-3">Grid</div>
        <div className="h-[226px] flex-col space-y-1 px-3 py-1">
          <div class="flex justify-between">
            Vavg :<p class="text-white">{vavg}</p>V
          </div>
          <div class="flex justify-between">
            Aavg :<p class="text-white">{iavg}</p>A
          </div>
          <div class="flex justify-between">
            <pre>V-A :</pre>
            <p class="text-white">{vA}</p>V
          </div>
          <div class="flex justify-between">
            <pre>V-B :</pre>
            <p class="text-white">{vB}</p>V
          </div>
          <div class="flex justify-between">
            <pre>V-C :</pre>
            <p class="text-white">{vC}</p>V
          </div>
          <div class="flex justify-between">
            <pre>I-A :</pre>
            <p class="text-white">{iA}</p>A
          </div>
          <div class="flex justify-between">
            <pre>I-B :</pre>
            <p class="text-white">{iB}</p>A
          </div>
          <div class="flex justify-between">
            <pre>I-C :</pre>
            <p class="text-white">{iC}</p>A
          </div>
        </div>
      </div>

      <div className="absolute top-[40px] left-[335px] w-[427px] h-[158px] px-1">
        <div className="h-[35px] flex items-center justify-center text-yellow-text text-2xl px-2">
          Solar Panels
        </div>
        <div className="h-[123px]">
          <Bar options={options} data={data} height={200} />
        </div>
      </div>

      <div className="absolute top-[40px] left-[889px] w-[190px] h-[158px] text-yellow-text">
        <div className="h-[40px] flex items-center text-2xl px-2">
          <p>
            Inverter <span class="text-white">No.1</span>
          </p>
        </div>
        <div className="h-[226px] flex-col space-y-1 px-4">
          <div class="flex justify-between">
            <pre>Status</pre>
            <p class="text-white">{status1}</p>
          </div>
          <div class="flex justify-between">
            <pre>PV :</pre>
            <p class="text-white">{pv1}</p>W
          </div>
          <div class="flex justify-between">
            <pre>BATT :</pre>
            <p class="text-white"></p>
            {batt1}
          </div>
          <div class="flex justify-between">
            Temp :<p class="text-white">{temp1}</p>
            ํC
          </div>
        </div>
      </div>
      <div className="absolute top-[40px] left-[1093.5px] w-[190px] h-[158px] text-yellow-text">
        <div className="h-[40px] flex items-center text-2xl px-2">
          <p>
            Inverter <span class="text-white">No.2</span>
          </p>
        </div>
        <div className="h-[226px] flex-col space-y-1 px-4">
          <div class="flex justify-between">
            <pre>Status</pre>
            <p class="text-white">{status2}</p>
          </div>
          <div class="flex justify-between">
            <pre>PV :</pre>
            <p class="text-white">{pv2}</p>W
          </div>
          <div class="flex justify-between">
            <pre>BATT :</pre>
            <p class="text-white">{batt2}</p>%
          </div>
          <div class="flex justify-between">
            Temp :<p class="text-white">{temp2}</p>
            ํC
          </div>
        </div>
      </div>
      <div className="absolute top-[40px] left-[1296px] w-[190px] h-[158px] text-yellow-text">
        <div className="h-[40px] flex items-center text-2xl px-2">
          <p>
            Inverter <span class="text-white">No.3</span>
          </p>
        </div>
        <div className="h-[226px] flex-col space-y-1 px-4">
          <div class="flex justify-between">
            <pre>Status</pre>
            <p class="text-white">{status3}</p>
          </div>
          <div class="flex justify-between">
            <pre>PV :</pre>
            <p class="text-white">{pv3}</p>W
          </div>
          <div class="flex justify-between">
            <pre>BATT :</pre>
            <p class="text-white">{batt3}</p>%
          </div>
          <div class="flex justify-between">
            Temp :<p class="text-white">{temp3}</p>
            ํC
          </div>
        </div>
      </div>

      <div className="absolute top-[420px] left-[1195px] w-[300px] h-[247px] text-yellow-text">
        <div className="h-[70px] ps-2 flex items-center">
          <div>
            <p className="text-2xl">Energy Analytics</p>
            <p className="text-white text-xs font-bold">
              Kung Krabane Bay Royal Development project
            </p>
          </div>
        </div>
        <div className="h-[177px] flex-col space-y-3 p-2 text-lg">
          <div class="flex justify-between">
            <pre className="bg-yellow-bg text-black rounded-md px-2 py-2">
              Generated Today{" "}
            </pre>
            <p class="text-white">{dailGen}</p>
            kWh
          </div>
          <div class="flex justify-between">
            <pre className="bg-yellow-bg text-black rounded-md px-2 py-2">
              Total Energy Use{""}
            </pre>
            <p class="text-white">{totalGen}</p>
            kWh
          </div>
          <div class="flex justify-between">
            <pre className="bg-yellow-bg text-black rounded-md px-2 py-2">
              Total Savings{"   "}
            </pre>
            <p class="text-white">{saving}</p>฿
          </div>
        </div>
      </div>
      {bgMode == 0 ? (
        <video src={Video_Full} autoPlay loop muted />
      ) : bgMode == 1 ? (
        <video src={Grid_Only} autoPlay loop muted />
      ) : (
        <video src={PV_Only} autoPlay loop muted />
      )}
    </div>
  );
}

export default App;
