/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { PageId, SimulationParameters, Kitchen, DecisionLogEntry } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { RingkasanPage } from './pages/RingkasanPage';
import { AntreanMingguanPage } from './pages/AntreanMingguanPage';
import { DetailKasusPage } from './pages/DetailKasusPage';
import { SimulatorAmbangPage } from './pages/SimulatorAmbangPage';
import { KamusRedFlagPage } from './pages/KamusRedFlagPage';
import { ErrorVsFraudPage } from './pages/ErrorVsFraudPage';
import { IndikatorPilotPage } from './pages/IndikatorPilotPage';
import { LogoShowcasePage } from './pages/LogoShowcasePage';
import { LandingPage } from './pages/LandingPage';
import {
  generateSyntheticKitchens,
  computeSimulationMetrics,
  getHistoricalWeeksSummary,
  DEFAULT_SIMULATION_PARAMETERS
} from './utils/syntheticData';
import { INITIAL_DECISION_LOGS } from './utils/decisionStore';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('landing');
  const [params, setParams] = useState<SimulationParameters>(DEFAULT_SIMULATION_PARAMETERS);
  const [decisionLogs, setDecisionLogs] = useState<DecisionLogEntry[]>(INITIAL_DECISION_LOGS);

  // Single Source of Truth: 500 kitchens generated deterministically from params
  const kitchens = useMemo(() => {
    return generateSyntheticKitchens(params, 4);
  }, [params]);

  // Derived simulation metrics (FP, FN, Presisi, Withheld Funds, etc.)
  const metrics = useMemo(() => {
    return computeSimulationMetrics(kitchens, params);
  }, [kitchens, params]);

  // Historical 4-week trend (Minggu 1-4 strictly sum to 500)
  const trendData = useMemo(() => {
    return getHistoricalWeeksSummary(kitchens, params);
  }, [kitchens, params]);

  // Selected kitchen for Detail Kasus
  const [selectedKitchenId, setSelectedKitchenId] = useState<string>('SPPG Contoh 087');

  const selectedKitchen = useMemo(() => {
    return kitchens.find((k) => k.id === selectedKitchenId) || kitchens[0];
  }, [kitchens, selectedKitchenId]);

  const handleSelectKitchenForDetail = (kitchen: Kitchen) => {
    setSelectedKitchenId(kitchen.id);
    setActivePage('detail-kasus');
  };

  const handleAddDecisionLog = (entry: DecisionLogEntry) => {
    setDecisionLogs((prev) => [entry, ...prev]);
  };

  const handleSendRecommendationToPPK = () => {
    const newLog: DecisionLogEntry = {
      id: `log-${Date.now()}`,
      time: 'Hari Ini, ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB (Minggu 4)',
      sppgId: 'Batch SPP M4',
      kitchenName: 'Seluruh Antrean Triase Minggu 4 (N=500)',
      region: 'Wilayah A',
      label: 'Kuning',
      tingkat: 'Tingkat 2',
      keputusan: 'Rekomendasi Berkas Diteruskan ke Meja PPK',
      verifikator: 'Verifikator BGN',
      alasan: 'Penerusan triase otomatis: top-up penuh untuk Hijau, top-up bahan baku untuk Kuning/Merah guna proteksi likuiditas',
      hasilDiubah: false
    };
    handleAddDecisionLog(newLog);
  };

  // Dedicated Landing Page view (full screen, responsive, with hero and control center)
  if (activePage === 'landing') {
    return (
      <LandingPage
        kitchens={kitchens}
        params={params}
        metrics={metrics}
        onNavigateToApp={(target) => setActivePage(target || 'ringkasan')}
        onOpenLogoShowcase={() => setActivePage('logo-showcase')}
      />
    );
  }

  // If Logo Showcase is active, render the dedicated self-contained dark canvas page
  if (activePage === 'logo-showcase') {
    return (
      <LogoShowcasePage
        onGoToApp={() => setActivePage('ringkasan')}
        onGoToLanding={() => setActivePage('landing')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FE] text-[#181C20] font-sans antialiased selection:bg-[#FFBA09] selection:text-[#000F4A]">
      {/* 240px Fixed Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={(p) => setActivePage(p)}
        onLogout={() => setActivePage('landing')}
      />

      {/* Main Container Offset by Sidebar */}
      <div className="pl-[240px]">
        {/* Fixed Top Header */}
        <Header onLogout={() => setActivePage('landing')} />

        {/* Viewport Content */}
        <main className="relative pt-16 min-h-screen">
          {activePage === 'ringkasan' && (
            <RingkasanPage
              kitchens={kitchens}
              params={params}
              metrics={metrics}
              trendData={trendData}
              onNavigate={(p) => setActivePage(p)}
            />
          )}

          {activePage === 'antrean-mingguan' && (
            <AntreanMingguanPage
              kitchens={kitchens}
              onSelectKitchenForDetail={handleSelectKitchenForDetail}
              onSendRecommendationToPPK={handleSendRecommendationToPPK}
            />
          )}

          {activePage === 'detail-kasus' && (
            <DetailKasusPage
              kitchen={selectedKitchen}
              params={params}
              onBack={() => setActivePage('antrean-mingguan')}
              onAddDecisionLog={handleAddDecisionLog}
            />
          )}

          {activePage === 'simulator-ambang' && (
            <SimulatorAmbangPage
              currentParams={params}
              onUpdateParams={(newParams) => setParams(newParams)}
            />
          )}

          {activePage === 'kamus-red-flag' && (
            <KamusRedFlagPage
              onNavigate={(p) => setActivePage(p)}
              enableR3Tahap1={params.enableR3Tahap1}
              onToggleR3={(enabled) => setParams((prev) => ({ ...prev, enableR3Tahap1: enabled }))}
            />
          )}

          {activePage === 'error-vs-fraud' && (
            <ErrorVsFraudPage
              decisionLogs={decisionLogs}
              onAddDecisionLog={handleAddDecisionLog}
            />
          )}

          {activePage === 'indikator-pilot' && (
            <IndikatorPilotPage
              kitchens={kitchens}
              params={params}
              decisionLogs={decisionLogs}
            />
          )}
        </main>
      </div>
    </div>
  );
}
