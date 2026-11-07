"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  RotateCcw, 
  Zap, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Sliders, 
  Maximize2, 
  X,
  Play,
  Layers,
  Info
} from "lucide-react";
import { Header } from "@/components/header";
import { QuizMascot, MascotPose } from "@/components/quiz/quiz-mascot";
import { CircuitoResultModal } from "@/components/modals/circuito-result-modal";
import { CircuitoErrorModal, SlotValidationError } from "@/components/modals/circuito-error-modal";
import { useSoundEffects } from "@/providers/sound-provider";
import { 
  CircuitChallenge, 
  CircuitSlot, 
  VirtualComponent, 
  AVAILABLE_COMPONENTS, 
  getStoredCircuits 
} from "@/lib/circuitos-data";

export default function JogoEletronicaPage() {
  const { playClick, playSuccess, playError, playToggle } = useSoundEffects();

  const [circuits, setCircuits] = useState<CircuitChallenge[]>([]);
  const [currentCircuitIndex, setCurrentCircuitIndex] = useState(0);
  const [placedComponents, setPlacedComponents] = useState<Record<string, string>>({});
  
  // Selection state for click-to-place accessibility fallback
  const [selectedLibraryComponent, setSelectedLibraryComponent] = useState<string | null>(null);
  
  // Drag-and-drop state
  const [draggedComponentId, setDraggedComponentId] = useState<string | null>(null);
  const [activeHoverSlotId, setActiveHoverSlotId] = useState<string | null>(null);

  // Simulation & validation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [isCircuitEnergized, setIsCircuitEnergized] = useState(false);
  const [simulationErrors, setSimulationErrors] = useState<SlotValidationError[]>([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  // Mascot state
  const [mascotPose, setMascotPose] = useState<MascotPose>("question");
  const [mascotSpeech, setMascotSpeech] = useState<string>(
    "Arraste as peças da bancada para os slots vazios no circuito ou clique para selecionar."
  );

  // Load circuits on mount
  useEffect(() => {
    const loaded = getStoredCircuits();
    setCircuits(loaded);
  }, []);

  const currentCircuit = circuits[currentCircuitIndex] || null;

  // Reset placed components when changing circuit
  useEffect(() => {
    setPlacedComponents({});
    setSelectedLibraryComponent(null);
    setIsCircuitEnergized(false);
    setIsSimulating(false);
    setMascotPose("question");
    setMascotSpeech(
      currentCircuit
        ? `Desafio: ${currentCircuit.practicalObjective}`
        : "Selecione as peças para iniciar a montagem."
    );
  }, [currentCircuitIndex, currentCircuit]);

  // Determine allowed components for the current challenge
  const availableComponentsList = useMemo(() => {
    if (!currentCircuit) return AVAILABLE_COMPONENTS;
    if (!currentCircuit.allowedComponents || currentCircuit.allowedComponents.length === 0) {
      return AVAILABLE_COMPONENTS;
    }
    return AVAILABLE_COMPONENTS.filter((comp) =>
      currentCircuit.allowedComponents.includes(comp.id)
    );
  }, [currentCircuit]);

  // Check how many slots are filled
  const totalSlots = currentCircuit?.slots.length || 0;
  const filledSlotsCount = useMemo(() => {
    if (!currentCircuit) return 0;
    return currentCircuit.slots.filter((slot) => Boolean(placedComponents[slot.id])).length;
  }, [currentCircuit, placedComponents]);

  const isAllSlotsFilled = totalSlots > 0 && filledSlotsCount === totalSlots;

  // Handle Drag Start from component library
  const handleDragStart = (e: React.DragEvent, componentId: string) => {
    e.dataTransfer.setData("text/plain", componentId);
    e.dataTransfer.effectAllowed = "copy";
    setDraggedComponentId(componentId);
    playClick();
  };

  const handleDragEnd = () => {
    setDraggedComponentId(null);
    setActiveHoverSlotId(null);
  };

  // Handle Drag Over slot
  const handleDragOver = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    if (activeHoverSlotId !== slotId) {
      setActiveHoverSlotId(slotId);
    }
  };

  const handleDragLeave = (slotId: string) => {
    if (activeHoverSlotId === slotId) {
      setActiveHoverSlotId(null);
    }
  };

  // Handle Drop onto slot
  const handleDrop = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    const compId = e.dataTransfer.getData("text/plain") || draggedComponentId;
    if (compId) {
      setPlacedComponents((prev) => ({
        ...prev,
        [slotId]: compId,
      }));
      playToggle(true);
      setActiveHoverSlotId(null);
      setDraggedComponentId(null);
      setSelectedLibraryComponent(null);
    }
  };

  // Click-to-place fallback
  const handleSlotClick = (slotId: string) => {
    if (selectedLibraryComponent) {
      setPlacedComponents((prev) => ({
        ...prev,
        [slotId]: selectedLibraryComponent,
      }));
      playToggle(true);
      setSelectedLibraryComponent(null);
    }
  };

  // Remove component from slot
  const handleRemoveFromSlot = (e: React.MouseEvent, slotId: string) => {
    e.stopPropagation();
    playClick();
    setPlacedComponents((prev) => {
      const updated = { ...prev };
      delete updated[slotId];
      return updated;
    });
    setIsCircuitEnergized(false);
  };

  // Clear entire workbench
  const handleClearWorkbench = () => {
    playClick();
    setPlacedComponents({});
    setSelectedLibraryComponent(null);
    setIsCircuitEnergized(false);
  };

  // Validate circuit (RF18, RF19, RF20, RF21)
  const handleValidateCircuit = () => {
    if (!currentCircuit || !isAllSlotsFilled) return;

    setIsSimulating(true);
    playClick();

    // Check each slot
    const errors: SlotValidationError[] = [];
    currentCircuit.slots.forEach((slot) => {
      const placed = placedComponents[slot.id];
      if (placed !== slot.targetComponentId) {
        errors.push({
          slotName: slot.name,
          expectedComponentId: slot.targetComponentId,
          actualComponentId: placed || null,
          slotDescription: slot.description || slot.hint || "",
        });
      }
    });

    if (errors.length === 0) {
      // Success! Energize the circuit!
      setIsCircuitEnergized(true);
      setMascotPose("happy");
      setMascotSpeech("Circuito energizado com sucesso! Todas as conexões estão corretas! 🎉");
      playSuccess();

      // Open success modal after brief celebration animation
      setTimeout(() => {
        setIsSuccessModalOpen(true);
        setIsSimulating(false);
      }, 900);
    } else {
      // Failure! Pedagogical feedback
      setIsCircuitEnergized(false);
      setSimulationErrors(errors);
      setMascotPose("nervous");
      setMascotSpeech("Ops! O circuito apresentou falha de ligação. Vamos revisar os componentes?");
      playError();

      setTimeout(() => {
        setIsErrorModalOpen(true);
        setIsSimulating(false);
      }, 500);
    }
  };

  const handleNextCircuit = () => {
    setIsSuccessModalOpen(false);
    if (currentCircuitIndex < circuits.length - 1) {
      setCurrentCircuitIndex((prev) => prev + 1);
    }
  };

  const getComponentObj = (id: string | null) => {
    if (!id) return null;
    return AVAILABLE_COMPONENTS.find((c) => c.id === id) || null;
  };

  if (!currentCircuit) {
    return (
      <div className="min-h-screen bg-[#212121] text-white flex flex-col justify-between">
        <Header />
        <div className="text-center py-24 text-gray-400">Carregando bancada de circuitos...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#212121] text-white font-sans flex flex-col justify-between select-none">
      {/* Background dot grid pattern */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#cccccc 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px"
        }}
      />

      <Header />

      <main className="relative z-10 flex-1 max-w-[1300px] w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#3e3e3e]">
          <div className="flex items-center gap-4">
            <Link
              href="/jogos"
              className="p-2.5 rounded-xl bg-[#2a2a2a] hover:bg-[#383838] border border-[#5e5e5e] text-gray-300 hover:text-white transition-all flex items-center gap-2 text-sm font-semibold cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar aos Jogos</span>
            </Link>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#883cec] bg-[#883cec]/15 px-2.5 py-0.5 rounded-md border border-[#883cec]/30">
                  Desafio {String(currentCircuitIndex + 1).padStart(2, "0")} / {String(circuits.length).padStart(2, "0")}
                </span>
                <span className="text-xs uppercase font-bold text-gray-400 bg-[#333333] px-2 py-0.5 rounded-md border border-[#444444]">
                  {currentCircuit.difficulty}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                {currentCircuit.title}
              </h1>
            </div>
          </div>

          {/* Circuit Tabs / Navigator */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
            {circuits.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => {
                  playClick();
                  setCurrentCircuitIndex(idx);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  idx === currentCircuitIndex
                    ? "bg-[#883cec] text-white shadow-md shadow-[#883cec]/30"
                    : "bg-[#2b2b2b] text-gray-300 hover:bg-[#383838] border border-[#444444]"
                }`}
              >
                Circuito {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Practical Objective Banner (RF14) */}
        <div className="bg-[#262626] border border-[#5e5e5e] rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-[#883cec]/20 border border-[#883cec]/40 text-[#a865f8]">
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Objetivo do Desafio (RF14)
              </span>
              <p className="text-sm sm:text-base text-gray-100 font-medium leading-relaxed">
                {currentCircuit.practicalObjective}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/circuitos"
              className="text-xs text-gray-400 hover:text-purple-300 underline flex items-center gap-1 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Gerenciar Slots</span>
            </Link>
          </div>
        </div>

        {/* Main Workbench Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Circuit Canvas Container (Col-span 3) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Interactive Circuit Board */}
            <div className="relative bg-[#1a1a1a] border-2 border-[#4a4a4a] rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6 flex flex-col items-center justify-center min-h-[460px]">
              {/* Circuit Board Header Indicators */}
              <div className="w-full flex items-center justify-between text-xs text-gray-400 mb-2 border-b border-[#333333] pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono font-semibold tracking-wider uppercase text-gray-300">
                    Bancada Virtual de Prototipagem
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-400">
                    Slots: <strong className="text-white">{filledSlotsCount}</strong> / {totalSlots}
                  </span>
                  <button
                    onClick={handleClearWorkbench}
                    disabled={filledSlotsCount === 0}
                    className="text-xs text-gray-400 hover:text-rose-400 disabled:opacity-40 disabled:hover:text-gray-400 cursor-pointer flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Limpar</span>
                  </button>
                </div>
              </div>

              {/* The Circuit Illustration with Absolute Overlay Slots */}
              <div className="relative w-full max-w-[900px] aspect-[4/3] rounded-xl overflow-hidden border border-[#3a3a3a] bg-[#121212] shadow-inner flex items-center justify-center">
                {/* Background Illustration */}
                <div className={`relative w-full h-full transition-all duration-700 ${
                  isCircuitEnergized ? "filter drop-shadow-[0_0_25px_rgba(34,197,94,0.45)] brightness-110" : ""
                }`}>
                  <Image
                    src={currentCircuit.image_url}
                    alt={currentCircuit.title}
                    fill
                    className="object-contain pointer-events-none"
                    priority
                  />

                  {/* Simulated Energized Glow Overlay (RF19) */}
                  {isCircuitEnergized && (
                    <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none animate-pulse flex items-center justify-center">
                      <div className="absolute top-4 right-4 bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                        <Sparkles className="w-3.5 h-3.5 fill-emerald-400" />
                        <span>Circuito Ativo: 5V / 9V Corrente Estável</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Interactive Slots (RF16, RF17) */}
                {currentCircuit.slots.map((slot, index) => {
                  const placedCompId = placedComponents[slot.id];
                  const placedComp = getComponentObj(placedCompId);
                  const isHovered = activeHoverSlotId === slot.id;

                  return (
                    <div
                      key={slot.id}
                      style={{
                        left: `${slot.x}%`,
                        top: `${slot.y}%`,
                        width: `${slot.width || 12}%`,
                        height: `${slot.height || 14}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      onDragOver={(e) => handleDragOver(e, slot.id)}
                      onDragLeave={() => handleDragLeave(slot.id)}
                      onDrop={(e) => handleDrop(e, slot.id)}
                      onClick={() => handleSlotClick(slot.id)}
                      title={`${slot.name}: ${slot.hint || slot.description}`}
                      className={`absolute rounded-xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                        placedComp
                          ? "bg-[#252525]/90 border-2 border-emerald-500/80 shadow-lg shadow-emerald-500/20 backdrop-blur-xs"
                          : isHovered
                          ? "bg-[#883cec]/40 border-2 border-[#a865f8] scale-105 shadow-xl shadow-[#883cec]/40 animate-pulse"
                          : selectedLibraryComponent
                          ? "bg-[#2a2a2a]/80 border-2 border-dashed border-[#883cec] hover:bg-[#883cec]/25 hover:scale-102"
                          : "bg-[#1c1c1c]/80 border-2 border-dashed border-[#666666] hover:border-[#883cec] hover:bg-[#252525]/90"
                      }`}
                    >
                      {placedComp ? (
                        /* Filled Slot State (RF17) */
                        <div className="relative w-full h-full p-1 flex flex-col items-center justify-between group">
                          {/* Remove button */}
                          <button
                            onClick={(e) => handleRemoveFromSlot(e, slot.id)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-rose-600 hover:bg-rose-500 text-white rounded-full flex items-center justify-center text-xs shadow-md z-20 cursor-pointer opacity-90 group-hover:opacity-100 transition-opacity"
                            title="Remover peça"
                          >
                            <X className="w-3 h-3" />
                          </button>

                          <div className="relative w-full flex-1 flex items-center justify-center">
                            <Image
                              src={placedComp.image_url}
                              alt={placedComp.name}
                              fill
                              className="object-contain p-1"
                            />
                          </div>

                          <span className="w-full text-center text-[10px] font-bold text-gray-200 truncate bg-black/60 rounded px-1">
                            {placedComp.name}
                          </span>
                        </div>
                      ) : (
                        /* Empty Slot State with Placeholder & Hints (RF17) */
                        <div className="flex flex-col items-center justify-center text-center p-1 w-full h-full">
                          <div className="w-5 h-5 rounded-full bg-[#383838] border border-[#555] text-gray-300 text-[11px] font-bold flex items-center justify-center mb-0.5">
                            {index + 1}
                          </div>
                          <span className="text-[10px] font-semibold text-gray-300 leading-tight line-clamp-1">
                            {slot.hint || "Slot Vazio"}
                          </span>
                          <span className="text-[9px] text-gray-400">
                            Solte aqui
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Bar Below Workbench */}
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-3 border-t border-[#333333]">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Info className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>
                    {isAllSlotsFilled
                      ? "Todos os slots preenchidos! Pronto para validar."
                      : `Faltam ${totalSlots - filledSlotsCount} componentes para habilitar a validação.`}
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Validate Button (RF18: disabled until minimum required components filled) */}
                  <button
                    type="button"
                    onClick={handleValidateCircuit}
                    disabled={!isAllSlotsFilled || isSimulating}
                    className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isAllSlotsFilled
                        ? "bg-[#883cec] hover:bg-[#782bdc] text-white shadow-lg shadow-[#883cec]/30 active:scale-98 animate-pulse"
                        : "bg-[#333333] text-gray-500 border border-[#444444] cursor-not-allowed"
                    }`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Validar Circuito (RF18)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Component Library / Shelf (RF15) */}
            <div className="bg-[#262626] border border-[#5e5e5e] rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#883cec]" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                    Biblioteca de Componentes Virtuais (RF15)
                  </h2>
                </div>
                <span className="text-xs text-gray-400">
                  Arraste para a bancada ou clique para selecionar
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {availableComponentsList.map((comp) => {
                  const isSelected = selectedLibraryComponent === comp.id;

                  return (
                    <div
                      key={comp.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, comp.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => {
                        playClick();
                        setSelectedLibraryComponent(isSelected ? null : comp.id);
                      }}
                      className={`relative bg-[#1e1e1e] border rounded-xl p-3 flex flex-col items-center justify-between gap-2 h-32 cursor-grab active:cursor-grabbing transition-all select-none hover:-translate-y-0.5 ${
                        isSelected
                          ? "border-[#883cec] bg-[#883cec]/15 ring-2 ring-[#883cec] shadow-lg shadow-[#883cec]/25"
                          : "border-[#444444] hover:border-[#666666] hover:bg-[#282828]"
                      }`}
                      title={`${comp.name} - ${comp.description}`}
                    >
                      <div className="relative w-full flex-1 flex items-center justify-center">
                        <Image
                          src={comp.image_url}
                          alt={comp.name}
                          fill
                          className="object-contain pointer-events-none p-1"
                        />
                      </div>

                      <div className="flex flex-col items-center text-center w-full">
                        <span className="text-xs font-bold text-white truncate max-w-full">
                          {comp.name}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {comp.category}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar: Mascot + Challenge Info (Col-span 1) */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            {/* Mascot Advisor */}
            <div className="bg-[#262626] border border-[#5e5e5e] rounded-2xl p-4 flex flex-col items-center shadow-lg">
              <QuizMascot
                pose={mascotPose}
                dialogueText={mascotSpeech}
                className="w-full"
              />
            </div>

            {/* Explanation / Circuit Theory */}
            <div className="bg-[#262626] border border-[#5e5e5e] rounded-2xl p-4 flex flex-col gap-2 shadow-lg text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-purple-300 font-bold">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                <span>Como Funciona Este Circuito</span>
              </div>
              <p className="text-gray-300 leading-relaxed text-xs">
                {currentCircuit.explanation}
              </p>
            </div>

            {/* Pedagogical Hint Card */}
            <div className="bg-[#1f2620] border border-emerald-600/30 rounded-2xl p-4 flex flex-col gap-2 shadow-lg text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Dica Rápida do Módulo</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {currentCircuit.pedagogicalTips[0] || "Preste atenção aos polos positivos e negativos e aos limites de corrente."}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Result Modals */}
      <CircuitoResultModal
        isOpen={isSuccessModalOpen}
        circuitTitle={currentCircuit.title}
        xpGained={currentCircuit.xpReward || 50}
        totalSlots={totalSlots}
        hasNextCircuit={currentCircuitIndex < circuits.length - 1}
        onNextCircuit={handleNextCircuit}
        onRestart={() => {
          setIsSuccessModalOpen(false);
          handleClearWorkbench();
        }}
        onBackToGames={() => {
          setIsSuccessModalOpen(false);
          window.location.href = "/jogos";
        }}
      />

      <CircuitoErrorModal
        isOpen={isErrorModalOpen}
        errors={simulationErrors}
        pedagogicalTips={currentCircuit.pedagogicalTips}
        onRetry={() => {
          setIsErrorModalOpen(false);
        }}
        onClose={() => {
          setIsErrorModalOpen(false);
        }}
      />
    </div>
  );
}

