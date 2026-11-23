"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Move,
  Lightbulb,
  Play,
  CheckCircle2,
  AlertCircle,
  Info,
  Settings2,
  Cpu,
} from "lucide-react";
import { Header } from "@/components/header";
import { useSoundEffects } from "@/providers/sound-provider";
import {
  CircuitChallenge,
  CircuitSlot,
  CircuitDifficulty,
  AVAILABLE_COMPONENTS,
  getStoredCircuits,
  saveStoredCircuits,
  resetStoredCircuits,
} from "@/lib/circuitos-data";

const PRESET_CIRCUIT_IMAGES = [
  { label: "Circuito 01 - Bateria 9V com LED e Resistor", path: "/circuitos/circuito01.png" },
  { label: "Circuito 02 - Arduino com Botão e LED", path: "/circuitos/circuito02.png" },
  { label: "Circuito 03 - Semáforo Duplo (2 LEDs)", path: "/circuitos/circuito03.png" },
  { label: "Circuito 04 - Sensor de Luz LDR com Arduino", path: "/circuitos/circuito04.png" },
  { label: "Circuito 05 - Motor DC com Arduino Uno", path: "/circuitos/circuito05.png" },
];

let globalUniqueCounter = 0;
function generateSlotId() {
  globalUniqueCounter += 1;
  return `slot-${globalUniqueCounter}-${Math.random().toString(36).substring(2, 8)}`;
}
function generateCircuitId() {
  globalUniqueCounter += 1;
  return `circuito-${globalUniqueCounter}-${Math.random().toString(36).substring(2, 8)}`;
}

export default function AdminCircuitosPage() {
  const { playClick, playSuccess, playError, playToggle } = useSoundEffects();

  const [circuits, setCircuits] = useState<CircuitChallenge[]>(() => getStoredCircuits());
  const [selectedCircuitId, setSelectedCircuitId] = useState<string>(() => {
    const initial = getStoredCircuits();
    return initial[0]?.id || "";
  });
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(() => {
    const initial = getStoredCircuits();
    return initial[0]?.slots[0]?.id || null;
  });

  const [isDraggingSlotOnCanvas, setIsDraggingSlotOnCanvas] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    if (type === "success") playSuccess();
    else playError();
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const currentCircuit = circuits.find((c) => c.id === selectedCircuitId) || null;
  const currentSlot = currentCircuit?.slots.find((s) => s.id === selectedSlotId) || null;

  const handleUpdateCircuitField = <K extends keyof CircuitChallenge>(
    field: K,
    value: CircuitChallenge[K]
  ) => {
    if (!currentCircuit) return;
    setCircuits((prev) =>
      prev.map((c) => (c.id === currentCircuit.id ? { ...c, [field]: value } : c))
    );
  };

  const handleUpdateSlotField = <K extends keyof CircuitSlot>(
    slotId: string,
    field: K,
    value: CircuitSlot[K]
  ) => {
    if (!currentCircuit) return;
    const updatedSlots = currentCircuit.slots.map((s) =>
      s.id === slotId ? { ...s, [field]: value } : s
    );
    handleUpdateCircuitField("slots", updatedSlots);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || !currentCircuit || isDraggingSlotOnCanvas) return;

    if ((e.target as HTMLElement).closest("[data-slot-pin='true']")) {
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const percentX = Math.round((clickX / rect.width) * 1000) / 10;
    const percentY = Math.round((clickY / rect.height) * 1000) / 10;

    const newSlotNumber = currentCircuit.slots.length + 1;
    const newSlotId = generateSlotId();
    const newSlot: CircuitSlot = {
      id: newSlotId,
      name: `Slot ${newSlotNumber} - Novo Componente`,
      description: "Descreva a função do componente neste slot para o aluno.",
      hint: "Dica curta para o placeholder do slot",
      targetComponentId: "resistor",
      x: Math.max(5, Math.min(95, percentX)),
      y: Math.max(5, Math.min(95, percentY)),
      width: 12,
      height: 14,
    };

    const updatedSlots = [...currentCircuit.slots, newSlot];
    handleUpdateCircuitField("slots", updatedSlots);
    setSelectedSlotId(newSlotId);
    playToggle(true);
    showToast(`Slot ${newSlotNumber} adicionado na posição X: ${percentX}%, Y: ${percentY}%`);
  };

  const handleSlotPointerDown = (slotId: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setSelectedSlotId(slotId);
    setIsDraggingSlotOnCanvas(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleSlotPointerMove = (slotId: string, e: React.PointerEvent) => {
    if (!isDraggingSlotOnCanvas || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const moveX = e.clientX - rect.left;
    const moveY = e.clientY - rect.top;

    const percentX = Math.max(4, Math.min(96, Math.round((moveX / rect.width) * 1000) / 10));
    const percentY = Math.max(4, Math.min(96, Math.round((moveY / rect.height) * 1000) / 10));

    handleUpdateSlotField(slotId, "x", percentX);
    handleUpdateSlotField(slotId, "y", percentY);
  };

  const handleSlotPointerUp = () => {
    setIsDraggingSlotOnCanvas(false);
  };

  const handleDeleteSlot = (slotId: string) => {
    if (!currentCircuit) return;
    playClick();
    const updated = currentCircuit.slots.filter((s) => s.id !== slotId);
    handleUpdateCircuitField("slots", updated);
    if (selectedSlotId === slotId) {
      setSelectedSlotId(updated[0]?.id || null);
    }
    showToast("Slot removido com sucesso.");
  };

  const handleCreateNewCircuit = () => {
    playClick();
    const newId = generateCircuitId();
    const newSlotId = generateSlotId();
    const newCircuit: CircuitChallenge = {
      id: newId,
      title: `Novo Circuito ${circuits.length + 1}`,
      practicalObjective: "Defina o objetivo prático que o aluno deve atingir.",
      description: "Orientações gerais sobre a montagem do circuito.",
      difficulty: "iniciante",
      image_url: "/circuitos/circuito01.png",
      xpReward: 50,
      allowedComponents: ["arduino", "resistor", "led-vermelho", "bateria-9v"],
      explanation: "Explicação teórica de como o circuito funciona.",
      pedagogicalTips: [
        "Preste atenção à polaridade dos componentes.",
        "Resistores são essenciais para evitar sobrecarga de corrente.",
      ],
      slots: [
        {
          id: newSlotId,
          name: "Slot 1 - Componente Inicial",
          description: "Primeiro componente obrigatório do circuito.",
          hint: "Arraste o componente aqui",
          targetComponentId: "bateria-9v",
          x: 50,
          y: 50,
          width: 12,
          height: 14,
        },
      ],
    };

    const updated = [...circuits, newCircuit];
    setCircuits(updated);
    setSelectedCircuitId(newId);
    setSelectedSlotId(newCircuit.slots[0].id);
    showToast("Novo circuito criado! Configure os slots e objetivos.");
  };

  const handleDeleteCircuit = (id: string) => {
    if (circuits.length <= 1) {
      showToast("Não é possível remover todos os circuitos. Pelo menos um deve permanecer.", "error");
      return;
    }
    playClick();
    const updated = circuits.filter((c) => c.id !== id);
    setCircuits(updated);
    setSelectedCircuitId(updated[0].id);
    setSelectedSlotId(updated[0].slots[0]?.id || null);
    saveStoredCircuits(updated);
    showToast("Circuito excluído.");
  };

  const handleSaveAll = () => {
    playClick();
    saveStoredCircuits(circuits);
    showToast("Todos os circuitos e slots foram salvos com sucesso!");
  };

  const handleResetToDefaults = () => {
    if (confirm("Deseja restaurar os circuitos e slots para os 5 padrões originais do sistema? Todas as alterações personalizadas serão redefinidas.")) {
      playClick();
      const defaults = resetStoredCircuits();
      setCircuits(defaults);
      setSelectedCircuitId(defaults[0].id);
      setSelectedSlotId(defaults[0].slots[0]?.id || null);
      showToast("Circuitos e slots restaurados para o padrão original!");
    }
  };

  return (
    <div className="relative min-h-screen bg-lab-canvas text-lab-text font-sans flex flex-col justify-between">
      <div className="absolute inset-0 opacity-55 dark:opacity-35 pointer-events-none lab-dot-grid" />

      <Header />

      <main className="relative z-10 flex-1 max-w-[1340px] w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {toastMessage && (
          <div className={`fixed top-24 right-6 z-50 p-4 rounded-2xl border shadow-2xl flex items-center gap-3 animate-fade-in ${
            toastMessage.type === "success"
              ? "bg-lab-success-bg border-lab-success-border text-lab-success-text"
              : "bg-lab-error-bg border-lab-error-border text-lab-error-text"
          }`}>
            {toastMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-bold">{toastMessage.text}</span>
          </div>
        )}

        {/* Top Header & Global Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-lab-border">
          <div className="flex items-center gap-4">
            <Link
              href="/jogos"
              className="p-2.5 rounded-xl bg-lab-surface hover:bg-lab-tint border border-lab-border text-lab-muted hover:text-lab-text transition-all flex items-center gap-2 text-sm font-bold cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar aos Jogos</span>
            </Link>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-lab-lavender-text bg-lab-lavender-bg px-2.5 py-0.5 rounded-lg border border-lab-lavender-border">
                  Painel de Gestão Pedagógica
                </span>
                <span className="text-xs text-lab-muted font-semibold">
                  {circuits.length} Circuitos Cadastrados
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-lab-text tracking-tight mt-1">
                Gerenciador de Circuitos e Slots Interativos
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/jogos/eletronica"
              className="bg-lab-surface hover:bg-lab-tint text-lab-primary-strong border border-lab-border px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer active:scale-98"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Testar no Jogo</span>
            </Link>

            <button
              onClick={handleResetToDefaults}
              className="bg-lab-surface hover:bg-lab-tint text-lab-muted hover:text-lab-text border border-lab-border px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Restaurar circuitos para os 5 desafios de fábrica"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Padrões</span>
            </button>

            <button
              onClick={handleSaveAll}
              className="bg-lab-primary-strong hover:bg-lab-primary dark:bg-lab-primary dark:hover:bg-lab-primary-strong text-white dark:text-[#121926] px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer active:scale-98"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </div>

        {/* Circuit Tabs / Selector */}
        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
          <div className="flex items-center gap-2">
            {circuits.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => {
                  playClick();
                  setSelectedCircuitId(c.id);
                  setSelectedSlotId(c.slots[0]?.id || null);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  c.id === selectedCircuitId
                    ? "bg-lab-primary-strong text-white dark:bg-lab-primary dark:text-[#121926] shadow-sm"
                    : "bg-lab-surface text-lab-muted hover:bg-lab-tint hover:text-lab-text border border-lab-border"
                }`}
              >
                <span>{`#${idx + 1} ${c.title.slice(0, 24)}...`}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  c.id === selectedCircuitId
                    ? "bg-white/20 dark:bg-black/20"
                    : "bg-lab-tint text-lab-muted"
                }`}>
                  {c.slots.length} slots
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={handleCreateNewCircuit}
            className="bg-lab-success-bg hover:opacity-90 text-lab-success-text border border-lab-success-border px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Circuito</span>
          </button>
        </div>

        {currentCircuit && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Visual Canvas Area (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="bg-lab-surface border border-lab-border rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-sm">
                <div className="flex items-center justify-between text-xs text-lab-muted border-b border-lab-border pb-2.5">
                  <div className="flex items-center gap-2">
                    <Move className="w-4 h-4 text-lab-primary-strong" />
                    <span className="font-extrabold uppercase tracking-wider text-lab-text">
                      Bancada Visual: Clique na imagem para criar slots ou arraste-os
                    </span>
                  </div>
                  <span className="text-[11px] text-lab-muted font-semibold">
                    Posicionamento Relativo (0% a 100%)
                  </span>
                </div>

                {/* Canvas Container */}
                <div
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-dashed border-lab-border bg-[#121926] cursor-crosshair select-none group"
                  title="Clique em qualquer lugar da imagem do circuito para posicionar um novo slot"
                >
                  <Image
                    src={currentCircuit.image_url}
                    alt={currentCircuit.title}
                    fill
                    className="object-contain pointer-events-none"
                    priority
                  />

                  <div className="absolute top-3 left-3 bg-[#121926]/85 backdrop-blur-xs border border-[#2E3E5C] px-3 py-1.5 rounded-xl text-[11px] text-[#F1F6FC] pointer-events-none flex items-center gap-1.5 font-semibold">
                    <Lightbulb className="w-3.5 h-3.5 text-[#FFD166]" />
                    <span>Clique na imagem para adicionar um slot onde desejar</span>
                  </div>

                  {currentCircuit.slots.map((slot, index) => {
                    const isSelected = slot.id === selectedSlotId;
                    const comp = AVAILABLE_COMPONENTS.find((c) => c.id === slot.targetComponentId);

                    return (
                      <div
                        key={slot.id}
                        data-slot-pin="true"
                        style={{
                          left: `${slot.x}%`,
                          top: `${slot.y}%`,
                          width: `${slot.width || 12}%`,
                          height: `${slot.height || 14}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                        onPointerDown={(e) => handleSlotPointerDown(slot.id, e)}
                        onPointerMove={(e) => handleSlotPointerMove(slot.id, e)}
                        onPointerUp={handleSlotPointerUp}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSlotId(slot.id);
                          playClick();
                        }}
                        className={`absolute rounded-xl flex flex-col items-center justify-between p-1.5 cursor-grab active:cursor-grabbing transition-shadow z-20 ${
                          isSelected
                            ? "bg-[#3B82D6]/85 border-2 border-[#FFFFFF] shadow-2xl ring-4 ring-[#64A8F5]/50 scale-105"
                            : "bg-[#1B2538]/90 border-2 border-[#FFD166]/85 hover:border-white shadow-lg"
                        }`}
                      >
                        <div className="w-full flex items-center justify-between">
                          <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-[#121926]/80 text-[#F1F6FC]">
                            #{index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSlot(slot.id);
                            }}
                            className="w-4 h-4 rounded-full bg-[#F78C8C] hover:bg-[#FA9E9E] text-[#121926] font-extrabold flex items-center justify-center text-[10px] cursor-pointer"
                            title="Remover slot"
                          >
                            ×
                          </button>
                        </div>

                        {comp && (
                          <div className="relative w-full flex-1 flex items-center justify-center pointer-events-none">
                            <Image
                              src={comp.image_url}
                              alt={comp.name}
                              fill
                              className="object-contain p-0.5"
                            />
                          </div>
                        )}

                        <span className="text-[9px] font-bold text-center truncate w-full text-[#F1F6FC] bg-[#121926]/75 rounded px-0.5">
                          {comp ? comp.name.split(" ")[0] : "Slot"}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Slots Overview List */}
                <div className="flex flex-col gap-2 pt-2 border-t border-lab-border">
                  <span className="text-xs font-extrabold text-lab-muted uppercase tracking-wider">
                    Slots Configurados Neste Circuito ({currentCircuit.slots.length})
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {currentCircuit.slots.map((s, idx) => {
                      const comp = AVAILABLE_COMPONENTS.find((c) => c.id === s.targetComponentId);
                      const isSelected = s.id === selectedSlotId;

                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setSelectedSlotId(s.id);
                            playClick();
                          }}
                          className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                            isSelected
                              ? "bg-lab-tint border-lab-primary text-lab-text shadow-xs"
                              : "bg-lab-tint/40 border-lab-border text-lab-muted hover:bg-lab-tint"
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full bg-lab-surface border border-lab-border text-[10px] font-extrabold text-lab-text flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-xs font-bold truncate text-lab-text">{s.name}</span>
                            <span className="text-[10px] text-lab-muted truncate">
                              {comp ? comp.name : "Nenhum"} • ({s.x}%, {s.y}%)
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Inspector and Circuit Form (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-lab-surface border border-lab-border rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-lab-border pb-3">
                  <div className="flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-lab-primary-strong" />
                    <h2 className="text-sm font-extrabold uppercase tracking-wider text-lab-text">
                      Configuração do Slot Selecionado
                    </h2>
                  </div>

                  {currentSlot && (
                    <button
                      type="button"
                      onClick={() => handleDeleteSlot(currentSlot.id)}
                      className="text-xs font-bold text-lab-error-text hover:opacity-80 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Excluir Slot</span>
                    </button>
                  )}
                </div>

                {currentSlot ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-lab-text">
                        Nome / Rótulo do Slot
                      </label>
                      <input
                        type="text"
                        value={currentSlot.name}
                        onChange={(e) => handleUpdateSlotField(currentSlot.id, "name", e.target.value)}
                        placeholder="Ex: Slot 1 - Resistor de Proteção"
                        className="w-full bg-lab-tint border border-lab-border focus:border-lab-primary rounded-xl px-3 py-2 text-sm text-lab-text outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-lab-text flex items-center justify-between">
                        <span>Componente Obrigatório / Esperado</span>
                        <span className="text-[10px] text-lab-lavender-text font-bold">Verificação Lógica</span>
                      </label>
                      <select
                        value={currentSlot.targetComponentId}
                        onChange={(e) => handleUpdateSlotField(currentSlot.id, "targetComponentId", e.target.value)}
                        className="w-full bg-lab-tint border border-lab-border focus:border-lab-primary rounded-xl px-3 py-2 text-sm text-lab-text outline-none cursor-pointer"
                      >
                        {AVAILABLE_COMPONENTS.map((comp) => (
                          <option key={comp.id} value={comp.id}>
                            {comp.name} ({comp.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-lab-text flex items-center justify-between">
                        <span>Dica do Placeholder do Slot</span>
                        <span className="text-[10px] text-lab-amber-text font-bold">Visível no Jogo</span>
                      </label>
                      <input
                        type="text"
                        value={currentSlot.hint || ""}
                        onChange={(e) => handleUpdateSlotField(currentSlot.id, "hint", e.target.value)}
                        placeholder="Ex: Arraste o Resistor aqui (limita a corrente)"
                        className="w-full bg-lab-tint border border-lab-border focus:border-lab-primary rounded-xl px-3 py-2 text-sm text-lab-text outline-none"
                      />
                      <span className="text-[11px] text-lab-muted">
                        Texto curto exibido no centro do slot vazio para orientar o aluno.
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-lab-text">
                        Descrição Pedagógica / Feedback de Erro
                      </label>
                      <textarea
                        rows={2}
                        value={currentSlot.description}
                        onChange={(e) => handleUpdateSlotField(currentSlot.id, "description", e.target.value)}
                        placeholder="Ex: O resistor protege o LED contra corrente excessiva."
                        className="w-full bg-lab-tint border border-lab-border focus:border-lab-primary rounded-xl px-3 py-2 text-sm text-lab-text outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-lab-border">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-lab-muted">Posição X (%)</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="100"
                          value={currentSlot.x}
                          onChange={(e) => handleUpdateSlotField(currentSlot.id, "x", parseFloat(e.target.value) || 0)}
                          className="w-full bg-lab-tint border border-lab-border rounded-xl px-3 py-1.5 text-sm text-lab-text outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-lab-muted">Posição Y (%)</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="100"
                          value={currentSlot.y}
                          onChange={(e) => handleUpdateSlotField(currentSlot.id, "y", parseFloat(e.target.value) || 0)}
                          className="w-full bg-lab-tint border border-lab-border rounded-xl px-3 py-1.5 text-sm text-lab-text outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-lab-muted text-xs flex flex-col items-center gap-2">
                    <Info className="w-5 h-5" />
                    <span>Nenhum slot selecionado. Clique em um slot no painel ao lado ou na imagem para editar.</span>
                  </div>
                )}
              </div>

              {/* Circuit General Metadata Settings */}
              <div className="bg-lab-surface border border-lab-border rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-lab-border pb-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-lab-primary-strong" />
                    <h2 className="text-sm font-extrabold uppercase tracking-wider text-lab-text">
                      Dados Gerais do Circuito
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteCircuit(currentCircuit.id)}
                    className="text-xs font-bold text-lab-error-text hover:opacity-80 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir Circuito</span>
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-lab-text">
                      Título do Desafio
                    </label>
                    <input
                      type="text"
                      value={currentCircuit.title}
                      onChange={(e) => handleUpdateCircuitField("title", e.target.value)}
                      className="w-full bg-lab-tint border border-lab-border focus:border-lab-primary rounded-xl px-3 py-2 text-sm text-lab-text outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-lab-text flex items-center justify-between">
                      <span>Objetivo Prático do Desafio</span>
                      <span className="text-[10px] text-lab-lavender-text font-bold">Meta Pedagógica</span>
                    </label>
                    <textarea
                      rows={2}
                      value={currentCircuit.practicalObjective}
                      onChange={(e) => handleUpdateCircuitField("practicalObjective", e.target.value)}
                      placeholder="Ex: Ligar um LED com Bateria 9V protegendo com Resistor."
                      className="w-full bg-lab-tint border border-lab-border focus:border-lab-primary rounded-xl px-3 py-2 text-sm text-lab-text outline-none resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-lab-text">
                      Ilustração do Circuito (Pasta circuitos/)
                    </label>
                    <select
                      value={currentCircuit.image_url}
                      onChange={(e) => handleUpdateCircuitField("image_url", e.target.value)}
                      className="w-full bg-lab-tint border border-lab-border focus:border-lab-primary rounded-xl px-3 py-2 text-sm text-lab-text outline-none cursor-pointer"
                    >
                      {PRESET_CIRCUIT_IMAGES.map((img) => (
                        <option key={img.path} value={img.path}>
                          {img.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-lab-text">
                      Nível de Dificuldade
                    </label>
                    <select
                      value={currentCircuit.difficulty}
                      onChange={(e) => handleUpdateCircuitField("difficulty", e.target.value as CircuitDifficulty)}
                      className="w-full bg-lab-tint border border-lab-border focus:border-lab-primary rounded-xl px-3 py-2 text-sm text-lab-text outline-none cursor-pointer"
                    >
                      <option value="iniciante">Iniciante</option>
                      <option value="intermediario">Intermediário</option>
                      <option value="avancado">Avançado</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-lab-text">
                      Explicação Teórica de Funcionamento
                    </label>
                    <textarea
                      rows={2}
                      value={currentCircuit.explanation}
                      onChange={(e) => handleUpdateCircuitField("explanation", e.target.value)}
                      className="w-full bg-lab-tint border border-lab-border focus:border-lab-primary rounded-xl px-3 py-2 text-sm text-lab-text outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
