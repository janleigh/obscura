const CRTEffects = () => {
	return (
		<>
			{/* Scanline effect */}
			<div className="animate-scanline pointer-events-none fixed inset-0 bg-linear-to-b from-transparent via-[rgba(255,255,255,0.02)] to-transparent bg-size-[100%_4px] opacity-20"></div>
			{/* Vignette effect */}
			<div className="pointer-events-none fixed inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]"></div>
			{/* CRT screen curvature overlay */}
			<div className="pointer-events-none fixed inset-0 rounded-sm shadow-[inset_0_0_4px_rgba(34,211,238,0.1)]"></div>
		</>
	);
};

export default CRTEffects;
