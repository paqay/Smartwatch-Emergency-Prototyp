import React, { useState, useEffect, useRef } from 'react';
import { Heart, Activity, AlertTriangle, Bluetooth, User, Wind, Thermometer, ChevronLeft, Battery, Wifi, ShieldAlert, Phone, TrendingUp, Clock } from 'lucide-react';

// --- HILFSKOMPONENTEN ---

// Simulierter EKG-Graph
const ECGGraph = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let x = 0;
    
    // Simuliert eine typische PQRST-Welle
    const drawECG = () => {
      if (x >= canvas.width) {
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        ctx.beginPath();
      }

      const yBase = canvas.height / 2;
      const amplitude = 30;
      
      // Zurück zur feineren Linie (wie vorher)
      ctx.lineWidth = 2; 
      ctx.strokeStyle = '#4ade80';
      ctx.lineCap = 'round';
      
      const beatCycle = x % 100;
      let y = yBase;

      if (beatCycle > 10 && beatCycle < 20) y -= 5;
      else if (beatCycle > 25 && beatCycle < 30) y += 5;
      else if (beatCycle >= 30 && beatCycle < 35) y -= amplitude;
      else if (beatCycle >= 35 && beatCycle < 40) y += 15;
      else if (beatCycle > 50 && beatCycle < 60) y -= 10;
      else y += (Math.random() - 0.5) * 2;

      ctx.lineTo(x, y);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      
      x += 2;
      animationFrameId = requestAnimationFrame(drawECG);
    };

    drawECG();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return <canvas ref={canvasRef} width={280} height={80} className="w-full h-20" />;
};

// --- SCREENS ---

// 1. Pairing Screen (Zurück zum ursprünglichen Design)
const PairingScreen = ({ onPair }) => {
  const [status, setStatus] = useState('scanning'); 

  useEffect(() => {
    const timer1 = setTimeout(() => setStatus('found'), 2500);
    return () => clearTimeout(timer1);
  }, []);

  const handleConnect = () => {
    setStatus('connecting');
    setTimeout(onPair, 1500);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-slate-950 p-6 animate-fade-in relative overflow-hidden">
      
      {status === 'scanning' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 border border-blue-500/30 rounded-full animate-ping opacity-20" />
          <div className="absolute w-48 h-48 border border-blue-500/40 rounded-full animate-ping delay-75 opacity-20" />
        </div>
      )}

      <div className="z-10 flex flex-col items-center text-center space-y-6">
        <div className={`p-4 rounded-full transition-all duration-500 ${status === 'scanning' ? 'bg-blue-900/20 text-blue-400' : 'bg-green-500 text-white'}`}>
           <Bluetooth size={48} className={status === 'scanning' ? 'animate-pulse' : ''} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-2">
            {status === 'scanning' && 'Suche Signal...'}
            {status === 'found' && 'Patient gefunden'}
            {status === 'connecting' && 'Kopple Geräte...'}
          </h2>
          <p className="text-xs text-slate-400">Notfall-Protokoll aktiv</p>
        </div>

        {status === 'found' && (
          <div className="bg-slate-900 w-full p-3 rounded-xl border border-slate-700 animate-slide-up">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                <User size={20} className="text-slate-300" />
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-sm">Max Mustermann</p>
                <p className="text-xs text-red-400 font-bold flex items-center gap-1">
                  <AlertTriangle size={10} /> KRITISCH
                </p>
              </div>
            </div>
            <button 
              onClick={handleConnect}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-bold text-sm transition-colors"
            >
              VERBINDEN
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 2. Main Dashboard (Vitals)
const DashboardScreen = ({ navigate }) => {
  return (
    <div className="h-full flex flex-col bg-slate-950 animate-fade-in">
      {/* Top Header: Jetzt komplett klickbar */}
      <div 
        onClick={() => navigate('history')}
        className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center cursor-pointer active:bg-slate-800 transition-colors group"
      >
        <div>
          <h3 className="text-white font-bold text-sm">M. Mustermann</h3>
          <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Notfall</span>
        </div>
        {/* Button-Optik bleibt, aber als Div, damit Klick-Event vom Parent greift */}
        <div className="bg-white p-2 rounded-full text-red-600 shadow-lg shadow-white/5 group-active:scale-95 transition-transform">
          <ShieldAlert size={20} />
        </div>
      </div>

      {/* Grid Layout: Kompakt, aber mit NEUEN TILES (Optik/Schrift) */}
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-1 bg-slate-950 p-1">
        
        {/* Herzfrequenz: Neue Optik (größere Schrift, Rahmen) */}
        <div className="bg-red-500/10 rounded-xl p-3 flex flex-col justify-between relative active:bg-red-500/20 transition-colors cursor-pointer border border-transparent active:border-red-500/30" onClick={() => navigate('ecg')}>
          <div className="flex justify-between items-start">
            <Heart size={20} className="text-red-500 fill-current animate-pulse" />
            <span className="text-xs text-red-200/50 font-bold uppercase">BPM</span>
          </div>
          <div className="text-center">
            <span className="text-4xl font-bold text-white tracking-tighter">124</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden">
             <div className="h-full bg-red-500 w-[80%]" />
          </div>
        </div>

        {/* SpO2: Neue Optik (größere Schrift, Badge) */}
        <div className="bg-cyan-500/10 rounded-xl p-3 flex flex-col justify-between active:bg-cyan-500/20 transition-colors cursor-pointer border border-transparent active:border-cyan-500/30" onClick={() => navigate('spo2')}>
          <div className="flex justify-between items-start">
            <Wind size={20} className="text-cyan-400" />
            <span className="text-xs text-cyan-200/50 font-bold uppercase">SpO2</span>
          </div>
          <div className="text-center">
            <span className="text-4xl font-bold text-cyan-400 tracking-tighter">91<span className="text-lg text-cyan-400/60">%</span></span>
          </div>
          {/* Badge jetzt animiert */}
          <div className="bg-yellow-500/20 rounded px-2 py-0.5 self-center animate-pulse">
             <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider">NIEDRIG</p>
          </div>
        </div>

        {/* Blutdruck: Neue Optik (größere Schrift) */}
        <div className="bg-orange-500/10 rounded-xl p-3 flex flex-col justify-between active:bg-orange-500/20 transition-colors cursor-pointer border border-transparent active:border-orange-500/30" onClick={() => navigate('bp')}>
          <div className="flex justify-between items-start">
            <Activity size={20} className="text-orange-400" />
            <span className="text-xs text-orange-200/50 font-bold uppercase">RR</span>
          </div>
          <div className="text-center mt-1">
            <span className="text-2xl font-bold text-white block leading-none">155</span>
            <div className="w-full h-[1px] bg-orange-500/20 my-1" />
            <span className="text-2xl font-bold text-orange-100 block leading-none">95</span>
          </div>
        </div>

        {/* Temperatur: Neue Optik (Zentriert, größer) */}
        <div className="bg-slate-500/10 rounded-xl p-3 flex flex-col active:bg-slate-500/20 transition-colors cursor-pointer border border-transparent active:border-slate-500/30" onClick={() => navigate('temp')}>
           <div className="flex justify-between items-start">
            <Thermometer size={20} className="text-white" />
            <span className="text-xs text-slate-400 font-bold uppercase">TEMP</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
             <div className="text-center">
                <span className="text-4xl font-bold text-white tracking-tighter">38.1</span>
                <span className="text-sm text-slate-500 ml-1 font-medium">°C</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. EKG Detail Screen (Zurück zum kompakten Header)
const ECGDetailScreen = ({ goBack }) => {
  return (
    <div className="h-full flex flex-col bg-slate-950 animate-slide-up relative">
      <div className="pt-2 px-3 pb-2 flex items-center gap-3">
        <button onClick={goBack} className="p-2 bg-slate-800 rounded-full text-slate-300 hover:text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-base font-bold text-green-400 flex items-center gap-2 leading-tight">
            <Activity size={18} /> Live EKG
          </h2>
          <p className="text-[10px] text-slate-400 leading-none">Ableitung II • 25mm/s</p>
        </div>
      </div>

      <div className="flex-1 bg-slate-900 border-y border-slate-800 relative flex items-center overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)', 
               backgroundSize: '20px 20px' 
             }} 
        />
        <ECGGraph />
      </div>

      <div className="p-4 grid grid-cols-2 gap-4">
        <div className="bg-slate-900 p-2 rounded-lg text-center">
            <span className="text-xs text-slate-400 uppercase block mb-1">HF</span>
            <span className="text-2xl font-bold text-red-500">124</span>
            <span className="text-[10px] text-slate-500 block">Tachykardie</span>
        </div>
        <div className="bg-slate-900 p-2 rounded-lg text-center">
            <span className="text-xs text-slate-400 uppercase block mb-1">QTc</span>
            <span className="text-2xl font-bold text-green-400">440</span>
            <span className="text-[10px] text-slate-500 block">Normal</span>
        </div>
      </div>
    </div>
  );
};

// NEU: SpO2 Detail Screen (Korrigierte Werte/Graph)
const SpO2DetailScreen = ({ goBack }) => {
  return (
    <div className="h-full flex flex-col bg-slate-950 animate-slide-up relative">
      <div className="pt-2 px-3 pb-2 flex items-center gap-3">
        <button onClick={goBack} className="p-2 bg-slate-800 rounded-full text-slate-300 hover:text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-base font-bold text-cyan-400 flex items-center gap-2 leading-tight">
            <Wind size={18} /> Sauerstoff
          </h2>
          <p className="text-[10px] text-slate-400 leading-none">Letzte 30 Minuten</p>
        </div>
      </div>

      <div className="flex-1 px-4 flex items-center justify-center">
         {/* Graph Scale: Y=0 is 100%, Y=100 is 90% */}
         <div className="w-full h-32 relative border-l border-b border-slate-700">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
               {/* 95% Line at 50% height */}
               <line x1="0" y1="50" x2="100" y2="50" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
               
               {/* Graph Path: Starts at 98% (y=20), Ends at 91% (y=90) */}
               <polyline 
                 points="0,20 20,25 40,40 60,60 80,80 100,90" 
                 fill="none" 
                 stroke="#22d3ee" 
                 strokeWidth="3" 
                 strokeLinecap="round"
               />
               
               {/* Current Dot at 91% (y=90) */}
               <circle cx="100" cy="90" r="4" fill="#22d3ee" className="animate-pulse" />
            </svg>
            
            {/* Y-Axis Labels matching the new scale */}
            <div className="absolute -left-7 top-[-5px] text-[10px] text-slate-500">100%</div>
            <div className="absolute -left-6 top-[45%] text-[10px] text-slate-500">95%</div>
            <div className="absolute -left-6 bottom-[-5px] text-[10px] text-cyan-400 font-bold">91%</div>
         </div>
      </div>

      <div className="p-4 bg-slate-900 m-3 rounded-xl">
        <div className="flex items-start gap-3">
           <AlertTriangle size={20} className="text-yellow-500 shrink-0" />
           <div>
             <span className="text-white text-sm font-bold block">Hypoxie-Warnung</span>
             <span className="text-slate-400 text-xs leading-tight block mt-1">Sättigung fällt kontinuierlich. Sauerstoffgabe empfohlen.</span>
           </div>
        </div>
      </div>
    </div>
  );
};

// NEU: Blutdruck Detail Screen (Zurück zum kompakten Header)
const BPDetailScreen = ({ goBack }) => {
  return (
    <div className="h-full flex flex-col bg-slate-950 animate-slide-up relative">
      <div className="pt-2 px-3 pb-2 flex items-center gap-3">
        <button onClick={goBack} className="p-2 bg-slate-800 rounded-full text-slate-300 hover:text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-base font-bold text-orange-400 flex items-center gap-2 leading-tight">
            <Activity size={18} /> Blutdruck
          </h2>
          <p className="text-[10px] text-slate-400 leading-none">Trend • Letzte 15 Min</p>
        </div>
      </div>

      <div className="flex-1 px-4 flex flex-col justify-center items-center">
         {/* SVG Range Bar Chart */}
         <div className="w-full h-40 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 185 100" preserveAspectRatio="none">
               <defs>
                 <linearGradient id="bpGradient" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#fb923c" /> {/* Orange-400 */}
                   <stop offset="100%" stopColor="#c2410c" /> {/* Orange-700 */}
                 </linearGradient>
               </defs>

               {/* Grid Lines */}
               <line x1="0" y1="20" x2="160" y2="20" stroke="#334155" strokeWidth="0.5" strokeDasharray="4 4" />
               <line x1="0" y1="50" x2="160" y2="50" stroke="#334155" strokeWidth="0.5" strokeDasharray="4 4" />
               <line x1="0" y1="80" x2="160" y2="80" stroke="#334155" strokeWidth="0.5" strokeDasharray="4 4" />
               
               {/* Labels on right (Axis) */}
               <text x="165" y="22" className="text-[8px] fill-slate-500" textAnchor="start">160</text>
               <text x="165" y="52" className="text-[8px] fill-slate-500" textAnchor="start">120</text>
               <text x="165" y="82" className="text-[8px] fill-slate-500" textAnchor="start">80</text>

               {/* Data Bars */}
               
               {/* -15m: 130 / 85 */}
               <g className="opacity-60">
                 <rect x="20" y="42" width="16" height="34" rx="4" fill="url(#bpGradient)" />
                 <text x="28" y="38" className="text-[8px] fill-orange-200" textAnchor="middle">130</text>
                 <text x="28" y="86" className="text-[8px] fill-slate-400" textAnchor="middle">85</text>
                 {/* X-Label inside SVG */}
                 <text x="28" y="95" className="text-[8px] fill-slate-500" textAnchor="middle">-15m</text>
               </g>

               {/* -10m: 135 / 88 */}
               <g className="opacity-80">
                 <rect x="55" y="38" width="16" height="36" rx="4" fill="url(#bpGradient)" />
                 <text x="63" y="34" className="text-[8px] fill-orange-200" textAnchor="middle">135</text>
                 <text x="63" y="84" className="text-[8px] fill-slate-400" textAnchor="middle">88</text>
                 {/* X-Label inside SVG */}
                 <text x="63" y="95" className="text-[8px] fill-slate-500" textAnchor="middle">-10m</text>
               </g>

               {/* -5m: 142 / 90 */}
               <g>
                 <rect x="90" y="33" width="16" height="39" rx="4" fill="url(#bpGradient)" />
                 <text x="98" y="29" className="text-[8px] fill-orange-200" textAnchor="middle">142</text>
                 <text x="98" y="82" className="text-[8px] fill-slate-400" textAnchor="middle">90</text>
                 {/* X-Label inside SVG */}
                 <text x="98" y="95" className="text-[8px] fill-slate-500" textAnchor="middle">-5m</text>
               </g>

               {/* JETZT: 155 / 95 */}
               <g>
                 <rect x="125" y="24" width="16" height="45" rx="4" fill="#fb923c" className="animate-pulse" stroke="white" strokeWidth="1" />
                 <text x="133" y="20" className="text-[9px] font-bold fill-white" textAnchor="middle">155</text>
                 <text x="133" y="80" className="text-[9px] font-bold fill-white" textAnchor="middle">95</text>
                 {/* X-Label inside SVG */}
                 <text x="133" y="95" className="text-[9px] font-bold fill-orange-400" textAnchor="middle">Jetzt</text>
               </g>
            </svg>
         </div>
      </div>

      <div className="p-3 grid grid-cols-2 gap-3 pb-6">
         <div className="bg-slate-900 p-3 rounded-xl text-center">
           <span className="text-xs text-slate-400 uppercase">MAP</span>
           <span className="block text-2xl font-bold text-white">115</span>
           <span className="text-[10px] text-orange-400">Kritisch Hoch</span>
         </div>
         <div className="bg-slate-900 p-3 rounded-xl text-center">
           <span className="text-xs text-slate-400 uppercase">Pulsdruck</span>
           <span className="block text-2xl font-bold text-slate-200">60</span>
           <span className="text-[10px] text-slate-500">mmHg (Erweitert)</span>
         </div>
      </div>
    </div>
  );
};

// NEU: Temperatur Detail Screen (Zurück zum kompakten Header)
const TempDetailScreen = ({ goBack }) => {
  return (
    <div className="h-full flex flex-col bg-slate-950 animate-slide-up relative">
      <div className="pt-2 px-3 pb-2 flex items-center gap-3">
        <button onClick={goBack} className="p-2 bg-slate-800 rounded-full text-slate-300 hover:text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-base font-bold text-slate-200 flex items-center gap-2 leading-tight">
            <Thermometer size={18} /> Temperatur
          </h2>
          <p className="text-[10px] text-slate-400 leading-none">Letzte 24h</p>
        </div>
      </div>

      {/* Padding rechts erhöht (pr-8), damit die Zahlen nicht abgeschnitten werden */}
      <div className="flex-1 pl-4 pr-8 flex items-center justify-center">
         <div className="w-full relative mt-2">
            <div className="h-32 w-full relative">
                {/* Smooth Line Chart SVG */}
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </linearGradient>
                </defs>
                
                {/* Background Grid Lines */}
                <line x1="0" y1="10" x2="100" y2="10" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="0" y1="30" x2="100" y2="30" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
                
                {/* Area under curve */}
                <path 
                    d="M0,42 C25,42 45,38 65,20 S90,8 100,5 L100,50 L0,50 Z" 
                    fill="url(#tempGradient)" 
                />
                
                {/* The Smooth Line */}
                <path 
                    d="M0,42 C25,42 45,38 65,20 S90,8 100,5" 
                    fill="none" 
                    stroke="#ef4444" 
                    strokeWidth="1.5" 
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                />
                
                {/* Current Point */}
                <circle cx="100" cy="5" r="2.5" fill="#ef4444" stroke="white" strokeWidth="1" className="animate-pulse" />
                </svg>
                
                {/* Axis Labels (Absolute positioning relative to chart height) */}
                <div className="absolute top-[-5px] -right-2 text-[9px] text-slate-500">38.5°</div>
                <div className="absolute top-[35%] -right-2 text-[9px] text-slate-500">37.5°</div>
                <div className="absolute bottom-0 -right-2 text-[9px] text-slate-500">36.5°</div>
            </div>
            
            {/* X-Axis Labels (Natural flow below chart) */}
            <div className="flex justify-between text-[10px] text-slate-500 mt-3 border-t border-slate-800 pt-1 pb-2">
               <span>-24h</span>
               <span>-12h</span>
               <span>Jetzt</span>
            </div>
         </div>
      </div>

      <div className="p-4 mx-3 mb-4 bg-slate-900 rounded-xl border-l-4 border-red-500 shrink-0">
         <div className="flex justify-between items-center mb-1">
           <span className="text-slate-300 font-bold text-sm">Fieber Anstieg</span>
           <TrendingUp size={16} className="text-red-500" />
         </div>
         <p className="text-slate-400 text-xs">
           Temperatur ist in den letzten 4 Stunden um 1.2°C gestiegen. Kühlung vorbereiten.
         </p>
      </div>
    </div>
  );
};

// 4. Medical History / ID Screen (Zurück zum ursprünglichen Design)
const MedicalHistoryScreen = ({ goBack }) => {
  return (
     <div className="h-full flex flex-col bg-slate-950 animate-slide-up relative">
      <div className="bg-red-600 px-2 pt-4 pb-3 rounded-b-2xl shadow-lg shadow-red-900/20 flex items-center justify-between gap-2">
        <button onClick={goBack} className="text-white/80 hover:text-white shrink-0">
          <ChevronLeft size={28} />
        </button>
        {/* Icon hier entfernt, Titel nimmt den Platz ein */}
        <h1 className="text-white font-bold text-lg leading-tight w-full text-center pr-8">Notfall-Infos</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Kritische Warnung */}
        <div className="bg-yellow-500/10 border border-yellow-500/50 p-3 rounded-xl flex gap-3 items-start">
           <AlertTriangle size={20} className="text-yellow-500 shrink-0 mt-0.5" />
           <div>
             <span className="text-yellow-500 font-bold text-sm block">ALLERGIE</span>
             <span className="text-white text-sm">Penicillin, Nüsse (Anaphylaxie)</span>
           </div>
        </div>

        {/* Blutgruppe */}
        <div className="bg-slate-900 p-3 rounded-xl flex items-center justify-between">
           <span className="text-slate-400 text-sm">Blutgruppe</span>
           <span className="text-white font-bold text-xl bg-slate-800 px-3 py-1 rounded-lg">A Rhesus-</span>
        </div>

        {/* Medikation */}
        <div className="bg-slate-900 p-4 rounded-xl">
           <h4 className="text-slate-400 text-xs uppercase font-bold mb-3">Aktuelle Medikation</h4>
           <ul className="space-y-2">
             <li className="flex justify-between items-center border-b border-slate-800 pb-2">
               <span className="text-white text-sm">Bisoprolol</span>
               <span className="text-slate-500 text-xs">5mg (Morgens)</span>
             </li>
             <li className="flex justify-between items-center border-b border-slate-800 pb-2">
               <span className="text-white text-sm">Insulin</span>
               <span className="text-slate-500 text-xs">Bei Bedarf</span>
             </li>
           </ul>
        </div>
        
        {/* Vorerkrankung */}
        <div className="bg-slate-900 p-4 rounded-xl">
           <h4 className="text-slate-400 text-xs uppercase font-bold mb-2">Diagnosen</h4>
           <div className="flex flex-wrap gap-2">
             <span className="bg-slate-800 text-slate-200 text-xs px-2 py-1 rounded">Hypertonie</span>
             <span className="bg-slate-800 text-slate-200 text-xs px-2 py-1 rounded">Diabetes Typ 2</span>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- APP CONTAINER ---

const App = () => {
  const [screen, setScreen] = useState('pairing'); 
  
  const navigate = (to) => setScreen(to);

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center font-sans p-4">
      
      {/* Smartwatch Gehäuse Simulation (Apple Watch Style) */}
      <div className="relative transform scale-100">
        
        {/* Armband */}
        <div className="absolute top-[-55px] left-1/2 -translate-x-1/2 w-[180px] h-24 bg-slate-700 rounded-t-[2.5rem] z-0 shadow-inner" />
        <div className="absolute bottom-[-55px] left-1/2 -translate-x-1/2 w-[180px] h-24 bg-slate-700 rounded-b-[2.5rem] z-0 shadow-inner" />

        {/* Gehäuse */}
        <div className="relative w-[300px] h-[370px] bg-zinc-800 rounded-[3rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] p-3 z-10 box-border ring-1 ring-white/10">
            
            {/* Digital Crown */}
            <div 
              className="absolute -right-[12px] top-[45px] w-4 h-10 bg-zinc-700 rounded-r-md border-l border-black/50 shadow-md cursor-pointer hover:bg-zinc-600 transition-colors flex flex-col justify-center gap-[2px] overflow-hidden group"
              onClick={() => setScreen('pairing')}
              title="Home / Reset"
            >
               {[...Array(6)].map((_, i) => (
                 <div key={i} className="w-full h-[1px] bg-zinc-500/50" />
               ))}
               <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-red-500/80 border border-black/20" /> 
            </div>

            {/* Side Button */}
            <div 
              className="absolute -right-[4px] top-[100px] w-1.5 h-14 bg-zinc-700 rounded-r-lg shadow-sm"
            />

            {/* Bildschirm Bereich (OLED Deep Black) */}
            <div className="w-full h-full bg-black rounded-[2.3rem] overflow-hidden relative ring-4 ring-black">
              
              {/* Status Bar */}
              <div className="absolute top-3 left-0 w-full px-5 flex justify-between items-center z-20 pointer-events-none">
                <span className="text-[10px] font-medium text-slate-400">10:09</span>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" title="Notfall Modus Aktiv" />
                </div>
              </div>

              {/* Screen Content Router */}
              <div className="pt-8 h-full">
                {screen === 'pairing' && <PairingScreen onPair={() => setScreen('dashboard')} />}
                {screen === 'dashboard' && <DashboardScreen navigate={navigate} />}
                {screen === 'ecg' && <ECGDetailScreen goBack={() => setScreen('dashboard')} />}
                {screen === 'spo2' && <SpO2DetailScreen goBack={() => setScreen('dashboard')} />}
                {screen === 'bp' && <BPDetailScreen goBack={() => setScreen('dashboard')} />}
                {screen === 'temp' && <TempDetailScreen goBack={() => setScreen('dashboard')} />}
                {screen === 'history' && <MedicalHistoryScreen goBack={() => setScreen('dashboard')} />}
              </div>

            </div>
            
            {/* Bildschirm-Reflektion */}
            <div className="absolute top-0 left-0 right-0 h-[140px] bg-gradient-to-b from-white/10 via-white/5 to-transparent rounded-t-[2.8rem] pointer-events-none z-30" />
            <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-t from-white/5 to-transparent rounded-b-[2.8rem] pointer-events-none z-30" />
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-up { animation: slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default App;