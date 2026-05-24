import React, { useState } from 'react';
import { MapPin, Phone, Hotel, ExternalLink, Car, Plane, Utensils, Navigation, X } from 'lucide-react';
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

interface VenuePin {
  id: string;
  name: string;
  type: 'venue' | 'airport' | 'attraction' | 'food';
  coords: { x: number; y: number }; // Percentage coordinate for mock canvas map
  lng: number;
  lat: number;
  description: string;
  distance: string;
  timeByCar: string;
  details: string;
}

export default function LocationSection() {
  const [showInteractiveMap, setShowInteractiveMap] = useState(false);
  const [selectedPin, setSelectedPin] = useState<VenuePin | null>(null);
  const [customStart, setCustomStart] = useState('');
  const [routeResult, setRouteResult] = useState<string | null>(null);

  const pins: VenuePin[] = [
    {
      id: 'maris_sede',
      name: 'Hotel María Bonita (Sede Oficial)',
      type: 'venue',
      coords: { x: 45, y: 50 },
      lng: -106.136814,
      lat: 28.647568,
      description: 'Lugar de todas las conferencias, paneles y talleres de COMEV 2026.',
      distance: '0 km',
      timeByCar: '0 mins',
      details: 'Periférico de la Juventud 4114. Cuenta con estacionamiento libre para asistentes con carnet.'
    },
    {
      id: 'aeropuerto',
      name: 'Aeropuerto Internacional de Chihuahua (CUU)',
      type: 'airport',
      coords: { x: 85, y: 75 },
      lng: -105.964263,
      lat: 28.702759,
      description: 'Terminal aérea principal.',
      distance: '21.5 km',
      timeByCar: '22 mins',
      details: 'Sugerimos tomar taxi oficial del aeropuerto (EVM recomendados) o Uber.'
    },
    {
      id: 'distrito_uno',
      name: 'Distrito Uno (Zona Gastronómica)',
      type: 'food',
      coords: { x: 40, y: 35 },
      lng: -106.132890,
      lat: 28.649635,
      description: 'Gourmet, cafes de especialidad y vida nocturna premium.',
      distance: '1.2 km',
      timeByCar: '3 mins',
      details: 'El área peatonal de negocios más exclusiva de Chihuahua, ideal para reuniones post-evento.'
    },
    {
      id: 'centro_historico',
      name: 'Centro Histórico (Catedral y Museos)',
      type: 'attraction',
      coords: { x: 20, y: 65 },
      lng: -106.072688,
      lat: 28.635293,
      description: 'Paseo histórico imperdible con rica arquitectura del siglo XIX.',
      distance: '6.8 km',
      timeByCar: '12 mins',
      details: 'Visita los museos de la Revolución (Quinta Luz) y saborea la gastronomía local.'
    }
  ];

  const handleCalculateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStart.trim()) return;
    
    // Simple custom simulation based on common places in Chihuahua
    const startLower = customStart.toLowerCase();
    if (startLower.includes('aeropuerto') || startLower.includes('cuu')) {
      setRouteResult('Aeropuerto (CUU) ➔ Hotel María Bonita: Toma Periférico de la Juventud de Sur a Norte. Distancia: 21.5 km. Tiempo estimado: 22 min en tráfico regular.');
    } else if (startLower.includes('centro') || startLower.includes('catedral')) {
      setRouteResult('Centro Histórico ➔ Hotel María Bonita: Toma Av. Teófilo Borunda Oeste hasta Periférico de la Juventud, incorporándose al Norte. Distancia: 6.8 km. Tiempo estimado: 12 min.');
    } else if (startLower.includes('distrito') || startLower.includes('d1')) {
      setRouteResult('Distrito Uno ➔ Hotel María Bonita: Es una ruta prácticamente directa de 3 min hacia el sur circulando por la lateral de Periférico de la Juventud.');
    } else {
      setRouteResult(`Ruta calculada de "${customStart}" hacia María Bonita: Toma Periférico de la Juventud con dirección a Colinas del Sol. Distancia estimada de 5 a 10 km, tiempo promedio: 15 min.`);
    }
  };

  return (
    <section className="py-12 bg-surface-container-lowest grid-pattern relative border-t border-surface-card/60">
      <div className="max-w-[1280px] mx-auto px-5 md:px-[80px]">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Hotel Sede Info Panel */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="font-mono text-xs font-bold tracking-widest text-secondary-orange block mb-2">SEDE OFICIAL</span>
              <h3 className="font-headline text-4xl md:text-5xl font-black text-white italic leading-tight uppercase">
                HOTEL SEDE
              </h3>
              <h4 className="font-headline text-2xl md:text-3xl font-bold text-secondary-orange mt-1">
                MARÍA BONITA
              </h4>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-surface-card border border-accent-orange/20 text-secondary-orange">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-sans font-bold text-white text-lg">Dirección</p>
                  <p className="font-sans text-on-surface-variant text-base mt-1 leading-relaxed">
                    Periférico de la Juventud 4114, Colinas del Sol III Etapa,<br />
                    31110 Chihuahua, Chih.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-surface-card border border-accent-orange/20 text-secondary-orange">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-sans font-bold text-white text-lg">Reservaciones de Hotel</p>
                  <p className="font-sans text-on-surface-variant text-base mt-1">
                    Contacto: <span className="text-white font-medium">Veronica Gallegos</span>
                  </p>
                  <p className="font-mono text-secondary-orange font-bold text-lg mt-0.5">
                    614 124 3055
                  </p>
                  <p className="font-sans text-xs text-on-surface-variant/70 italic mt-0.5">
                    *Menciona el código <span className="text-accent-orange font-bold">COMEV26</span> para tarifa preferencial.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <a 
                href="https://maps.google.com/?q=Hotel+Maria+Bonita+Chihuahua" 
                target="_blank" 
                rel="noreferrer"
                id="btn-google-maps"
                className="inline-flex items-center gap-2 border-b-2 border-secondary-orange pb-1 text-secondary-orange font-mono text-xs font-bold leading-none tracking-widest hover:text-white hover:border-white transition-all uppercase"
              >
                Ver en Google Maps
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Map Preview Box (matches design perfectly) */}
          <div className="lg:col-span-7">
            <div className="relative h-[400px] w-full border border-surface-variant bg-surface-container-low overflow-hidden group">
              
              {/* Google Maps Redirect Overlay */}
              <a 
                href="https://maps.google.com/?q=Hotel+Maria+Bonita+Chihuahua"
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-deep-blue/45 backdrop-blur-xs hover:backdrop-blur-none cursor-pointer duration-350 transition-all group-hover:bg-deep-blue/30 no-underline"
              >
                <div className="bg-deep-blue/90 p-6 border border-secondary-orange text-center group-hover:scale-105 duration-200 transition-transform shadow-2xl">
                  <Navigation className="w-10 h-10 text-secondary-orange mx-auto mb-2.5 animate-pulse" />
                  <p className="font-mono text-xs font-bold text-white tracking-widest uppercase">
                    ABRIR EN GOOGLE MAPS
                  </p>
                  <p className="font-sans text-xs text-on-surface-variant mt-1 px-4">
                    Ver ubicación del hotel y rutas en Google Maps
                  </p>
                </div>
              </a>

              {/* Cover Chihuahua Aerial Image from Reference */}
              <img 
                alt="Aerial view of Chihuahua City urban landscape" 
                className="w-full h-full object-cover grayscale opacity-60"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5vFXc9nkVgA_FgNyHPJnTqk7_Ah_9voHThG3rQFzwf8Zu77cLmQDfpYk5zOFxK3mV1RITMa2sOIuhqEkELOqv63AuUDLBmbAni2KY8g_S-w3z_Itrp1GrYtJokOy46YO-gMlfRCqhXTdVJPs0CmrU4-PeeTydvgQbGY69hjlB5IxKM1bbFmMaxO-yHaOVqoBLPHssQazdlMForGsZCi9fSZuekKRy6-jtxhevctHjl9TtD7Hq46rLNdyGGko-bdALMDch44HrxDk"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Map Modal/Dashboard State Drawer */}
      {showInteractiveMap && (
        <div className="fixed inset-0 z-50 bg-deep-blue/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-card border-2 border-secondary-orange w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden relative shadow-2xl">
            
            {/* Header */}
            <div className="border-b border-surface-variant p-4 md:p-6 flex justify-between items-center bg-deep-blue">
              <div>
                <h4 className="font-headline font-black text-white text-xl tracking-tight">
                  MAPA DE NAVEGACIÓN INTEGRADOR
                </h4>
                <p className="font-sans text-xs text-on-surface-variant">
                  Explora Chihuahua City de cara a la convención COMEV 2026
                </p>
              </div>
              <button 
                onClick={() => setShowInteractiveMap(false)}
                className="text-on-surface-variant hover:text-white hover:bg-white/10 p-2 transition-colors border border-surface-variant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Split Screen Panel */}
            <div className="flex-1 grid md:grid-cols-12 overflow-hidden">
              
              {/* Left Side: Real Mapbox Map */}
              <div className="md:col-span-7 bg-surface-container-lowest relative border-r border-surface-variant min-h-[350px] md:min-h-0 z-10">
                <Map
                  mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || ""}
                  initialViewState={{
                    longitude: -106.136814,
                    latitude: 28.647568,
                    zoom: 12
                  }}
                  style={{ width: '100%', height: '100%', minHeight: '350px' }}
                  mapStyle="mapbox://styles/mapbox/dark-v11"
                >
                  <NavigationControl position="top-right" />
                  
                  {pins.map((pin) => {
                    const isSelected = selectedPin?.id === pin.id;
                    return (
                      <Marker
                        key={pin.id}
                        longitude={pin.lng}
                        latitude={pin.lat}
                        anchor="bottom"
                        onClick={(e) => {
                          e.originalEvent.stopPropagation();
                          setSelectedPin(pin);
                        }}
                      >
                        <button className={`p-2 border transition-all cursor-pointer rounded-none hover:scale-110 ${
                          isSelected 
                            ? 'bg-secondary-orange text-deep-blue border-white shadow-lg shadow-secondary-orange/30 scale-105' 
                            : 'bg-deep-blue text-secondary-orange border-accent-orange/30 hover:border-secondary-orange'
                        }`}>
                          {pin.type === 'venue' && <Hotel className="w-5 h-5" />}
                          {pin.type === 'airport' && <Plane className="w-5 h-5" />}
                          {pin.type === 'food' && <Utensils className="w-5 h-5" />}
                          {pin.type === 'attraction' && <MapPin className="w-5 h-5" />}
                        </button>
                      </Marker>
                    );
                  })}
                </Map>
              </div>

              {/* Right Side: Direction Finder & Location Details */}
              <div className="md:col-span-5 bg-deep-blue overflow-y-auto p-6 flex flex-col justify-between">
                
                {/* Upper: Selected Node Panel */}
                <div className="space-y-6">
                  {selectedPin ? (
                    <div className="space-y-4">
                      <div>
                        {/* Tag */}
                        <div className="inline-block bg-surface-card border border-surface-variant text-on-surface-variant font-mono text-[10px] px-2 py-0.5 uppercase mb-2">
                          {selectedPin.type === 'venue' ? '👑 Centro de Convenciones Sede' : 
                           selectedPin.type === 'airport' ? '✈️ Aeropuerto Conector' : 
                           selectedPin.type === 'food' ? '🍔 Gastronomía Cercana' : '🏛️ Atractivo Turístico'}
                        </div>
                        <h5 className="font-headline font-bold text-white text-lg">
                          {selectedPin.name}
                        </h5>
                      </div>

                      <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                        {selectedPin.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="bg-surface-card border border-surface-variant p-3">
                          <span className="font-mono text-[10px] text-on-surface-variant block uppercase">Distancia a Sede</span>
                          <span className="font-headline font-bold text-white text-base">{selectedPin.distance}</span>
                        </div>
                        <div className="bg-surface-card border border-surface-variant p-3 flex items-center gap-2">
                          <div>
                            <span className="font-mono text-[10px] text-on-surface-variant block uppercase">Tiempo Auto</span>
                            <span className="font-headline font-bold text-secondary-orange text-base flex items-center gap-1">
                              <Car className="w-4 h-4 text-secondary-orange" />
                              {selectedPin.timeByCar}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-surface-card/45 border border-surface-variant p-4">
                        <p className="font-mono text-[10px] text-secondary-orange font-bold uppercase mb-1">Notas útiles de viaje:</p>
                        <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                          {selectedPin.details}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 opacity-70">
                      <p className="font-sans text-sm text-on-surface-variant">Selecciona un punto en el mapa a la izquierda para ver información detallada.</p>
                    </div>
                  )}
                </div>

                {/* Lower: Route Calculator */}
                <div className="border-t border-surface-variant pt-6 mt-6">
                  <p className="font-mono text-[10px] text-secondary-orange font-bold uppercase mb-3 block">
                    🔗 SIMULADOR DE RUTAS CHIHUAHUA
                  </p>
                  
                  <form onSubmit={handleCalculateRoute} className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ej. 'Aeropuerto' o 'Centro Histórico'..."
                        value={customStart}
                        onChange={(e) => setCustomStart(e.target.value)}
                        className="bg-surface-container border border-surface-variant px-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-secondary-orange flex-1 rounded-none"
                      />
                      <button 
                        type="submit" 
                        id="btn-simulate-route"
                        className="bg-secondary-orange hover:bg-white text-deep-blue hover:text-deep-blue px-3 py-2 text-xs font-mono font-bold transition-colors rounded-none"
                      >
                        SIMULAR
                      </button>
                    </div>
                    <p className="font-sans text-[10px] text-on-surface-variant">
                      Tip: Escribe las palabras clave <span className="text-white">'aeropuerto'</span>, <span className="text-white">'centro'</span> o <span className="text-white">'distrito'</span> para obtener consejos precisos.
                    </p>
                  </form>

                  {routeResult && (
                    <div className="mt-4 bg-surface-card-high border-l-2 border-secondary-orange p-3 text-xs font-sans text-on-surface-variant animate-fadeIn">
                      {routeResult}
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Close instruction */}
            <div className="border-t border-surface-variant bg-surface-container-lowest p-3 text-center font-mono text-[10px] text-on-surface-variant">
              Presione <kbd className="text-white px-1.5 py-0.5 bg-surface-card border border-surface-variant">ESC</kbd> o haga clic en la "X" arriba para regresar.
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
