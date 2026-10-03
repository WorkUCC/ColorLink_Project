import React, { useState } from "react";
import { X, Send, PhoneCall } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = "573123456789",
  defaultMessage = "¡Hola Pintuco ColorLink! Deseo recibir asesoría técnica personalizada para mi proyecto de pintura.",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState(defaultMessage);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    customMsg.trim() || defaultMessage
  )}`;

  const handleOpenWhatsApp = () => {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start print:hidden">
      {/* Interactive flyout panel */}
      {isOpen && (
        <div className="mb-3 w-80 bg-[#FBF7F0] rounded-2xl shadow-xl border border-[#E8DFD5] overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="bg-[#1A1715] text-[#FBF7F0] p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center font-bold">
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#FBF7F0]">Asesoría Técnica Pintuco</h4>
                <p className="text-[11px] text-[#CDBEAF]">Respuesta promedio en minutos</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white p-1 rounded-md transition"
              aria-label="Cerrar ventana"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-[#F5EFE6]">
            <div className="bg-white p-3 rounded-xl border border-[#E8DFD5] text-xs text-[#2B211C]">
              <p>
                Hola, ¿necesitas ayuda con la formulación de tu pintura o dudas sobre tiempos de secado y manos?
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#7A6A5D] mb-1">
                Mensaje a enviar:
              </label>
              <textarea
                rows={2}
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="w-full p-2.5 text-xs bg-white rounded-xl border border-[#E8DFD5] focus:outline-none focus:ring-2 focus:ring-[#E2622F] text-[#2B211C]"
                placeholder="Escribe tu duda técnica..."
              />
            </div>

            <div className="flex flex-wrap gap-1">
              {[
                "Consulta de producto",
                "Cotizar aplicador",
                "Disponibilidad tienda",
              ].map((topic, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() =>
                    setCustomMsg(`¡Hola! Deseo información sobre: ${topic}.`)
                  }
                  className="text-[10px] bg-white hover:bg-[#FAF6F0] text-[#2B211C] px-2 py-0.5 rounded-lg border border-[#E8DFD5] transition"
                >
                  {topic}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-medium py-2.5 px-3 rounded-lg text-xs transition inline-flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Chatear por WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 rounded-full shadow-md transition-all hover:scale-105 flex items-center justify-center cursor-pointer"
        aria-label="Abrir asesoría por WhatsApp"
      >
        <svg
          className="w-6 h-6 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </button>
    </div>
  );
};
