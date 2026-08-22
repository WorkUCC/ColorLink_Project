export type CustomerType = "hogar" | "contratista" | "empresa";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  type: CustomerType;
  companyName?: string;
  city: string;
  address: string;
}

export type SurfaceId =
  | "fachadas_exteriores"
  | "paredes_interiores"
  | "banos_cocinas"
  | "madera_decks"
  | "metales_estructuras"
  | "pisos_garajes"
  | "techos_cubiertas";

export interface SurfaceOption {
  id: SurfaceId;
  title: string;
  subtitle: string;
  icon: string;
  image: string;
  defaultM2: number;
}

export type ProblemId =
  | "humedad_filtraciones"
  | "hongos_moho"
  | "desgaste_intemperie"
  | "manchas_grasa"
  | "oxido_corrosion"
  | "cambio_estetico";

export interface ProblemOption {
  id: ProblemId;
  title: string;
  description: string;
  tag: string;
  severity: "baja" | "media" | "alta";
}

export interface PintucoColor {
  code: string;
  name: string;
  hex: string;
  collection: "Tendencias 2026" | "Exteriores" | "Neutros Elegantes" | "Vibrantes" | "Madera & Piedra";
  description: string;
}

export interface ProjectNeedState {
  surface: SurfaceId;
  problem: ProblemId;
  areaM2: number;
  selectedColor: PintucoColor;
  city: string;
  address: string;
  urgency: "urgente_24h" | "esta_semana" | "proximo_mes";
  projectNotes: string;
  roomPhoto?: string;
}

export interface TechnicalRecommendation {
  productName: string;
  productCategory: string;
  warrantyYears: number;
  systemSteps: string[];
  explanation: string;
  technicalNotes: string;
  benefits: string[];
  selectedColor: {
    name: string;
    hex: string;
  };
  calculation: {
    areaM2: number;
    recommendedFormat: string;
    bucketsCount: number;
    gallonsCount: number;
    totalGallons: number;
    litersEstimate: number;
    coverageRate: string;
    coatCount: number;
  };
  pricing: {
    currency: string;
    productEstimatedTotal: number;
    laborEstimatedTotal: number;
    totalEstimated: number;
    deliveryFee: number;
  };
  supplyChain: {
    status: "in_stock" | "in_production" | "low_stock";
    badgeText: string;
    estimatedDispatchHours: string;
    nearestStore: string;
    stockLevel: string;
  };
}

export interface CertifiedPainter {
  id: string;
  name: string;
  role: string;
  rating: number;
  reviewsCount: number;
  completedJobs: number;
  photo: string;
  portfolioPhotos?: string[];
  experienceYears: number;
  badges: string[];
  availableSlot: string;
  hourlyRate: number;
  phone: string;
}

export type DeliveryMethod = "domicilio_express" | "retiro_tienda";
export type ServiceOption = "con_aplicador" | "solo_materiales";
export type PaymentMethod = "tarjeta_credito" | "pse" | "contra_entrega";

export type OrderTrackingStep =
  | "confirmado"
  | "tinturado_preparacion"
  | "en_camino"
  | "en_sitio_aplicacion"
  | "completado";

export interface OrderState {
  orderId: string;
  createdAt: string;
  deliveryMethod: DeliveryMethod;
  storeName?: string;
  storeAddress?: string;
  serviceOption: ServiceOption;
  selectedPainter?: CertifiedPainter;
  scheduledDate: string;
  scheduledTime: string;
  paymentMethod: PaymentMethod;
  paymentStatus: "pagado" | "pendiente_entrega";
  trackingStep: OrderTrackingStep;
  driverEtaMinutes: number;
  currentStepIndex: number;
}

export interface SatisfactionFeedback {
  productRating: number;
  serviceRating: number;
  recommendToFriend: boolean;
  comments: string;
  submitted: boolean;
}
