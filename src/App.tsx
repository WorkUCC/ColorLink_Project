/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { LoginScreen } from "./components/LoginScreen";
import { NeedWizard } from "./components/NeedWizard";
import { TechnicalSolution } from "./components/TechnicalSolution";
import { SupplyAvailability } from "./components/SupplyAvailability";
import { ServiceTracking } from "./components/ServiceTracking";
import { QualityWarranty } from "./components/QualityWarranty";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { HeroSection } from "./components/HeroSection";
import {
  UserProfile,
  ProjectNeedState,
  TechnicalRecommendation,
  OrderState,
  DeliveryMethod,
  SurfaceId,
} from "./types";
import { PINTUCO_PALETTES, DEMO_PRESETS, CERTIFIED_PAINTERS, getTechnicalRecommendation } from "./data/pintucoData";
// --- Integración Supabase ---
import { SupabaseTestPanel } from "./components/SupabaseTestPanel";
import {
  persistirFlujoDiagnostico,
  guardarPedido,
  guardarServicio,
  guardarGarantia,
  AdministradorAuth,
} from "./lib/colorlinkApi";
import { supabaseConfigurado } from "./lib/supabaseClient";
import { AdminLoginScreen } from "./components/AdminLoginScreen";
import { AdminDashboard } from "./components/AdminDashboard";
import { LoginModal } from "./components/LoginModal";
import { VirtualAdvisor } from "./components/VirtualAdvisor";
import { Loader2, Info, ArrowRight } from "lucide-react";

export default function App() {
  // Step navigation: 1: Login/Account, 2: Need Wizard, 3: Technical Solution, 4: Supply, 5: Service/Tracking, 6: Quality/Warranty
  // Default to step 2 so new visitors can explore freely without mandatory login
  const [currentStep, setCurrentStep] = useState<number>(2);

  // Authenticated user state (null for visitors)
  const [user, setUser] = useState<UserProfile | null>(null);

  // Estado para el modal emergente de inicio de sesión
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Project need state gathered through wizard
  const [projectNeed, setProjectNeed] = useState<ProjectNeedState>({
    surface: "fachadas_exteriores",
    problem: "humedad_filtraciones",
    areaM2: 55,
    selectedColor: PINTUCO_PALETTES[3], // Arena Colonial
    city: "Bogotá D.C.",
    address: "Calle 134 # 19-45, Barrio Cedritos",
    urgency: "urgente_24h",
    projectNotes: "Filtraciones leves en la pared lateral por lluvias recientes.",
  });

  // IDs devueltos por Supabase tras persistir el flujo
  const [dbIds, setDbIds] = useState<{
    idUsuario: number | null;
    idProyecto: number | null;
    idRecomendacion: number | null;
    idPedido: number | null;
  }>({ idUsuario: null, idProyecto: null, idRecomendacion: null, idPedido: null });

  // Panel de pruebas de integración: se activa con ?pruebas=1 en la URL
  const mostrarPanelPruebas =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("pruebas") === "1";

  // Modo administrador: se activa con ?admin=1 en la URL
  const esAdmin =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("admin") === "1";
  const [adminAutenticado, setAdminAutenticado] = useState<AdministradorAuth | null>(null);

  // AI & technical recommendation state
  const [recommendation, setRecommendation] = useState<TechnicalRecommendation | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [hasCompletedWizard, setHasCompletedWizard] = useState<boolean>(false);
  const [isCheckingDiagnosis, setIsCheckingDiagnosis] = useState<boolean>(false);

  // Order & tracking state
  const [orderState, setOrderState] = useState<OrderState>({
    orderId: "89421",
    createdAt: new Date().toISOString(),
    deliveryMethod: "domicilio_express",
    serviceOption: "con_aplicador",
    selectedPainter: CERTIFIED_PAINTERS[0],
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    scheduledTime: "08:00 AM",
    paymentMethod: "pse",
    paymentStatus: "pagado",
    trackingStep: "confirmado",
    driverEtaMinutes: 28,
    currentStepIndex: 0,
  });

  // Estado para la barra de navegación secundaria (Sherwin-Williams style)
  const [segmentoElegido, setSegmentoElegido] = useState<string | null>(null);
  const [wizardInitialStep, setWizardInitialStep] = useState<number>(1);
  const [isHotlineHighlighted, setIsHotlineHighlighted] = useState<boolean>(false);

  // Manejadores de la barra de navegación
  const handleSelectSurface = (surface: SurfaceId) => {
    setProjectNeed((prev) => ({ ...prev, surface }));
    setWizardInitialStep(1);
    setCurrentStep(2);
    setTimeout(() => {
      const wizardEl = document.getElementById("wizard-container");
      if (wizardEl) wizardEl.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleGoToColorVisualizer = () => {
    setWizardInitialStep(4);
    setCurrentStep(2);
    setTimeout(() => {
      const vizEl =
        document.getElementById("color-visualizer-container") ||
        document.getElementById("wizard-container");
      if (vizEl) vizEl.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  const handleSelectSegmento = (segmento: string) => {
    setSegmentoElegido(segmento);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearSegmento = () => {
    setSegmentoElegido(null);
  };

  const handleGoToTracking = () => {
    setCurrentStep(5);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoToWarranty = () => {
    setCurrentStep(6);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHighlightHotline = () => {
    setIsHotlineHighlighted(true);
    setTimeout(() => setIsHotlineHighlighted(false), 3500);
  };

  // Function to call the backend technical AI diagnostic engine
  const fetchTechnicalDiagnosis = async (
    needData: ProjectNeedState,
    additionalNotes?: string
  ): Promise<TechnicalRecommendation | null> => {
    setIsDiagnosing(true);
    try {
      /*
       * API Integration Point:
       * In production, this calls the Pintuco AI Formulation Engine & ERP / MES
       * API endpoint: POST /api/diagnose
       */
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surfaceType: needData.surface,
          problemType: needData.problem,
          areaM2: needData.areaM2,
          location: needData.city,
          urgency: needData.urgency,
          colorName: needData.selectedColor.name,
          colorHex: needData.selectedColor.hex,
          customerType: user?.type || "hogar",
          projectDetails: additionalNotes || needData.projectNotes,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.recommendation) {
          setRecommendation(data.recommendation);
          return data.recommendation as TechnicalRecommendation;
        }
        return null;
      } else {
        throw new Error("Failed backend diagnosis response");
      }
    } catch (err) {
      console.warn("Backend diagnosis fallback:", err);
      // Motor de recomendación oficial Pintuco con filtrado contextual según superficie
      const fallback = getTechnicalRecommendation(needData, user?.type || "hogar");
      setRecommendation(fallback);
      return fallback;
    } finally {
      setIsDiagnosing(false);
    }
  };

  // Handler for user login - preserves progress and current step if logged in mid-flow
  const handleLoginSuccess = (profile: UserProfile) => {
    setUser(profile);
    setProjectNeed((prev) => ({
      ...prev,
      city: prev.city || profile.city,
      address: prev.address || profile.address,
    }));
    setCurrentStep((prevStep) => {
      if (prevStep === 1) {
        setTimeout(() => {
          const wizardEl = document.getElementById("wizard-container");
          if (wizardEl) wizardEl.scrollIntoView({ behavior: "smooth" });
        }, 50);
        return 2;
      }
      return prevStep;
    });
  };

  // Handler for completing need wizard
  const handleWizardComplete = async (needData: ProjectNeedState) => {
    setHasCompletedWizard(true);
    setProjectNeed(needData);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });

    const rec = await fetchTechnicalDiagnosis(needData);

    /*
     * INSERT real en Supabase: usuario -> proyecto -> recomendacion.
     * Si la base de datos falla, la app sigue funcionando en modo demo:
     * la persistencia no debe bloquear la experiencia del usuario.
     */
    if (supabaseConfigurado) {
      try {
        const ids = await persistirFlujoDiagnostico(user, needData, rec);
        setDbIds((prev) => ({ ...prev, ...ids }));
        console.info("[Supabase] Proyecto guardado:", ids);
      } catch (err) {
        console.error("[Supabase] Error al guardar el proyecto:", err);
      }
    }
  };

  // Handler for refining recommendation with questions
  const handleRefineWithAI = async (userQuestion: string) => {
    await fetchTechnicalDiagnosis(projectNeed, userQuestion);
  };

  // Handler for supply selection
  const handleProceedToSupply = () => {
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handler from supply to service
  const handleProceedToService = (
    deliveryMethod: DeliveryMethod,
    storeData?: { name: string; address: string }
  ) => {
    setOrderState((prev) => ({
      ...prev,
      deliveryMethod,
      storeName: storeData?.name,
      storeAddress: storeData?.address,
    }));
    setCurrentStep(5);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handler to update order details
  const handleUpdateOrder = (updated: Partial<OrderState>) => {
    setOrderState((prev) => ({ ...prev, ...updated }));
  };

  // Handler to proceed to Quality and Warranty
  const handleProceedToQuality = async () => {
    const ordenFinal: OrderState = {
      ...orderState,
      trackingStep: "confirmado",
      currentStepIndex: 0,
    };
    setOrderState(ordenFinal);
    setCurrentStep(6);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // INSERT de pedido -> servicio -> garantía al cerrar el flujo
    if (supabaseConfigurado && dbIds.idRecomendacion) {
      try {
        const idPedido = await guardarPedido(
          ordenFinal,
          dbIds.idUsuario,
          dbIds.idRecomendacion,
          null, // id_tienda: enlazar cuando el paso 4 use tiendas de la BD
          recommendation?.pricing.totalEstimated ?? 0
        );

        await guardarServicio(
          idPedido,
          null, // id_maestro: enlazar cuando los maestros vengan de la BD
          `${ordenFinal.scheduledDate}T08:00:00Z`,
          ordenFinal.trackingStep
        );

        const garantia = await guardarGarantia(
          idPedido,
          recommendation?.warrantyYears ?? 5
        );

        setDbIds((prev) => ({ ...prev, idPedido }));
        console.info("[Supabase] Pedido y garantía guardados:", idPedido, garantia.numero_poliza);
      } catch (err) {
        console.error("[Supabase] Error al guardar el pedido:", err);
      }
    }
  };

  // Handler to load demo presets for rapid evaluation
  const handleLoadPreset = (preset: typeof DEMO_PRESETS[0]) => {
    const demoUser: UserProfile = {
      name: "Carolina Gómez",
      email: "carolina.gomez@gmail.com",
      phone: "+57 312 458 9012",
      type: "hogar",
      city: preset.data.city,
      address: preset.data.address,
    };
    setUser(demoUser);
    setProjectNeed(preset.data);
    setHasCompletedWizard(true);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchTechnicalDiagnosis(preset.data);
  };

  // Reset flow
  const handleResetApp = () => {
    setHasCompletedWizard(false);
    setRecommendation(null);
    setCurrentStep(2);
    setOrderState((prev) => ({
      ...prev,
      trackingStep: "confirmado",
      currentStepIndex: 0,
      orderId: String(Math.floor(10000 + Math.random() * 90000)),
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 3 requires a recommendation; generate fallback if navigating directly to Step 3
  useEffect(() => {
    if (currentStep === 3 && !recommendation && !isDiagnosing) {
      fetchTechnicalDiagnosis(projectNeed);
    }
  }, [currentStep, recommendation, isDiagnosing, projectNeed]);

  // Steps 4, 5, 6 without a recommendation: show loading check first
  useEffect(() => {
    if (currentStep >= 4 && !recommendation && !hasCompletedWizard) {
      setIsCheckingDiagnosis(true);
      const timer = setTimeout(() => {
        setIsCheckingDiagnosis(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [currentStep, recommendation, hasCompletedWizard]);

  // Si la URL tiene el parámetro ?admin=1, mostramos la vista administrativa
  if (esAdmin) {
    return (
      <div className="min-h-screen bg-[#FBF7F0] text-[#2B211C] font-sans selection:bg-[#E2622F] selection:text-[#FBF7F0]">
        {!adminAutenticado ? (
          <AdminLoginScreen onLoginExitoso={(admin) => setAdminAutenticado(admin)} />
        ) : (
          <AdminDashboard
            admin={adminAutenticado}
            onCerrarSesion={() => setAdminAutenticado(null)}
          />
        )}
        {mostrarPanelPruebas && (
          <SupabaseTestPanel projectNeed={projectNeed} recommendation={recommendation} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF7F0] text-[#2B211C] flex flex-col font-sans selection:bg-[#E2622F] selection:text-[#FBF7F0]">
      {/* Global Brand Header */}
      <Header
        currentStep={currentStep}
        onNavigateStep={(step) => {
          setCurrentStep(step);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        user={user}
        onLogout={() => {
          setUser(null);
          setCurrentStep(2);
        }}
        onLoadPreset={handleLoadPreset}
        projectNeed={projectNeed}
        segmentoElegido={segmentoElegido}
        onSelectSegmento={handleSelectSegmento}
        onClearSegmento={handleClearSegmento}
        onSelectSurface={handleSelectSurface}
        onGoToColorVisualizer={handleGoToColorVisualizer}
        onGoToTracking={handleGoToTracking}
        onGoToWarranty={handleGoToWarranty}
        onHighlightHotline={handleHighlightHotline}
        isHotlineHighlighted={isHotlineHighlighted}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Main Flow Views */}
      <main className="flex-1">
        {/* Hero Banner & Trust Badges at beginning of customer journey */}
        {(currentStep === 1 || currentStep === 2) && (
          <HeroSection
            onStartDiagnostic={() => {
              setCurrentStep(2);
              setTimeout(() => {
                const wizardEl = document.getElementById("wizard-container");
                if (wizardEl) {
                  wizardEl.scrollIntoView({ behavior: "smooth" });
                }
              }, 50);
            }}
          />
        )}

        {/* STEP 1: Login / Registration (Optional for visitors, available for registered customers) */}
        {currentStep === 1 && (
          <LoginScreen
            onContinueAsGuest={() => {
              setCurrentStep(2);
              setTimeout(() => {
                const wizardEl = document.getElementById("wizard-container");
                if (wizardEl) {
                  wizardEl.scrollIntoView({ behavior: "smooth" });
                }
              }, 50);
            }}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
            segmentoElegido={segmentoElegido}
            onCambiarSegmento={handleClearSegmento}
          />
        )}

        {/* STEP 2: Client Need Onboarding Wizard */}
        {currentStep === 2 && (
          <div id="wizard-container">
            <NeedWizard
              initialState={projectNeed}
              user={user}
              onComplete={handleWizardComplete}
              onBackToLogin={() => setCurrentStep(1)}
              initialWizardStep={wizardInitialStep}
              segmentoElegido={segmentoElegido}
              onCambiarSegmento={handleClearSegmento}
            />
          </div>
        )}

        {/* STEP 3: AI-Assisted Technical Solution Card */}
        {currentStep === 3 && (
          <TechnicalSolution
            recommendation={recommendation}
            projectNeed={projectNeed}
            user={user}
            isLoading={isDiagnosing}
            onProceedToSupply={handleProceedToSupply}
            onBackToWizard={() => setCurrentStep(2)}
            onRefineWithAI={handleRefineWithAI}
            onLoginClick={() => {
              setIsLoginModalOpen(true);
            }}
          />
        )}

        {/* STEP 4: Supply & Availability (Inventory & Stores) */}
        {currentStep === 4 && recommendation && (
          <SupplyAvailability
            recommendation={recommendation}
            projectNeed={projectNeed}
            user={user}
            onProceedToService={handleProceedToService}
            onBackToTechnical={() => setCurrentStep(3)}
          />
        )}

        {/* STEP 5: Service, Painter Selection & Live GPS Tracking */}
        {currentStep === 5 && recommendation && (
          <ServiceTracking
            recommendation={recommendation}
            projectNeed={projectNeed}
            orderState={orderState}
            onUpdateOrder={handleUpdateOrder}
            onProceedToQuality={handleProceedToQuality}
            onBackToSupply={() => setCurrentStep(4)}
          />
        )}

        {/* STEP 6: Quality, Warranty & Satisfaction Feedback */}
        {currentStep === 6 && recommendation && (
          <QualityWarranty
            recommendation={recommendation}
            projectNeed={projectNeed}
            orderState={orderState}
            user={user}
            onResetApp={handleResetApp}
          />
        )}

        {/* Loader o Estado Vacío Amigable para Pasos 4, 5 o 6 sin recomendación previa */}
        {currentStep >= 4 && !recommendation && (
          (isDiagnosing || isCheckingDiagnosis) ? (
            <div className="max-w-md mx-auto px-4 py-20 text-center">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E8DFD5] flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-xl bg-[#F5EFE6] text-[#E2622F] flex items-center justify-center mb-4 border border-[#E8DFD5]">
                  <Loader2 className="w-6 h-6 animate-spin text-[#E2622F]" />
                </div>
                <h3 className="text-base font-bold text-[#2B211C] mb-1">
                  Cargando tu diagnóstico...
                </h3>
                <p className="text-xs text-[#7A6A5D]">
                  Verificando la formulación técnica y el estado de tu proyecto.
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto px-4 py-16 text-center">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E7E5E4] flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-200">
                  <Info className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-base font-bold text-[#1C1917] mb-1">
                  Aún no tienes un diagnóstico activo
                </h3>
                <p className="text-xs text-stone-500 mb-6 leading-relaxed">
                  Para consultar el abastecimiento, coordinar el servicio o emitir tu póliza de garantía 360, primero necesitamos conocer la superficie y medidas de tu proyecto.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="bg-[#E2622F] hover:bg-[#C95222] text-[#FBF7F0] font-semibold text-xs py-2.5 px-5 rounded-lg transition inline-flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Comenzar diagnóstico (Paso 1)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        )}
        {/* PANEL DE PRUEBAS: abrir la app con ?pruebas=1 para verlo */}
        {mostrarPanelPruebas && (
          <SupabaseTestPanel projectNeed={projectNeed} recommendation={recommendation} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#1A1715] text-[#CDBEAF] py-6 border-t border-[#2B211C] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#FBF7F0]">ColorLink by Pintuco</span>
            <span className="text-[#7A6A5D]">|</span>
            <span className="text-[#CDBEAF]">Solución técnica, abastecimiento y garantía oficial</span>
          </div>

          <div className="flex items-center gap-4 text-[#CDBEAF]">
            <span>+80 años protegiendo a Colombia</span>
            <span>•</span>
            <a href="tel:018000111404" className="hover:text-white transition">Línea Técnica: 018000 111 404</a>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Support Button */}
      <WhatsAppButton />

      {/* Asesora Técnica Virtual con Avatar Pintuco */}
      <VirtualAdvisor
        currentStep={currentStep}
        projectNeed={projectNeed}
        recommendation={recommendation}
        user={user}
      />

      {/* Modal Emergente de Inicio de Sesión / Registro */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        segmentoElegido={segmentoElegido}
      />
    </div>
  );
}
