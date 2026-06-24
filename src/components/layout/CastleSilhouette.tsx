export function CastleSilhouette() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-0 pointer-events-none opacity-30">
      <svg
        viewBox="0 0 1440 320"
        className="w-full h-auto"
        style={{ filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.3))' }}
      >
        <defs>
          <linearGradient id="castleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          fill="url(#castleGradient)"
          d="M0,192L48,176C96,160,192,128,288,128C384,128,480,160,576,176C672,192,768,192,864,176C960,160,1056,128,1152,128C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
        <path
          fill="#0D1B4B"
          d="M200,320 L200,220 L220,220 L220,200 L240,180 L260,200 L260,220 L280,220 L280,320 Z
             M350,320 L350,180 L370,180 L370,160 L390,140 L410,160 L410,180 L430,180 L430,320 Z
             M500,320 L500,200 L520,200 L520,180 L540,160 L560,180 L560,200 L600,200 L600,180 L620,160 L640,180 L640,200 L660,200 L660,320 Z
             M750,320 L750,160 L770,160 L770,140 L790,100 L810,140 L810,160 L830,160 L830,320 Z
             M900,320 L900,220 L920,220 L920,200 L940,180 L960,200 L960,220 L1000,220 L1000,200 L1020,180 L1040,200 L1040,220 L1060,220 L1060,320 Z
             M1150,320 L1150,180 L1170,180 L1170,160 L1190,140 L1210,160 L1210,180 L1230,180 L1230,320 Z
             M1300,320 L1300,220 L1320,220 L1320,200 L1340,180 L1360,200 L1360,220 L1380,220 L1380,320 Z"
          style={{ filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.5))' }}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-disney-blue to-transparent" />
    </div>
  );
}
