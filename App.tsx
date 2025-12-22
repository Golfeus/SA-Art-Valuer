
import React, { useState } from 'react';
import { ArtworkData, ValuationResult } from './types';
import { getArtValuation } from './services/geminiService';
import { Input } from './components/Input';
import { Button } from './components/Button';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [valuation, setValuation] = useState<ValuationResult | null>(null);
  const [formData, setFormData] = useState<ArtworkData>({
    artist: '',
    title: '',
    medium: '',
    year: '',
    dimensions: '',
    condition: '',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.artist) {
      setError("Please provide at least the artist's name.");
      return;
    }

    setLoading(true);
    setError(null);
    setValuation(null);

    try {
      const result = await getArtValuation(formData);
      setValuation(result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-neutral-100 py-8 px-6 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-end">
          <div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-neutral-900">
              South African Art <span className="italic">Valuer</span>
            </h1>
            <p className="text-neutral-400 text-sm mt-1 tracking-widest uppercase">Professional Auction Market Analysis</p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-[10px] text-neutral-400 uppercase tracking-[0.2em]">Curated Intelligence</p>
            <p className="text-xs text-neutral-600">Powered by Gemini & Google Search</p>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Input Form */}
        <section className="lg:col-span-5">
          <div className="sticky top-32">
            <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
              <span className="w-6 h-[1px] bg-neutral-900 inline-block"></span>
              Artwork Details
            </h2>
            <form onSubmit={handleSubmit} className="bg-white border border-neutral-100 p-8 shadow-sm">
              <Input 
                label="Artist Name" 
                name="artist" 
                placeholder="e.g. William Kentridge" 
                value={formData.artist} 
                onChange={handleInputChange} 
                required
              />
              <Input 
                label="Artwork Title" 
                name="title" 
                placeholder="e.g. Triumphs and Laments" 
                value={formData.title} 
                onChange={handleInputChange} 
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Medium" 
                  name="medium" 
                  placeholder="e.g. Oil on Canvas" 
                  value={formData.medium} 
                  onChange={handleInputChange} 
                />
                <Input 
                  label="Year" 
                  name="year" 
                  placeholder="e.g. 2016" 
                  value={formData.year} 
                  onChange={handleInputChange} 
                />
              </div>
              <Input 
                label="Dimensions" 
                name="dimensions" 
                placeholder="e.g. 120 x 180 cm" 
                value={formData.dimensions} 
                onChange={handleInputChange} 
              />
              <Input 
                label="Condition" 
                name="condition" 
                placeholder="e.g. Excellent / Small tear bottom left" 
                value={formData.condition} 
                onChange={handleInputChange} 
              />
              <Input 
                label="Additional Context" 
                name="description" 
                textarea 
                placeholder="Exhibition history, provenance, or specific style details..." 
                value={formData.description} 
                onChange={handleInputChange} 
              />
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm border border-red-100">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full mt-4" isLoading={loading}>
                Calculate Market Value
              </Button>
            </form>
          </div>
        </section>

        {/* Right: Results Display */}
        <section className="lg:col-span-7">
          {!valuation && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-neutral-50 border border-dashed border-neutral-200">
              <div className="w-16 h-16 mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-light text-neutral-600 mb-2">Ready for Valuation</h3>
              <p className="text-neutral-400 max-w-sm mx-auto">
                Enter the artwork details to search through South African auction house records for comparative sales data.
              </p>
            </div>
          )}

          {loading && (
            <div className="space-y-8 animate-pulse">
              <div className="h-40 bg-neutral-100"></div>
              <div className="h-64 bg-neutral-100"></div>
              <div className="h-32 bg-neutral-100"></div>
            </div>
          )}

          {valuation && (
            <div className="space-y-12">
              {/* Estimates Section */}
              <div className="bg-neutral-900 text-white p-10 relative overflow-hidden">
                <div className="relative z-10">
                  <span className="text-[10px] uppercase tracking-[0.3em] opacity-60">Auction Estimate Range</span>
                  <div className="flex flex-col md:flex-row md:items-baseline gap-4 mt-4">
                    <span className="text-5xl md:text-7xl serif font-medium">
                      {valuation.estimateLow > 0 ? formatCurrency(valuation.estimateLow) : 'N/A'}
                    </span>
                    <span className="text-2xl text-neutral-500 serif">—</span>
                    <span className="text-5xl md:text-7xl serif font-medium">
                      {valuation.estimateHigh > 0 ? formatCurrency(valuation.estimateHigh) : 'N/A'}
                    </span>
                  </div>
                  <p className="mt-8 text-sm text-neutral-400 max-w-lg leading-relaxed">
                    Estimated for major South African auction houses (Strauss & Co, Stephan Welz, Aspire). 
                    Calculated based on artist secondary market performance and work quality.
                  </p>
                </div>
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-[0.03] translate-x-1/2 -translate-y-1/2 rounded-full"></div>
              </div>

              {/* Analysis Section */}
              <div>
                <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
                  <span className="w-6 h-[1px] bg-neutral-900 inline-block"></span>
                  Market Analysis
                </h2>
                <div className="prose prose-neutral max-w-none text-neutral-700 leading-relaxed space-y-4">
                   {valuation.analysis.split('\n').map((paragraph, idx) => (
                     <p key={idx}>{paragraph}</p>
                   ))}
                </div>
              </div>

              {/* Sources Section */}
              {valuation.sources.length > 0 && (
                <div>
                  <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
                    <span className="w-6 h-[1px] bg-neutral-900 inline-block"></span>
                    Verified Auction Sources
                  </h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {valuation.sources.map((source, idx) => (
                      <li key={idx} className="group">
                        <a 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-start gap-3 p-4 border border-neutral-100 bg-white hover:border-neutral-900 transition-colors"
                        >
                          <div className="mt-1 text-neutral-400 group-hover:text-neutral-900">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-neutral-900 line-clamp-2 leading-tight">
                              {source.title}
                            </p>
                            <p className="text-[10px] text-neutral-400 mt-1 break-all">
                              {new URL(source.uri).hostname}
                            </p>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disclaimer */}
              <div className="pt-8 border-t border-neutral-100">
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest leading-loose">
                  Disclaimer: This tool provides market estimations based on historical auction data. 
                  Valuations are for informational purposes only and do not constitute a formal appraisal 
                  for insurance or legal purposes. Actual sales prices may vary significantly based on 
                  market fluctuations and buyer demand.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="bg-neutral-50 border-t border-neutral-100 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} Art Market Intelligence — South Africa
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors">Term of Service</a>
            <a href="#" className="text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors">Methodology</a>
            <a href="#" className="text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
