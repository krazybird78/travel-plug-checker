import { useState, useMemo, useEffect } from 'react';
import {
  MapPin,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Plane,
  ShoppingBag,
  Info
} from 'lucide-react';
import countriesData from './data/countries.json';
import { PlugIcon } from './components/PlugIcon';
import { CountrySelector } from './components/CountrySelector';

interface Country {
  name: string;
  code: string;
  frequencies: string[];
  plugs: string[];
  voltages: string[];
}

const countries = countriesData as Country[];

export default function App() {
  const [homeCountryName, setHomeCountryName] = useState('');
  const [destCountryName, setDestCountryName] = useState('');
  const [userRegion, setUserRegion] = useState('US');

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone.includes('Toronto') || timezone.includes('Vancouver')) setUserRegion('CA');
    else if (timezone.includes('London')) setUserRegion('UK');
    else if (timezone.includes('Paris')) setUserRegion('FR');
    else if (timezone.includes('Berlin')) setUserRegion('DE');
  }, []);

  const homeCountry = useMemo(() => countries.find(c => c.name === homeCountryName), [homeCountryName]);
  const destCountry = useMemo(() => countries.find(c => c.name === destCountryName), [destCountryName]);

  const result = useMemo(() => {
    if (!homeCountry || !destCountry) return null;

    const plugCompatible = homeCountry.plugs.some(p => destCountry.plugs.includes(p));
    const getVolts = (vArr: string[]) => vArr.flatMap(v => v.match(/\d+/g) || []).map(Number);
    const homeVolts = getVolts(homeCountry.voltages);
    const destVolts = getVolts(destCountry.voltages);

    const needsConverter = homeVolts.some(hv => destVolts.every(dv => Math.abs(hv - dv) > 30));
    const needsAdapter = !plugCompatible;

    return {
      needsAdapter,
      needsConverter,
      plugCompatible
    };
  }, [homeCountry, destCountry]);

  const getAmazonLink = (asin: string) => {
    const domains: Record<string, string> = { CA: 'amazon.ca', UK: 'amazon.co.uk', FR: 'amazon.fr', DE: 'amazon.de' };
    const domain = domains[userRegion] || 'amazon.com';
    const tag = userRegion === 'CA' ? 'purrandpaws05-20' : 'purrandpaws08-20';
    return `https://www.${domain}/dp/${asin}?tag=${tag}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-swiss-red text-white text-[10px] font-black px-2 py-0.5 rounded-sm tracking-widest animate-pulse-red">
              TECHNICAL
            </div>
            <div className="w-8 h-px bg-gray-200"></div>
            <div className="text-[10px] font-black text-swiss-gray-medium tracking-[0.4em] uppercase">
              Travel Standard
            </div>
          </div>

          <div className="relative inline-block">
            {/* Vertically oriented "TRAVEL" tag on the left */}
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90">
              <span className="text-[8px] font-black tracking-[0.6em] text-swiss-red/40 uppercase">TRAVEL</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-swiss-gray-dark leading-none flex items-center">
              PLUG<span className="text-swiss-red mx-1">·</span>CHECKER
            </h1>
          </div>

          <div className="mt-6 flex flex-col items-center">
            <div className="w-12 h-1 bg-swiss-gray-dark mb-3"></div>
            <p className="text-swiss-gray-medium text-[9px] font-bold uppercase tracking-[0.3em] text-center">
              International Voltage & Socket Diagnostics / Gen. 2
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-6">
        {/* Selection Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <CountrySelector
            label="From (Home)"
            icon={<MapPin className="w-3 h-3 text-swiss-red" />}
            value={homeCountryName}
            options={countries}
            onChange={setHomeCountryName}
            placeholder="Search home country..."
          />

          <CountrySelector
            label="To (Destination)"
            icon={<Plane className="w-3 h-3 text-swiss-red" />}
            value={destCountryName}
            options={countries}
            onChange={setDestCountryName}
            placeholder="Search destination..."
          />
        </div>

        {/* Results Area */}
        {result ? (
          <div className="space-y-8 animate-fade-in-up">
            {/* Verdict Card */}
            <div className={`p-8 rounded-2xl border transition-colors duration-500 ${result.needsAdapter || result.needsConverter ? 'border-swiss-red bg-red-50/20' : 'border-green-200 bg-green-50/20'}`}>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className={`p-5 rounded-2xl shadow-lg ${result.needsAdapter || result.needsConverter ? 'bg-swiss-red' : 'bg-green-600'}`}>
                  {result.needsAdapter || result.needsConverter ? (
                    <AlertTriangle className="w-8 h-8 text-white" />
                  ) : (
                    <CheckCircle className="w-8 h-8 text-white" />
                  )}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-black tracking-tighter mb-2 uppercase">
                    {result.needsAdapter || result.needsConverter ? 'Adapter Required' : 'Fully Compatible'}
                  </h2>
                  <p className="text-swiss-gray-dark font-medium leading-relaxed">
                    {result.needsAdapter && result.needsConverter
                      ? 'Warning: You need an adapter with voltage conversion. Electrical standards differ significantly.'
                      : result.needsAdapter
                        ? 'You require a physical plug adapter. Voltage is compatible for most devices.'
                        : result.needsConverter
                          ? 'Note: Pins match, but a voltage converter is mandatory for safety.'
                          : 'Excellent. Your devices will function optimally without any modifications.'}
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-6 border-l border-gray-200 pl-8">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-swiss-gray-medium uppercase mb-1 tracking-tighter">Voltage</p>
                    <p className="text-xl font-black">{destCountry?.voltages[0]}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300" />
                  <div className="text-center">
                    <p className="text-[10px] font-black text-swiss-gray-medium uppercase mb-1 tracking-tighter">Pins</p>
                    <div className="flex gap-1 justify-center">
                      {destCountry?.plugs.map(p => (
                        <span key={p} className="bg-swiss-gray-dark text-white text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">{p}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Breakdown */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card-premium h-full">
                <h3 className="text-[10px] font-black uppercase text-swiss-gray-medium mb-6 tracking-[0.1em] flex items-center gap-2">
                  <Info className="w-3 h-3" /> Technical Specs
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100">
                    <span className="text-sm font-medium text-swiss-gray-medium uppercase tracking-tighter">Main Voltage</span>
                    <span className="font-black text-swiss-gray-dark">{destCountry?.voltages.join(' / ')}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100">
                    <span className="text-sm font-medium text-swiss-gray-medium uppercase tracking-tighter">Frequency</span>
                    <span className="font-black text-swiss-gray-dark">{destCountry?.frequencies.join(' / ')}</span>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <span className="text-[10px] font-black text-swiss-gray-medium uppercase tracking-widest block mb-4">Required Socket Interfaces</span>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {destCountry?.plugs.map(p => (
                        <div key={p} className="flex flex-col items-center flex-shrink-0 bg-swiss-gray-light p-2 rounded-xl border border-gray-200 min-w-[64px]">
                          <PlugIcon type={p} size={32} />
                          <span className="text-[9px] font-black mt-2 uppercase text-swiss-gray-dark tracking-tighter">Type {p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-premium bg-swiss-gray-dark text-white border-none flex flex-col justify-between h-full shadow-2xl">
                <div>
                  <h3 className="text-[10px] font-black uppercase text-swiss-red mb-6 tracking-[0.2em]">Travel Advisory</h3>
                  <p className="text-sm leading-relaxed mb-8 opacity-90 font-medium">
                    {destCountry?.plugs.includes('G')
                      ? 'Great Britain-style sockets (G) require a specialized 3-pin configuration. We recommend our high-precision grounded adapter.'
                      : 'Target standards detect varied socket geometry. A universal Swiss-grade adapter is recommended for consistent connectivity.'}
                  </p>
                </div>
                <a
                  href={getAmazonLink('B0DHVNW1CN')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-xs uppercase tracking-widest"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Aquire on Amazon
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-32 border-2 border-dashed border-gray-100 rounded-[2rem] bg-swiss-gray-light/30">
            <Plane className="w-16 h-16 text-gray-200 mx-auto mb-6 opacity-50" />
            <p className="text-swiss-gray-medium font-bold uppercase tracking-widest text-xs">Define your itinerary to view diagnostics.</p>
          </div>
        )}

        {/* Pro Tip Footer */}
        <div className="mt-24 border-t border-gray-100 pt-12 flex items-start gap-4 text-swiss-gray-medium max-w-2xl mx-auto text-center flex-col items-center">
          <div className="bg-swiss-gray-light p-2 rounded-full">
            <Info className="w-4 h-4 text-swiss-red" />
          </div>
          <p className="text-[10px] font-bold leading-loose uppercase tracking-widest opacity-60">
            Data accuracy is maintained through IEC standard synchronization. Verify your specific hardware voltage rating prior to deployment.
          </p>
        </div>
      </main>

      <footer className="py-16 px-6 text-center text-[10px] font-black text-swiss-gray-medium uppercase tracking-[0.3em] bg-swiss-gray-light mt-32 border-t border-gray-100">
        © travel plug checker • precision travel tools • affiliate disclosure active
      </footer>
    </div>
  );
}
