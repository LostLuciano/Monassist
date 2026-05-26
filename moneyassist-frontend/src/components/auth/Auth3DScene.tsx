import { useEffect, useRef } from 'react';

export default function Auth3DScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = canvas.clientWidth || 500;
    let height = canvas.height = canvas.clientHeight || 500;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.clientWidth || 500;
      height = canvas.height = canvas.clientHeight || 500;
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const w = width || 500;
      const h = height || 500;
      const x = e.clientX - rect.left - w / 2;
      const y = e.clientY - rect.top - h / 2;
      mouseRef.current.targetX = x / (w / 2); // normalized -1 to 1
      mouseRef.current.targetY = y / (h / 2);
    };

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // 3D Math Types
    interface Point3D {
      x: number;
      y: number;
      z: number;
    }

    // 3D Particle Type
    interface Particle {
      x: number;
      y: number;
      z: number;
      size: number;
      speed: number;
      color: string;
    }

    // Initialize particles
    const particleCount = isMobile ? 20 : 45;
    const particles: Particle[] = Array.from({ length: particleCount }, () => {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const dist = 120 + Math.random() * 150;
      return {
        x: dist * Math.sin(phi) * Math.cos(theta),
        y: dist * Math.sin(phi) * Math.sin(theta),
        z: dist * Math.cos(phi),
        size: 1 + Math.random() * 2,
        speed: 0.02 + Math.random() * 0.03,
        color: Math.random() > 0.4 ? 'rgba(20, 184, 166, 0.6)' : 'rgba(6, 182, 212, 0.4)', // Teal vs Cyan
      };
    });

    let time = 0;

    // Helper functions for 3D rotation
    const rotateX = (p: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: p.x,
        y: p.y * cos - p.z * sin,
        z: p.y * sin + p.z * cos,
      };
    };

    const rotateY = (p: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: p.x * cos + p.z * sin,
        y: p.y,
        z: -p.x * sin + p.z * cos,
      };
    };

    const rotateZ = (p: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: p.x * cos - p.y * sin,
        y: p.x * sin + p.y * cos,
        z: p.z,
      };
    };

    // Perspective projection
    const fov = 350;
    const project = (p: Point3D): { x: number; y: number; scale: number; z: number } => {
      const distance = 380;
      const sz = p.z + distance;
      const scale = fov / Math.max(1, sz);
      return {
        x: width / 2 + p.x * scale,
        y: height / 2 + p.y * scale,
        scale,
        z: sz,
      };
    };

    // Main animation loop
    const tick = () => {
      time += 0.01;

      // Clear with background color gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#0f172a'); // slate-900
      bgGrad.addColorStop(1, '#020617'); // slate-950
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw digital HUD grid background (perspective lines)
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.07)';
      ctx.lineWidth = 1;
      const gridCount = 20;
      const gridSpacing = 30;
      const gridY = 130;

      for (let i = -gridCount; i <= gridCount; i++) {
        // Parallel grid lines going into screen (along Z)
        let p1 = { x: i * gridSpacing, y: gridY, z: -200 };
        let p2 = { x: i * gridSpacing, y: gridY, z: 200 };
        // Apply camera tilt
        p1 = rotateX(p1, 0.3);
        p2 = rotateX(p2, 0.3);
        const proj1 = project(p1);
        const proj2 = project(p2);
        ctx.beginPath();
        ctx.moveTo(proj1.x, proj1.y);
        ctx.lineTo(proj2.x, proj2.y);
        ctx.stroke();

        // Cross lines (along X)
        let p3 = { x: -gridCount * gridSpacing, y: gridY, z: i * gridSpacing };
        let p4 = { x: gridCount * gridSpacing, y: gridY, z: i * gridSpacing };
        p3 = rotateX(p3, 0.3);
        p4 = rotateX(p4, 0.3);
        const proj3 = project(p3);
        const proj4 = project(p4);
        ctx.beginPath();
        ctx.moveTo(proj3.x, proj3.y);
        ctx.lineTo(proj4.x, proj4.y);
        ctx.stroke();
      }

      // Smooth mouse interpolation (lerp)
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Base rotations
      const rotY = time * 0.4 + mouse.x * 0.4;
      const rotX = Math.sin(time * 0.2) * 0.15 + mouse.y * 0.3;
      const rotZ = Math.cos(time * 0.3) * 0.05;

      // 1. Draw and animate particles (draw those in the background first)
      particles.forEach((p, idx) => {
        // Orbit particle around center
        let pt = { x: p.x, y: p.y, z: p.z };
        pt = rotateY(pt, time * p.speed);
        pt = rotateX(pt, rotX);
        pt = rotateY(pt, rotY * 0.2); // Add mild global rotation
        
        const proj = project(pt);

        // Don't draw if behind camera
        if (proj.z <= 0) return;

        // Pulse size slightly
        const pulse = Math.sin(time * 3 + idx) * 0.3 + 1;
        const r = p.size * proj.scale * pulse;

        // Particle core
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, Math.max(0.5, r), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Particle glow ring (safe fallback instead of slow CPU shadowBlur)
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, Math.max(1, r * 1.8), 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('0.6', '0.15').replace('0.4', '0.1');
        ctx.fill();
      });

      // 2. Draw holographic dashboard circle base
      const circleSegments = 64;
      
      // Draw outer glowing circle (thicker, faint cyan)
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      for (let i = 0; i <= circleSegments; i++) {
        const theta = (i / circleSegments) * Math.PI * 2;
        let pt = { x: Math.cos(theta) * 160, y: 70, z: Math.sin(theta) * 160 };
        pt = rotateX(pt, rotX);
        pt = rotateY(pt, rotY * 0.3);
        const proj = project(pt);
        if (i === 0) ctx.moveTo(proj.x, proj.y);
        else ctx.lineTo(proj.x, proj.y);
      }
      ctx.stroke();

      // Draw inner sharp circle (thinner, clear cyan)
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i <= circleSegments; i++) {
        const theta = (i / circleSegments) * Math.PI * 2;
        let pt = { x: Math.cos(theta) * 160, y: 70, z: Math.sin(theta) * 160 };
        pt = rotateX(pt, rotX);
        pt = rotateY(pt, rotY * 0.3);
        const proj = project(pt);
        if (i === 0) ctx.moveTo(proj.x, proj.y);
        else ctx.lineTo(proj.x, proj.y);
      }
      ctx.stroke();

      // Draw secondary rotating HUD ring
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.3)';
      ctx.setLineDash([10, 15]);
      ctx.beginPath();
      for (let i = 0; i <= circleSegments; i++) {
        const theta = (i / circleSegments) * Math.PI * 2 + time * 0.2;
        let pt = { x: Math.cos(theta) * 130, y: 72, z: Math.sin(theta) * 130 };
        pt = rotateX(pt, rotX);
        pt = rotateY(pt, rotY * 0.3);
        const proj = project(pt);
        if (i === 0) ctx.moveTo(proj.x, proj.y);
        else ctx.lineTo(proj.x, proj.y);
      }
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // 3. Draw a 3D Glassmorphic Card (centered at 0, -25, 0)
      const cardCenter = { x: 0, y: -25, z: 0 };
      const cardWidth = 200;
      const cardHeight = 120;

      // Draw Card Plane with 3D projection
      // To draw text and details correctly projected onto the 3D plane:
      // We calculate the 3D position of the card's Origin, local X axis, and local Y axis.
      const origin3D = cardCenter;

      // Rotate all basis vectors
      const rot = (p: Point3D) => rotateY(rotateX(rotateZ(p, rotZ), rotX), rotY);
      
      const rotatedOrigin = rot(origin3D);
      // Get rotated basis directions
      let dirX = rot({ x: origin3D.x + 1, y: origin3D.y, z: origin3D.z });
      let dirY = rot({ x: origin3D.x, y: origin3D.y + 1, z: origin3D.z });

      // Project
      const oProj = project(rotatedOrigin);
      const xProj = project(dirX);
      const yProj = project(dirY);

      // Basis vectors projected onto 2D screen
      const ux = { x: xProj.x - oProj.x, y: xProj.y - oProj.y };
      const uy = { x: yProj.x - oProj.x, y: yProj.y - oProj.y };

      // Apply transform matrix to project 2D drawings onto the 3D card surface!
      ctx.save();
      // Set the context transform: horizontal scaling/skewing, vertical scaling/skewing, translation
      ctx.transform(ux.x, ux.y, uy.x, uy.y, oProj.x, oProj.y);

      // --- ANY DRAWING FROM HERE IS ON THE 3D CARD SURFACE (Local coordinates: -100 to 100 X, -60 to 60 Y) ---
      
      // Card glass background
      const cardGrad = ctx.createLinearGradient(-cardWidth/2, -cardHeight/2, cardWidth/2, cardHeight/2);
      cardGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      cardGrad.addColorStop(0.5, 'rgba(20, 184, 166, 0.08)');
      cardGrad.addColorStop(1, 'rgba(6, 182, 212, 0.25)');
      
      ctx.fillStyle = cardGrad;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.5;

      // Draw glassmorphic rounded rect
      const radius = 10;
      const x_min = -cardWidth / 2;
      const x_max = cardWidth / 2;
      const y_min = -cardHeight / 2;
      const y_max = cardHeight / 2;

      ctx.beginPath();
      ctx.moveTo(x_min + radius, y_min);
      ctx.lineTo(x_max - radius, y_min);
      ctx.quadraticCurveTo(x_max, y_min, x_max, y_min + radius);
      ctx.lineTo(x_max, y_max - radius);
      ctx.quadraticCurveTo(x_max, y_max, x_max - radius, y_max);
      ctx.lineTo(x_min + radius, y_max);
      ctx.quadraticCurveTo(x_min, y_max, x_min, y_max - radius);
      ctx.lineTo(x_min, y_min + radius);
      ctx.quadraticCurveTo(x_min, y_min, x_min + radius, y_min);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Card shine glare overlay
      const shineGrad = ctx.createLinearGradient(-cardWidth, -cardHeight, cardWidth * 1.5, cardHeight);
      const shinePos = Math.sin(time) * 0.5 + 0.5;
      shineGrad.addColorStop(Math.max(0, shinePos - 0.15), 'rgba(255,255,255,0)');
      shineGrad.addColorStop(shinePos, 'rgba(255, 255, 255, 0.18)');
      shineGrad.addColorStop(Math.min(1, shinePos + 0.15), 'rgba(255,255,255,0)');
      ctx.fillStyle = shineGrad;
      ctx.fill();

      // Draw MoneyAssist Brand Logo on Card
      // Glowing green dot
      ctx.beginPath();
      ctx.arc(-80, -35, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#14b8a6'; // Teal
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-72, -35, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(6, 182, 212, 0.85)'; // Cyan
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('MoneyAssist', -58, -32);

      // Gold smart chip on Card
      const chipX = -78;
      const chipY = -12;
      const chipW = 22;
      const chipH = 18;
      const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + chipW, chipY + chipH);
      chipGrad.addColorStop(0, '#facc15'); // Yellow-400
      chipGrad.addColorStop(1, '#ca8a04'); // Yellow-600
      ctx.fillStyle = chipGrad;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(chipX, chipY, chipW, chipH, 3) : ctx.rect(chipX, chipY, chipW, chipH);
      ctx.fill();
      // Chip grid lines
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(chipX + chipW/2, chipY);
      ctx.lineTo(chipX + chipW/2, chipY + chipH);
      ctx.moveTo(chipX, chipY + chipH/2);
      ctx.lineTo(chipX + chipW, chipY + chipH/2);
      ctx.stroke();

      // Card Numbers
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = 'medium 11px Courier, monospace';
      ctx.fillText('••••   ••••   ••••   2026', -78, 22);

      // User / Expiry Details
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '7px sans-serif';
      ctx.fillText('CARDHOLDER', -78, 40);
      ctx.fillText('VALID THRU', 35, 40);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText('FUTURE MEMBER', -78, 50);
      ctx.fillText('12/30', 35, 50);

      // Holographic contactless symbol
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(-45, -12, 5 + i * 3, -Math.PI / 4, Math.PI / 4);
        ctx.stroke();
      }

      ctx.restore(); // Restore context back from card plane transform

      // 4. Draw a 3D Floating Gold Coin spinning next to the card
      const coinOrbitRadius = 120;
      const coinAngle = time * 0.9;
      // Orbiting coordinates relative to center
      const coinCenter = {
        x: Math.cos(coinAngle) * coinOrbitRadius,
        y: Math.sin(time * 0.7) * 20 - 20, // bounce up/down
        z: Math.sin(coinAngle) * coinOrbitRadius * 0.8 // Depth offset
      };

      // Apply same camera rotations to coin center
      const rotatedCoinCenter = rot(coinCenter);
      const cProj = project(rotatedCoinCenter);

      if (cProj.z > 0) {
        // Draw 3D Coin
        const coinSize = 18;
        const spinAngle = time * 1.5; // Coin self rotation

        ctx.save();
        // Compute basis vectors for the coin plane
        // A coin spins around its Y axis
        const coinOriginRotated = rot(coinCenter);
        const coinXRotated = rot({ x: coinCenter.x + Math.cos(spinAngle), y: coinCenter.y, z: coinCenter.z + Math.sin(spinAngle) });
        const coinYRotated = rot({ x: coinCenter.x, y: coinCenter.y + 1, z: coinCenter.z });

        const coProj = project(coinOriginRotated);
        const cxProj = project(coinXRotated);
        const cyProj = project(coinYRotated);

        const cux = { x: cxProj.x - coProj.x, y: cxProj.y - coProj.y };
        const cuy = { x: cyProj.x - coProj.x, y: cyProj.y - coProj.y };

        // Draw multiple offset layers to simulate thickness (3D depth)
        const thickness = 4;

        for (let t = thickness; t >= 0; t--) {
          ctx.save();
          // Offset each layer slightly in 3D (along coin Z vector)
          // The coin normal vector in local space is (-sin(spinAngle), 0, cos(spinAngle))
          const normal3D = {
            x: -Math.sin(spinAngle),
            y: 0,
            z: Math.cos(spinAngle)
          };
          const layerOffset = rot({
            x: coinCenter.x + normal3D.x * t * 0.8,
            y: coinCenter.y + normal3D.y * t * 0.8,
            z: coinCenter.z + normal3D.z * t * 0.8
          });
          const lProj = project(layerOffset);

          ctx.transform(cux.x, cux.y, cuy.x, cuy.y, lProj.x, lProj.y);

          // Coin rim color
          const isEdge = t > 0;
          ctx.fillStyle = isEdge ? '#b45309' : '#facc15'; // Darker gold for rim, bright gold for face
          ctx.strokeStyle = '#ca8a04';
          ctx.lineWidth = 1;

          ctx.beginPath();
          ctx.arc(0, 0, coinSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Face details (only on front layer)
          if (!isEdge) {
            // Inner circle border
            ctx.strokeStyle = '#b45309';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.arc(0, 0, coinSize * 0.78, 0, Math.PI * 2);
            ctx.stroke();

            // Dollar Sign "$"
            ctx.fillStyle = '#b45309';
            ctx.font = `bold ${coinSize * 0.9}px Courier, monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('$', 0, 0);
          }
          ctx.restore();
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[300px] md:min-h-0 overflow-hidden flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full block touch-none"
      />
      {/* Absolute overlay info details */}
      <div className="absolute bottom-10 left-10 right-10 z-10 pointer-events-none text-white select-none hidden md:block">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
          Smarter Money Management
        </h2>
        <p className="text-gray-400 text-sm mt-2 max-w-sm leading-relaxed">
          Unlock the power of automated savings tracking, interactive visual insights, and an AI-driven personal helper.
        </p>
      </div>
    </div>
  );
}
