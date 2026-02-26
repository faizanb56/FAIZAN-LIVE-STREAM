import React, { useState, useEffect, useRef } from 'react';
import { Play, Tv, Zap, Globe, Shield, Menu, X, Info, ChevronRight, Activity } from 'lucide-react';

const App = () => {
  const [activeStream, setActiveStream] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const streams = [
    {
      id: 1,
      name: "Star Sports 1 HD",
      url: "https://tgs5.myluck1.top:8088/mobile/stream7_320p/playlist.m3u8?vidictid=204938429184&id=27&pk=76f15de4d6c3b4d50ae7851fd623ade80757917852e2144612e93d6987733f168bc86e10006c9f307e95f44a55488c1581a1ab0ded6f6c536a0fd2c34c05d129",
      provider: "Star Sports Network",
      quality: "Auto",
      icon: <Tv className="w-5 h-5 text-blue-400" />
    },
    {
      id: 2,
      name: "International Cricbuzz",
      url: "https://tgs5.myluck1.top:8088/mobile/stream3_320p/playlist.m3u8?vidictid=204921698610&id=11&pk=9b166ec440052e524ab9570b1b64b876fe45795e11e90a1cd246812ea675f74a4f0e2fd9b82bfef82453d8bdda7952cbd8140c83cb11f24e7c0d9648775c724a",
      provider: "Cricbuzz Live",
      quality: "HD",
      icon: <Globe className="w-5 h-5 text-emerald-400" />
    },
    {
      id: 3,
      name: "Tamasha Premium (1080p)",
      url: "https://tencentcdn8.tamashaweb.com/v1/019bf00087161567ee93346674d025/019bffb7d77215fc600b1b67f81952/tmsh_srt_output_clone_1080p.m3u8?timeshift=1&mode=6&delay=1800",
      provider: "Tamasha PK",
      quality: "Full HD",
      icon: <Zap className="w-5 h-5 text-yellow-400" />
    },
    {
      id: 4,
      name: "Tamasha 720p",
      url: "https://tencentcdn8.tamashaweb.com/v1/019bf00087161567ee93346674d025/019bffb7d77215fc600b1b67f81952/tmsh_srt_output_clone_720p.m3u8?timeshift=1&mode=6&delay=1800",
      provider: "Tamasha PK",
      quality: "720p",
      icon: <Tv className="w-5 h-5 text-yellow-400" />
    },
    {
      id: 5,
      name: "PTV Sports (50 FPS)",
      url: "https://cricloungelive.short.gy/livepakistanteam/ICC_T20WC_2026/PTV50fps.m3u8",
      provider: "PTV Network",
      quality: "Smooth 50fps",
      icon: <Activity className="w-5 h-5 text-green-400" />
    },
    {
      id: 6,
      name: "Cricket Urdu Commentary",
      url: "https://cricloungelive.short.gy/livepakistanteam/ICC_T20WC_2026/Urdu.m3u8",
      provider: "Local Feed",
      quality: "SD/Urdu",
      icon: <Shield className="w-5 h-5 text-red-400" />
    }
  ];

  // Initialize Stream on load
  useEffect(() => {
    setActiveStream(streams[0]);
    
    // Dynamically load HLS.js for .m3u8 support
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
    script.async = true;
    script.onload = () => {
      initPlayer(streams[0].url);
    };
    document.body.appendChild(script);

    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, []);

  const initPlayer = (url) => {
    const video = videoRef.current;
    if (!video) return;

    if (window.Hls && window.Hls.isSupported()) {
      if (hlsRef.current) hlsRef.current.destroy();
      const hls = new window.Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hlsRef.current = hls;
      video.play().catch(e => console.log("Auto-play blocked"));
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // For Safari native support
      video.src = url;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
    }
  };

  const switchStream = (stream) => {
    setActiveStream(stream);
    initPlayer(stream.url);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
              <Play fill="white" className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              T20 WORLD CUP <span className="text-blue-500 font-black">LIVE</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Schedules</a>
            <a href="#" className="hover:text-white transition-colors">Teams</a>
            <a href="#" className="hover:text-white transition-colors">Stats</a>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full transition-all text-xs font-bold uppercase tracking-wider">
              Live Now
            </button>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-slate-400">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#0a0a0c] flex flex-col p-6 animate-in slide-in-from-right">
          <div className="flex justify-between items-center mb-10">
            <span className="font-bold text-xl">Streaming Links</span>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-white/5 rounded-full"><X /></button>
          </div>
          <div className="flex flex-col gap-4">
            {streams.map((s) => (
              <button 
                key={s.id}
                onClick={() => switchStream(s)}
                className={`p-4 rounded-xl flex items-center gap-4 transition-all ${activeStream?.id === s.id ? 'bg-blue-600' : 'bg-white/5'}`}
              >
                {s.icon}
                <div className="text-left">
                  <div className="font-bold">{s.name}</div>
                  <div className="text-xs opacity-60">{s.provider}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-20 pb-12 px-4 max-w-7xl mx-auto">
        
        {/* Video & Info Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-4">
            {/* Player Container */}
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/5 group">
              <video 
                ref={videoRef}
                className="w-full h-full object-contain"
                controls
                poster="https://share.google/1p5RXc0iE5pnLHI1q"
                playsInline
              />
              <div className="absolute top-4 left-4 pointer-events-none">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white">Live • {activeStream?.quality}</span>
                </div>
              </div>
            </div>

            {/* Stream Info */}
            <div className="bg-white/5 border border-white/5 p-5 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-1 tracking-tight">{activeStream?.name}</h1>
                  <p className="text-slate-400 text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Secured Broadcast Source • Provided by {activeStream?.provider}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg border border-blue-500/20 text-xs font-bold">
                  <Info className="w-4 h-4" /> HIGH BITRATE
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                <span className="text-xs font-semibold px-2.5 py-1 bg-white/5 rounded-md text-slate-300">Cricket</span>
                <span className="text-xs font-semibold px-2.5 py-1 bg-white/5 rounded-md text-slate-300">T20 World Cup</span>
                <span className="text-xs font-semibold px-2.5 py-1 bg-white/5 rounded-md text-slate-300">ICC 2026</span>
              </div>
            </div>
          </div>

          {/* Sidebar Channels */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2 px-1">
              <Tv className="w-5 h-5 text-blue-500" />
              Available Servers
            </h3>
            <div className="grid gap-3">
              {streams.map((s) => (
                <button
                  key={s.id}
                  onClick={() => switchStream(s)}
                  className={`group relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left ${
                    activeStream?.id === s.id 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-400/30 shadow-lg shadow-blue-900/20' 
                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeStream?.id === s.id ? 'bg-white/20' : 'bg-black/20 group-hover:bg-blue-500/10 transition-colors'}`}>
                    {s.icon}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className={`font-bold truncate ${activeStream?.id === s.id ? 'text-white' : 'text-slate-200'}`}>
                      {s.name}
                    </h4>
                    <p className={`text-xs ${activeStream?.id === s.id ? 'text-blue-100' : 'text-slate-500'}`}>
                      {s.quality} Quality
                    </p>
                  </div>
                  {activeStream?.id === s.id && (
                    <ChevronRight className="w-5 h-5 text-white/50" />
                  )}
                </button>
              ))}
            </div>

            {/* Ad/Info Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/40 to-slate-900 p-6 border border-white/5">
              <div className="relative z-10">
                <h4 className="font-bold text-white mb-2">Watch in 4K?</h4>
                <p className="text-sm text-slate-400 mb-4">Upgrade your experience with our high-speed global relay servers.</p>
                <button className="w-full bg-white text-black font-bold py-2 rounded-lg text-sm transition-transform active:scale-95">
                  Check Schedule
                </button>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/10 blur-3xl rounded-full" />
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/5 text-center">
          <p className="text-slate-500 text-xs">
            © 2026 T20 World Cup Live Portal. This platform is for demonstration and personal use only. 
            <br />All media rights belong to respective broadcasters.
          </p>
        </footer>
      </main>

      {/* Global Style Overlay for HLS Player Customization */}
      <style dangerouslySetInnerHTML={{ __html: `
        video::-webkit-media-controls-panel {
          background-image: linear-gradient(transparent, rgba(0,0,0,0.8)) !important;
        }
        .animate-in {
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}} />
    </div>
  );
};

export default App;

