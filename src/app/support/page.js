'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { mensajeService } from '@/utils/mensajeService';

export default function SupportPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    asunto: '',
    contenido: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await mensajeService.create(formData.asunto, formData.contenido);
      setSuccess(true);
      setFormData({ asunto: '', contenido: '' });
      
      setTimeout(() => {
        router.push('/account/messages');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const ejemplosConsultas = [
    { emoji: '🎫', titulo: 'Problema con reserva', descripcion: 'Ayuda con códigos de reserva, asientos, etc.' },
    { emoji: '💳', titulo: 'Consultas de pago', descripcion: 'Problemas con pagos, reembolsos, facturación' },
    { emoji: '✈️', titulo: 'Información de vuelos', descripcion: 'Horarios, cambios, cancelaciones' },
    { emoji: '🧳', titulo: 'Equipaje', descripcion: 'Límites de peso, artículos permitidos' },
    { emoji: '🎟️', titulo: 'Check-in', descripcion: 'Proceso de check-in, documentación' },
    { emoji: '📧', titulo: 'Otra consulta', descripcion: 'Cualquier otra duda o sugerencia' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              💬 Centro de Soporte
            </h1>
            <p className="text-lg text-gray-600">
              ¿Necesitas ayuda? Envíanos tu consulta y te responderemos pronto
            </p>
          </div>

          {/* Success Alert */}
          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6 animate-fade-in">
              <div className="flex items-center">
                <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold">¡Mensaje enviado exitosamente!</p>
                  <p className="text-sm">Nuestro equipo te responderá pronto. Redirigiendo a tus mensajes...</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
              <div className="flex items-center">
                <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Ejemplos de Consultas */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">¿Cómo podemos ayudarte?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {ejemplosConsultas.map((ejemplo, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 hover:shadow-md transition-shadow cursor-default"
                >
                  <div className="text-3xl mb-2">{ejemplo.emoji}</div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{ejemplo.titulo}</h3>
                  <p className="text-xs text-gray-600">{ejemplo.descripcion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Asunto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.asunto}
                onChange={(e) => setFormData({...formData, asunto: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Ej: Problema con mi reserva ABC123"
                required
                minLength={5}
                maxLength={255}
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Mínimo 5 caracteres, máximo 255</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mensaje <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.contenido}
                onChange={(e) => setFormData({...formData, contenido: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                rows={8}
                placeholder="Describe tu consulta o problema de manera detallada..."
                required
                minLength={10}
                maxLength={5000}
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 10 caracteres, máximo 5000 · {formData.contenido.length}/5000
              </p>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Enviar Mensaje
                  </span>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => router.push('/account/messages')}
                className="flex-1 bg-gray-200 text-gray-700 font-semibold py-4 rounded-lg hover:bg-gray-300 focus:ring-4 focus:ring-gray-300 transition-all"
              >
                Ver Mis Mensajes
              </button>
            </div>
          </form>

          {/* Info adicional */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Información importante
              </h3>
              <ul className="text-sm text-blue-800 space-y-1 ml-7">
                <li>• Recibirás una respuesta por correo electrónico</li>
                <li>• Tiempo promedio de respuesta: 24-48 horas</li>
                <li>• Puedes ver el estado de tus mensajes en &quot;Mis Mensajes&quot;</li>
                <li>• Para casos urgentes, llama al 1-800-AERO-PEN</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
