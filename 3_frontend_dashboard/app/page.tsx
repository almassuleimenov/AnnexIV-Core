"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, ShieldAlert, Cpu, Link as LinkIcon, HardDrive, Server, Activity, FileDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf'; // ИМПОРТ ГЕНЕРАТОРА PDF

interface AuditLog {
  time: string;
  model_id: string;
  trust_score: number;
  decision: string;
  comprehensive_analysis?: string;
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

  const chartData = [...logs].reverse().map(log => ({
    time: log.time,
    Score: log.trust_score
  }));

  const isDanger = logs.length > 0 && logs[0].trust_score < 80;

  // 📄 ГЕНЕРАЦИЯ PDF НА ОСНОВЕ ГЛУБОКОГО АНАЛИЗА ИИ
  const downloadPDF = (log: AuditLog) => {
    const doc = new jsPDF();
    const isApproved = log.trust_score >= 80;

    // Шапка документа
    doc.setFontSize(22);
    doc.setTextColor(isApproved ? 34 : 220, isApproved ? 197 : 38, isApproved ? 94 : 38);
    doc.text("AnnexIV - AI Legal Audit Report", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toUTCString()}`, 14, 28);
    doc.text("Regulatory Framework: EU AI Act (Annex IV)", 14, 34);

    doc.setLineWidth(0.5);
    doc.line(14, 38, 196, 38);

    // 1. Идентификация системы
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("1. System Identification", 14, 48);
    doc.setFontSize(11);
    doc.text(`Model ID: ${log.model_id}`, 14, 56);
    doc.text(`Audit Timestamp: ${log.time}`, 14, 62);
    doc.text(`Overall Trust Score: ${log.trust_score} / 100`, 14, 68);

    // 2. ГЛУБОКИЙ АНАЛИЗ ОТ ИИ (Agentic RAG)
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("2. Agentic RAG Analysis (Llama 3.3)", 14, 82);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40);
    
    // Берем умный текст от ИИ или заглушку
    const analysisText = log.comprehensive_analysis || log.decision;
    
    // Разбиваем длинный текст от ИИ на строки, чтобы они влезали на лист А4
    const splitAnalysis = doc.splitTextToSize(analysisText, 180);
    doc.text(splitAnalysis, 14, 90);

    // 3. Криптографические доказательства (Блокчейн)
    // Динамически вычисляем отступ вниз в зависимости от того, сколько текста написал ИИ
    const yAfterText = 90 + (splitAnalysis.length * 5) + 15;
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("3. On-Chain Proofs (Solana & IPFS)", 14, yAfterText);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Solana Tx Signature: ${log.tx_sig}`, 14, yAfterText + 8);
    doc.text(`IPFS CID: ${log.cid_hash}`, 14, yAfterText + 14);

    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150);
    doc.text("Note: This document is derived directly from immutable on-chain records.", 14, yAfterText + 26);

    // Сохраняем
    doc.save(`AnnexIV_Legal_Report_${log.model_id}.pdf`);
  };

  return (
    <main className={`min-h-screen p-8 font-mono selection:bg-green-500/30 transition-all duration-1000 ${isDanger ? 'bg-[#120404] shadow-[inset_0_0_200px_rgba(220,38,38,0.15)]' : 'bg-[#0a0a0a]'}`}>
      
      {isDanger && (
        <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center py-2 font-bold uppercase tracking-widest z-50 flex items-center justify-center gap-4 shadow-[0_0_30px_rgba(220,38,38,0.8)] animate-pulse border-b-2 border-red-400">
          <ShieldAlert className="w-6 h-6" />
          CRITICAL: EU AI ACT VIOLATION DETECTED. ON-CHAIN AUDIT FAILED.
          <ShieldAlert className="w-6 h-6" />
        </div>
      )}

      {/* Header */}
      <div className={`max-w-7xl mx-auto mb-8 border-b ${isDanger ? 'border-red-900/50 mt-8' : 'border-gray-800'} pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-500`}>
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            {isDanger ? <ShieldAlert className="w-10 h-10 text-red-500 animate-bounce" /> : <ShieldCheck className="w-10 h-10 text-green-500" />}
            AnnexIV.ai Core
          </h1>
          <p className="mt-2 text-gray-500 text-lg flex items-center gap-2">
            <Server className="w-4 h-4" /> Live Agentic RAG Monitor | Solana Devnet
          </p>
        </div>
        
        {/* НОВАЯ ПАНЕЛЬ С КНОПКОЙ PDF */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {logs.length > 0 && (
            <button 
              onClick={() => downloadPDF(logs[0])}
              className="flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600 border border-blue-500/50 text-blue-400 hover:text-white px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-lg uppercase tracking-wider"
            >
              <FileDown className="w-4 h-4" />
              Download Latest PDF
            </button>
          )}
          <div className={`flex items-center gap-3 px-4 py-2 rounded-lg shadow-lg border transition-colors duration-500 ${isDanger ? 'bg-red-950/50 border-red-800' : 'bg-[#111] border-gray-800'}`}>
            <Activity className={`w-5 h-5 animate-pulse ${isDanger ? 'text-red-500' : 'text-green-500'}`} />
            <span className={`text-sm font-bold uppercase tracking-widest ${isDanger ? 'text-red-500' : 'text-green-500'}`}>
              {isDanger ? 'SYSTEM LOCKDOWN' : 'System Online'}
            </span>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`bg-[#111] border rounded-xl p-5 flex items-center justify-between shadow-lg transition-colors ${isDanger ? 'border-red-900/30' : 'border-gray-800'}`}>
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total On-Chain Audits</p>
            <p className="text-3xl font-bold text-white">{logs.length}</p>
          </div>
          <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
            <HardDrive className="w-6 h-6 text-blue-500" />
          </div>
        </div>
        
        <div className={`bg-[#111] border rounded-xl p-5 flex items-center justify-between shadow-lg transition-colors ${isDanger ? 'border-red-900/30' : 'border-gray-800'}`}>
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Compliant (EU Act)</p>
            <p className="text-3xl font-bold text-green-500">{logs.filter(l => l.trust_score >= 80).length}</p>
          </div>
          <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
            <ShieldCheck className="w-6 h-6 text-green-500" />
          </div>
        </div>

        <div className={`bg-[#111] border rounded-xl p-5 flex items-center justify-between shadow-lg transition-colors ${isDanger ? 'border-red-500/50 bg-red-950/20' : 'border-gray-800'}`}>
          <div>
            <p className={`${isDanger ? 'text-red-400' : 'text-gray-500'} text-xs font-bold uppercase tracking-wider mb-1`}>High Risk Detected</p>
            <p className="text-3xl font-bold text-red-500">{logs.filter(l => l.trust_score < 80).length}</p>
          </div>
          <div className="bg-red-500/20 p-3 rounded-lg border border-red-500/50 animate-pulse">
            <ShieldAlert className="w-6 h-6 text-red-500" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* График Trust Score */}
        <div className={`lg:col-span-2 bg-[#111] border rounded-xl p-6 shadow-2xl h-[300px] flex flex-col transition-colors ${isDanger ? 'border-red-900/50' : 'border-gray-800'}`}>
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
                    contentStyle={{ backgroundColor: '#1a1a1a', border: isDanger ? '1px solid #ef4444' : '1px solid #333', borderRadius: '8px' }}
                    itemStyle={{ color: isDanger ? '#ef4444' : '#22c55e', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Score" 
                    stroke={isDanger ? "#ef4444" : "#22c55e"} 
                    strokeWidth={4} 
                    dot={{ fill: '#0a0a0a', stroke: isDanger ? '#ef4444' : '#22c55e', strokeWidth: 2, r: 4 }} 
                    activeDot={{ r: 8, fill: isDanger ? '#ef4444' : '#22c55e' }}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600">Ожидание данных...</div>
            )}
          </div>
        </div>

        {/* Инфо-панель (Центральный виджет) */}
        <div className={`bg-[#111] border rounded-xl p-6 shadow-2xl flex flex-col justify-center items-center text-center transition-all duration-500 ${isDanger ? 'border-red-500 shadow-[0_0_50px_rgba(220,38,38,0.2)]' : 'border-gray-800'}`}>
          <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center mb-4 transition-all duration-500 ${isDanger ? 'border-red-500 bg-red-500/10 shadow-[0_0_30px_rgba(220,38,38,0.5)]' : 'border-gray-800'}`}>
             <span className={`text-5xl font-bold ${isDanger ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                {logs.length > 0 ? logs[0].trust_score : '--'}
             </span>
          </div>
          <h3 className="text-xl font-bold text-gray-300">Статус Системы</h3>
          <p className={`text-sm mt-2 font-bold ${isDanger ? 'text-red-500 uppercase tracking-wide' : 'text-gray-500'}`}>
            {logs.length > 0 ? (logs[0].trust_score >= 80 ? 'Compliant with EU AI Act' : 'RESTRICTED: HIGH BIAS DETECTED') : 'Нет активных сессий'}
          </p>
        </div>
      </div>

      {/* Main Table */}
      <div className="max-w-7xl mx-auto">
        <div className={`bg-[#111] border rounded-xl overflow-hidden shadow-2xl transition-colors ${isDanger ? 'border-red-900/50' : 'border-gray-800'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-[#161616] border-b border-gray-800 text-gray-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium w-24">Report</th>
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
                    <tr key={i} className={`transition-colors group ${i === 0 && isDanger ? 'bg-red-950/30' : 'hover:bg-[#1a1a1a]'}`}>
                      {/* НОВАЯ КНОПКА СКАЧИВАНИЯ В ТАБЛИЦЕ */}
                      <td className="p-4">
                        <button 
                          onClick={() => downloadPDF(log)}
                          title="Download PDF"
                          className="bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white p-2 rounded transition-colors"
                        >
                          <FileDown className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="p-4 text-gray-500 whitespace-nowrap">{log.time}</td>
                      <td className="p-4 font-bold text-white flex items-center gap-2 mt-1">
                        <Cpu className="w-4 h-4 text-blue-400" />
                        {log.model_id}
                      </td>
                      <td className="p-4">
                        <div className={`inline-flex items-center gap-1 font-bold text-lg ${isApproved ? 'text-green-500' : 'text-red-500'}`}>
                          {isApproved ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5 animate-pulse" />}
                          {log.trust_score}/100
                        </div>
                      </td>
                      <td className="p-4">
                        <p className={`text-sm leading-relaxed ${isApproved ? 'text-green-400/90' : 'text-red-400 font-bold'}`}>
                          {log.decision}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-xs text-purple-400 bg-purple-500/10 px-2 py-1.5 rounded border border-purple-500/20 w-max font-mono">
                          <HardDrive className="w-3 h-3" />
                          <a href={`https://gateway.pinata.cloud/ipfs/${log.cid_hash}`} target="_blank" rel="noreferrer" className="hover:text-purple-300">
                            {log.cid_hash ? `${log.cid_hash.substring(0, 12)}...` : 'Generating...'}
                          </a>
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