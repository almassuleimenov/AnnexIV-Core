"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, ShieldAlert, Cpu, Link as LinkIcon, HardDrive, Server, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AuditLog {
  time: string;
  model_id: string;
  trust_score: number;
  decision: string;
  cid_hash: string;
  tx_sig: string;
}

export default function Dashboard() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  const fetchLogs = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/history');
      setLogs(response.data.logs);
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 2000);
    return () => clearInterval(interval);
  }, []);

  // Подготавливаем данные для графика (переворачиваем, чтобы старые были слева, новые справа)
  const chartData = [...logs].reverse().map(log => ({
    time: log.time,
    Score: log.trust_score
  }));

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-300 p-8 font-mono selection:bg-green-500/30">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 border-b border-gray-800 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <ShieldCheck className="w-10 h-10 text-green-500" />
            AnnexIV.ai Core
          </h1>
          <p className="mt-2 text-gray-500 text-lg flex items-center gap-2">
            <Server className="w-4 h-4" /> Live Agentic RAG Monitor | Solana Devnet
          </p>
        </div>
        <div className="flex items-center gap-3 bg-[#111] border border-gray-800 px-4 py-2 rounded-lg shadow-lg">
          <Activity className="w-5 h-5 text-green-500 animate-pulse" />
          <span className="text-sm font-bold text-green-500 uppercase tracking-widest">System Online</span>
        </div>
      </div>
      {/* Статистика (Новые счетчики) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#111] border border-gray-800 rounded-xl p-5 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total On-Chain Audits</p>
            <p className="text-3xl font-bold text-white">{logs.length}</p>
          </div>
          <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
            <HardDrive className="w-6 h-6 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-[#111] border border-gray-800 rounded-xl p-5 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Compliant (EU Act)</p>
            <p className="text-3xl font-bold text-green-500">{logs.filter(l => l.trust_score >= 80).length}</p>
          </div>
          <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
            <ShieldCheck className="w-6 h-6 text-green-500" />
          </div>
        </div>

        <div className="bg-[#111] border border-gray-800 rounded-xl p-5 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">High Risk Detected</p>
            <p className="text-3xl font-bold text-red-500">{logs.filter(l => l.trust_score < 80).length}</p>
          </div>
          <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20">
            <ShieldAlert className="w-6 h-6 text-red-500" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* График Trust Score (Занимает 2/3 ширины) */}
        <div className="lg:col-span-2 bg-[#111] border border-gray-800 rounded-xl p-6 shadow-2xl h-[300px] flex flex-col">
          <h2 className="text-gray-400 text-sm uppercase tracking-wider mb-4 font-bold flex items-center gap-2">
            <Activity className="w-4 h-4" /> Динамика Trust Score
          </h2>
          <div className="flex-grow w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="time" stroke="#666" tick={{fill: '#666', fontSize: 12}} />
                  <YAxis domain={[0, 100]} stroke="#666" tick={{fill: '#666', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                    itemStyle={{ color: '#22c55e', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Score" 
                    stroke="#22c55e" 
                    strokeWidth={3} 
                    dot={{ fill: '#0a0a0a', stroke: '#22c55e', strokeWidth: 2, r: 4 }} 
                    activeDot={{ r: 6, fill: '#22c55e' }}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600">Ожидание данных...</div>
            )}
          </div>
        </div>

        {/* Инфо-панель (Занимает 1/3 ширины) */}
        <div className="bg-[#111] border border-gray-800 rounded-xl p-6 shadow-2xl flex flex-col justify-center items-center text-center">
          <div className="w-24 h-24 rounded-full border-4 border-gray-800 flex items-center justify-center mb-4">
             <span className="text-4xl font-bold text-white">
                {logs.length > 0 ? logs[0].trust_score : '--'}
             </span>
          </div>
          <h3 className="text-xl font-bold text-gray-300">Текущий Рейтинг</h3>
          <p className="text-sm text-gray-500 mt-2">
            {logs.length > 0 ? (logs[0].trust_score >= 80 ? 'Compliant with EU AI Act' : 'High Risk Detected') : 'Нет активных сессий'}
          </p>
        </div>
      </div>

      {/* Main Table */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-[#161616] border-b border-gray-800 text-gray-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium w-32">Time</th>
                  <th className="p-4 font-medium w-48">Model ID</th>
                  <th className="p-4 font-medium w-32">Trust Score</th>
                  <th className="p-4 font-medium min-w-[300px]">AI Agent Verdict</th>
                  <th className="p-4 font-medium w-48">Audit Trail (CID)</th>
                  <th className="p-4 font-medium w-48">Solana Tx</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {logs.map((log, i) => {
                  const isApproved = log.trust_score >= 80;
                  return (
                    <tr key={i} className="hover:bg-[#1a1a1a] transition-colors group">
                      <td className="p-4 text-gray-500 whitespace-nowrap">{log.time}</td>
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-blue-400" />
                        {log.model_id}
                      </td>
                      <td className="p-4">
                        <div className={`inline-flex items-center gap-1 font-bold text-lg ${isApproved ? 'text-green-500' : 'text-red-500'}`}>
                          {isApproved ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                          {log.trust_score}/100
                        </div>
                      </td>
                      <td className="p-4">
                        <p className={`text-sm leading-relaxed ${isApproved ? 'text-green-400/90' : 'text-red-400/90'}`}>
                          {log.decision}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-xs text-purple-400 bg-purple-500/10 px-2 py-1.5 rounded border border-purple-500/20 w-max font-mono">
                          <HardDrive className="w-3 h-3" />
                          {log.cid_hash ? `${log.cid_hash.substring(0, 12)}...` : 'Generating...'}
                        </div>
                      </td>
                      <td className="p-4">
                        <a 
                          href={`https://explorer.solana.com/tx/${log.tx_sig}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-all bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded border border-blue-500/20 w-max font-mono group-hover:border-blue-500/40"
                        >
                          <LinkIcon className="w-3 h-3" />
                          {log.tx_sig.substring(0, 12)}...
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {logs.length === 0 && (
            <div className="p-16 text-center text-gray-500">
              <Cpu className="w-16 h-16 mx-auto mb-4 opacity-20 animate-pulse" />
              <p className="text-2xl font-medium text-gray-400">Ожидание телеметрии...</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}