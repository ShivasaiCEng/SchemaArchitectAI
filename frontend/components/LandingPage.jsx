
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import { Layers, ArrowRight, Menu, X, Check, ArrowUpRight, Code, Database, Zap, Layout, LogOut, User as UserIcon } from 'lucide-react';

const LandingPage = ({ user, onGetStarted, onOpenAuth, onLogout }) => {
  const { isDark } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div 
      className="min-h-screen font-sans transition-colors duration-300"
      style={{
        backgroundColor: isDark ? '#09090b' : '#ffffff',
        color: isDark ? '#e4e4e7' : '#18181b'
      }}
    >
      
      {/* --- Navbar --- */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-8">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-black transition-transform group-hover:scale-110"
              style={{
                backgroundColor: isDark ? '#a3e635' : '#84cc16',
                boxShadow: isDark ? '0 0 15px rgba(163, 230, 53, 0.4)' : '0 0 15px rgba(132, 204, 22, 0.4)'
              }}
            >
               <Layers size={24} strokeWidth={3} />
            </div>
            <span 
              className="text-3xl font-bold tracking-tight"
              style={{ color: isDark ? '#ffffff' : '#18181b' }}
            >
              SchemaArchitect
            </span>
          </div>
          
          {/* Desktop Links */}
          <div 
            className="hidden xl:flex items-center gap-12 text-2xl font-medium transition-colors"
            style={{ color: isDark ? '#e4e4e7' : '#3f3f46' }}
          >
            <a 
              href="#about" 
              className="transition-colors"
              style={{ color: isDark ? '#e4e4e7' : '#3f3f46' }}
              onMouseEnter={(e) => e.target.style.color = isDark ? '#a3e635' : '#84cc16'}
              onMouseLeave={(e) => e.target.style.color = isDark ? '#e4e4e7' : '#3f3f46'}
            >
              About Us
            </a>
            <a 
              href="#features" 
              className="transition-colors"
              style={{ color: isDark ? '#e4e4e7' : '#3f3f46' }}
              onMouseEnter={(e) => e.target.style.color = isDark ? '#a3e635' : '#84cc16'}
              onMouseLeave={(e) => e.target.style.color = isDark ? '#e4e4e7' : '#3f3f46'}
            >
              Features
            </a>
            <a 
              href="#templates" 
              className="transition-colors"
              style={{ color: isDark ? '#e4e4e7' : '#3f3f46' }}
              onMouseEnter={(e) => e.target.style.color = isDark ? '#a3e635' : '#84cc16'}
              onMouseLeave={(e) => e.target.style.color = isDark ? '#e4e4e7' : '#3f3f46'}
            >
              Portfolio
            </a>
            <a 
              href="#blog" 
              className="transition-colors"
              style={{ color: isDark ? '#e4e4e7' : '#3f3f46' }}
              onMouseEnter={(e) => e.target.style.color = isDark ? '#a3e635' : '#84cc16'}
              onMouseLeave={(e) => e.target.style.color = isDark ? '#e4e4e7' : '#3f3f46'}
            >
              Blog
            </a>
            {/* Theme Toggle - positioned after Blog */}
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>
          
          {/* Action - Desktop only, hidden on mobile */}
          <div className="hidden xl:flex items-center gap-6">
            {user ? (
               <div className="flex items-center gap-6">
                  <div 
                    className="flex items-center gap-3"
                    style={{ color: isDark ? '#ffffff' : '#18181b' }}
                  >
                     <div 
                       className="w-10 h-10 rounded-full flex items-center justify-center border"
                       style={{
                         backgroundColor: isDark ? '#27272a' : '#e4e4e7',
                         borderColor: isDark ? '#3f3f46' : '#d4d4d8',
                         color: isDark ? '#a3e635' : '#84cc16'
                       }}
                     >
                        <UserIcon size={20} />
                     </div>
                     <span 
                       className="font-medium text-xl"
                       style={{ color: isDark ? '#ffffff' : '#18181b' }}
                     >
                       {user.name}
                     </span>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="p-2 transition-colors"
                    style={{ color: isDark ? '#a1a1aa' : '#3f3f46' }}
                    onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                    onMouseLeave={(e) => e.target.style.color = isDark ? '#a1a1aa' : '#3f3f46'}
                    title="Log Out"
                  >
                    <LogOut size={24} />
                  </button>
                  <button 
                     onClick={onGetStarted}
                     className="px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2 text-lg shadow-lg"
                     style={{
                       backgroundColor: isDark ? '#a3e635' : '#84cc16',
                       color: '#000000'
                     }}
                     onMouseEnter={(e) => {
                       e.target.style.backgroundColor = isDark ? '#84cc16' : '#65a30d';
                     }}
                     onMouseLeave={(e) => {
                       e.target.style.backgroundColor = isDark ? '#a3e635' : '#84cc16';
                     }}
                  >
                     Open App <ArrowRight size={20} />
                  </button>
               </div>
            ) : (
               <>
                  <button 
                    onClick={() => onOpenAuth('login')}
                    className="font-medium transition-colors px-4 text-xl"
                    style={{ color: isDark ? '#ffffff' : '#18181b' }}
                    onMouseEnter={(e) => e.target.style.color = isDark ? '#a3e635' : '#84cc16'}
                    onMouseLeave={(e) => e.target.style.color = isDark ? '#ffffff' : '#18181b'}
                  >
                    Log In
                  </button>
                  <button 
                    onClick={() => onOpenAuth('signup')}
                    className="px-6 py-3 border-2 rounded-full font-medium transition-all text-xl"
                    style={{
                      borderColor: isDark ? '#ffffff' : '#18181b',
                      color: isDark ? '#ffffff' : '#18181b',
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = isDark ? '#a3e635' : '#84cc16';
                      e.target.style.color = '#000000';
                      e.target.style.borderColor = isDark ? '#a3e635' : '#84cc16';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = isDark ? '#ffffff' : '#18181b';
                      e.target.style.borderColor = isDark ? '#ffffff' : '#18181b';
                    }}
                  >
                    Sign Up
                  </button>
               </>
            )}
          </div>
          
          {/* Mobile Menu Toggle - only visible on mobile/tablet (xl:hidden = hidden on screens >= 1280px) */}
          <button 
            className="xl:hidden transition-colors" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ color: isDark ? '#ffffff' : '#18181b' }}
            onMouseEnter={(e) => e.target.style.color = isDark ? '#a3e635' : '#84cc16'}
            onMouseLeave={(e) => e.target.style.color = isDark ? '#ffffff' : '#18181b'}
          >
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div 
            className="absolute top-24 left-4 right-4 border p-8 rounded-3xl flex flex-col gap-6 z-50 shadow-2xl animate-in slide-in-from-top-4 transition-colors duration-300"
            style={{
              backgroundColor: isDark ? '#18181b' : '#f4f4f5',
              borderColor: isDark ? '#27272a' : '#e4e4e7'
            }}
          >
            <a 
              href="#features" 
              className="font-bold text-2xl transition-colors"
              style={{ color: isDark ? '#e4e4e7' : '#18181b' }}
              onMouseEnter={(e) => e.target.style.color = isDark ? '#a3e635' : '#84cc16'}
              onMouseLeave={(e) => e.target.style.color = isDark ? '#e4e4e7' : '#18181b'}
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#templates" 
              className="font-bold text-2xl transition-colors"
              style={{ color: isDark ? '#e4e4e7' : '#18181b' }}
              onMouseEnter={(e) => e.target.style.color = isDark ? '#a3e635' : '#84cc16'}
              onMouseLeave={(e) => e.target.style.color = isDark ? '#e4e4e7' : '#18181b'}
              onClick={() => setIsMenuOpen(false)}
            >
              Templates
            </a>
            <a 
              href="#blog" 
              className="font-bold text-2xl transition-colors"
              style={{ color: isDark ? '#e4e4e7' : '#18181b' }}
              onMouseEnter={(e) => e.target.style.color = isDark ? '#a3e635' : '#84cc16'}
              onMouseLeave={(e) => e.target.style.color = isDark ? '#e4e4e7' : '#18181b'}
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </a>
            <div 
              className="h-px my-2"
              style={{ backgroundColor: isDark ? '#27272a' : '#e4e4e7' }}
            ></div>
            
            {user ? (
               <>
                 <div 
                   className="font-bold text-2xl"
                   style={{ color: isDark ? '#a3e635' : '#84cc16' }}
                 >
                   Hi, {user.name}
                 </div>
                 <button 
                   onClick={onGetStarted} 
                   className="w-full py-5 rounded-2xl font-bold text-xl transition-colors flex items-center justify-center gap-2"
                   style={{
                     backgroundColor: isDark ? '#a3e635' : '#84cc16',
                     color: '#000000'
                   }}
                   onMouseEnter={(e) => {
                     e.target.style.backgroundColor = isDark ? '#84cc16' : '#65a30d';
                   }}
                   onMouseLeave={(e) => {
                     e.target.style.backgroundColor = isDark ? '#a3e635' : '#84cc16';
                   }}
                 >
                    Go to App <ArrowRight />
                 </button>
                 <button 
                   onClick={() => { onLogout(); setIsMenuOpen(false); }} 
                   className="font-bold text-xl text-left transition-colors"
                   style={{ color: '#ef4444' }}
                 >
                    Log Out
                 </button>
               </>
            ) : (
               <>
                 <button 
                   onClick={() => { onOpenAuth('login'); setIsMenuOpen(false); }} 
                   className="font-bold text-2xl text-left transition-colors"
                   style={{ color: isDark ? '#e4e4e7' : '#18181b' }}
                   onMouseEnter={(e) => e.target.style.color = isDark ? '#a3e635' : '#84cc16'}
                   onMouseLeave={(e) => e.target.style.color = isDark ? '#e4e4e7' : '#18181b'}
                 >
                   Log In
                 </button>
                 <button 
                   onClick={() => { onOpenAuth('signup'); setIsMenuOpen(false); }} 
                   className="w-full py-5 rounded-2xl font-bold text-xl transition-colors"
                   style={{
                     backgroundColor: isDark ? '#a3e635' : '#84cc16',
                     color: '#000000'
                   }}
                   onMouseEnter={(e) => {
                     e.target.style.backgroundColor = isDark ? '#84cc16' : '#65a30d';
                   }}
                   onMouseLeave={(e) => {
                     e.target.style.backgroundColor = isDark ? '#a3e635' : '#84cc16';
                   }}
                 >
                   Sign Up Free
                 </button>
               </>
            )}
          </div>
        )}
      </nav>

      {/* --- Hero Section --- */}
      <div 
        className="relative pt-40 pb-16 md:pt-56 md:pb-32 overflow-hidden transition-colors duration-300"
        style={{
          backgroundColor: isDark ? '#111111' : '#f4f4f5'
        }}
      >
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
           {/* Abstract B&W Office/Tech Background */}
           <img 
             src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop&grayscale" 
             alt="Background" 
             className="w-full h-full object-cover transition-all duration-300"
             style={{
               opacity: isDark ? 0.3 : 0.15,
               filter: isDark ? 'brightness(1.2) contrast(1.1)' : 'brightness(0.9) contrast(1)',
               mixBlendMode: isDark ? 'screen' : 'multiply'
             }}
           />
           <div 
             className="absolute inset-0 transition-colors duration-300"
             style={{
               background: isDark 
                 ? 'linear-gradient(to bottom, rgba(17, 17, 17, 0.7), rgba(17, 17, 17, 0.5), rgba(17, 17, 17, 0.9))'
                 : 'linear-gradient(to bottom, rgba(244, 244, 245, 0.7), rgba(244, 244, 245, 0.5), rgba(244, 244, 245, 0.9))'
             }}
           ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <h1 
              className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-8 transition-colors duration-300"
              style={{ color: isDark ? '#ffffff' : '#18181b' }}
            >
              Designing <span 
                className="inline-block px-6 py-1 rounded-full transform -rotate-2 mx-2"
                style={{
                  backgroundColor: isDark ? '#a3e635' : '#84cc16',
                  color: '#000000'
                }}
              >
                visual
              </span> <br />
              and backend <br />
              <span 
                className="inline-block px-6 py-1 rounded-full transform rotate-1 mx-2"
                style={{
                  backgroundColor: isDark ? '#a3e635' : '#84cc16',
                  color: '#000000'
                }}
              >
                schemas
              </span>
            </h1>
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mt-12">
               <p 
                 className="text-lg md:text-xl max-w-md leading-relaxed transition-colors duration-300"
                 style={{ color: isDark ? '#a1a1aa' : '#3f3f46' }}
               >
                 We design exceptional backend architectures, Mongoose models, and SQL schemas for startups and enterprises.
               </p>
               
               {/* Circular CTA */}
               <div className="relative group cursor-pointer" onClick={onGetStarted}>
                  <div className="absolute inset-0 bg-lime-400 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                  <div className="relative w-24 h-24 md:w-32 md:h-32 bg-lime-400 rounded-full flex items-center justify-center transition-transform transform group-hover:scale-105 group-hover:rotate-12">
                     <ArrowUpRight size={48} className="text-black" />
                  </div>
                  {/* Circular Text */}
                  <div className="absolute inset-0 w-full h-full animate-spin-slow pointer-events-none opacity-0 md:opacity-100">
                     <svg viewBox="0 0 100 100" width="100%" height="100%">
                        <defs>
                           <path id="circle" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                        </defs>
                        <text fontSize="11" fontWeight="bold" fill="white">
                           <textPath xlinkHref="#circle">
                              START DESIGNING • GENERATE CODE •
                           </textPath>
                        </text>
                     </svg>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Marquee Strip --- */}
      <div className="bg-lime-400 py-5 overflow-hidden border-y-4 border-black">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 4 }).map((_, i) => (
             <React.Fragment key={i}>
                <span className="text-xl md:text-2xl font-bold text-black uppercase mx-8 flex items-center gap-4">
                   Visual Design <Asterisk /> Backend Generation <Asterisk /> API Testing <Asterisk /> SQL & NoSQL <Asterisk />
                </span>
             </React.Fragment>
          ))}
        </div>
      </div>

      {/* --- Intro Section --- */}
      <div 
        className="py-32 px-6 md:px-12 border-b transition-colors duration-300"
        style={{
          backgroundColor: isDark ? '#18181b' : '#fdfdf0',
          borderColor: isDark ? '#27272a' : '#e4e4e7'
        }}
      >
         <div className="max-w-[1600px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-20 lg:gap-32 items-start">
               
               {/* Left Column: Heading */}
               <div className="flex flex-col items-start">
                  <div 
                    className="w-16 h-1.5 mb-8"
                    style={{ backgroundColor: isDark ? '#a3e635' : '#84cc16' }}
                  ></div>
                  <h2 
                    className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight transition-colors duration-300"
                    style={{ color: isDark ? '#ffffff' : '#18181b' }}
                  >
                     Backend problems <br />
                     and their best <br />
                     <span className="relative inline-flex items-center gap-4">
                        solutions
                        <div 
                          className="animate-pulse"
                          style={{ color: isDark ? '#a3e635' : '#84cc16' }}
                        >
                           <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                              <rect x="12" y="2" width="10" height="10" />
                              <rect x="2" y="12" width="10" height="10" style={{ opacity: 0.6 }} />
                           </svg>
                        </div>
                     </span>
                  </h2>
               </div>

               {/* Right Column: Content */}
               <div>
                  <p 
                    className="text-2xl md:text-3xl leading-relaxed mb-16 font-medium transition-colors duration-300"
                    style={{ color: isDark ? '#e4e4e7' : '#3f3f46' }}
                  >
                     Crafting compelling database architectures that captivate developers and drive meaningful applications. Our digital tool combines innovation, strategy, and expertise to fuel your online success. No more boilerplate fatigue.
                  </p>
                  
                  <div className="flex flex-col md:flex-row items-center gap-10">
                     {/* Circular Button */}
                     <button 
                       className="flex-shrink-0 w-24 h-24 rounded-full border flex items-center justify-center transition-all duration-300 group cursor-pointer shadow-lg"
                       style={{
                         borderColor: isDark ? '#3f3f46' : '#d4d4d8',
                         backgroundColor: isDark ? '#27272a' : '#ffffff'
                       }}
                       onMouseEnter={(e) => {
                         e.target.style.backgroundColor = isDark ? '#a3e635' : '#84cc16';
                         e.target.style.borderColor = isDark ? '#a3e635' : '#84cc16';
                       }}
                       onMouseLeave={(e) => {
                         e.target.style.backgroundColor = isDark ? '#27272a' : '#ffffff';
                         e.target.style.borderColor = isDark ? '#3f3f46' : '#d4d4d8';
                       }}
                     >
                        <ArrowUpRight 
                          size={36} 
                          className="transition-colors"
                          style={{ color: isDark ? '#a1a1aa' : '#3f3f46' }}
                          onMouseEnter={(e) => e.target.style.color = '#000000'}
                          onMouseLeave={(e) => e.target.style.color = isDark ? '#a1a1aa' : '#3f3f46'}
                        />
                     </button>
                     
                     {/* Image */}
                     <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-2xl relative group flex-1">
                        <div 
                          className="absolute inset-0 transition-colors z-10"
                          style={{
                            backgroundColor: isDark ? 'rgba(163, 230, 53, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = isDark ? 'rgba(163, 230, 53, 0.1)' : 'rgba(0, 0, 0, 0.1)';
                          }}
                        ></div>
                        <img 
                          src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1740&auto=format&fit=crop" 
                          className="object-cover w-full h-full transition-all duration-700 scale-100 group-hover:scale-105" 
                          alt="Team working"
                          style={{
                            filter: isDark 
                              ? 'grayscale(0.3) brightness(1.3) contrast(1.2)' 
                              : 'grayscale(0.5) brightness(0.95)',
                            mixBlendMode: isDark ? 'screen' : 'normal'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.filter = isDark 
                              ? 'grayscale(0) brightness(1.4) contrast(1.3)' 
                              : 'grayscale(0) brightness(1)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.filter = isDark 
                              ? 'grayscale(0.3) brightness(1.3) contrast(1.2)' 
                              : 'grayscale(0.5) brightness(0.95)';
                          }}
                        />
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </div>

      {/* --- Services Grid --- */}
      <div 
        className="py-24 px-6 md:px-12 transition-colors duration-300"
        style={{
          backgroundColor: isDark ? '#111111' : '#f4f4eb'
        }}
      >
         {/* WIDER CONTAINER: max-w-[1600px] */}
         <div className="max-w-[1600px] mx-auto">
            <div className="mb-16">
               <h3 
                 className="text-5xl md:text-6xl font-bold leading-tight transition-colors duration-300"
                 style={{ color: isDark ? '#ffffff' : '#18181b' }}
               >
                  Explore unique schema <br /> architect services
               </h3>
               <p 
                 className="mt-6 max-w-xl text-2xl transition-colors duration-300"
                 style={{ color: isDark ? '#a1a1aa' : '#52525b' }}
               >
                  Visual modeling meets production code. Automatically generate Typescript interfaces, Mongoose models, and SQL migrations.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
               
               {/* Card 1 */}
               <div 
                 className="p-10 mb-8 rounded-xl transition-colors group cursor-pointer flex flex-col h-full shadow-sm hover:shadow-xl"
                 style={{
                   backgroundColor: isDark ? '#18181b' : '#e4e4db'
                 }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.backgroundColor = isDark ? '#27272a' : '#ffffff';
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.backgroundColor = isDark ? '#18181b' : '#e4e4db';
                 }}
               >
                  <div className="mb-8 flex justify-between items-start">
                     <div 
                       className="p-4 rounded-lg inline-block text-black group-hover:scale-110 transition-transform"
                       style={{
                         backgroundColor: isDark ? '#a3e635' : '#84cc16'
                       }}
                     >
                        <Layout size={36} />
                     </div>
                     <ArrowUpRight 
                       className="transition-colors" 
                       size={32}
                       style={{ color: isDark ? '#a1a1aa' : '#3f3f46' }}
                       onMouseEnter={(e) => e.target.style.color = '#000000'}
                       onMouseLeave={(e) => e.target.style.color = isDark ? '#a1a1aa' : '#3f3f46'}
                     />
                  </div>
                  <h4 
                    className="text-3xl font-bold mb-8 transition-colors duration-300"
                    style={{ color: isDark ? '#ffffff' : '#18181b' }}
                  >
                     Visual Schema Design
                  </h4>
                  <ul className="space-y-4 mt-auto">
                     <ListItem dark={isDark}>Drag & Drop Interface</ListItem>
                     <ListItem dark={isDark}>One-to-Many Relations</ListItem>
                     <ListItem dark={isDark}>Live Validation</ListItem>
                  </ul>
               </div>

               {/* Card 2 (Dark) */}
               <div 
                 className="p-10 mb-8 rounded-xl group cursor-pointer relative overflow-hidden flex flex-col h-full shadow-2xl transition-colors duration-300"
                 style={{
                   backgroundColor: isDark ? '#27272a' : '#18181b',
                   color: isDark ? '#ffffff' : '#ffffff'
                 }}
               >
                  <div 
                    className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full blur-3xl opacity-50"
                    style={{
                      backgroundColor: isDark ? '#3f3f46' : '#27272a'
                    }}
                  ></div>
                  <div className="mb-8 flex justify-between items-start">
                     <div 
                       className="p-4 rounded-lg inline-block group-hover:scale-110 transition-transform"
                       style={{
                         backgroundColor: isDark ? '#ffffff' : '#ffffff',
                         color: '#000000'
                       }}
                     >
                        <Code size={36} />
                     </div>
                     <div 
                       className="w-2.5 h-2.5 rounded-full"
                       style={{ backgroundColor: isDark ? '#a3e635' : '#84cc16' }}
                     ></div>
                  </div>
                  <h4 
                    className="text-3xl font-bold mb-8"
                    style={{ color: isDark ? '#ffffff' : '#ffffff' }}
                  >
                     Backend Generation
                  </h4>
                  <ul className="space-y-4 mt-auto">
                     <ListItem dark={true}>Node.js & Express</ListItem>
                     <ListItem dark={true}>Mongoose & Sequelize</ListItem>
                     <ListItem dark={true}>Zod Validation</ListItem>
                  </ul>
                  
                  {/* Corner Accent */}
                  <div 
                    className="absolute bottom-0 right-0 w-10 h-10 rounded-tl-xl"
                    style={{
                      backgroundColor: isDark ? '#3f3f46' : '#27272a'
                    }}
                  >
                     <div 
                       className="absolute bottom-0 right-0 w-5 h-5 rounded-tl-lg"
                       style={{ backgroundColor: isDark ? '#a3e635' : '#84cc16' }}
                     ></div>
                  </div>
               </div>

               {/* Card 3 */}
               <div 
                 className="p-10 mb-8 rounded-xl transition-colors group cursor-pointer flex flex-col h-full shadow-sm hover:shadow-xl"
                 style={{
                   backgroundColor: isDark ? '#18181b' : '#e4e4db'
                 }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.backgroundColor = isDark ? '#27272a' : '#ffffff';
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.backgroundColor = isDark ? '#18181b' : '#e4e4db';
                 }}
               >
                  <div className="mb-8 flex justify-between items-start">
                     <div 
                       className="p-4 rounded-lg inline-block text-black group-hover:scale-110 transition-transform"
                       style={{
                         backgroundColor: isDark ? '#a3e635' : '#84cc16'
                       }}
                     >
                        <Database size={36} />
                     </div>
                     <ArrowUpRight 
                       className="transition-colors" 
                       size={32}
                       style={{ color: isDark ? '#a1a1aa' : '#3f3f46' }}
                       onMouseEnter={(e) => e.target.style.color = '#000000'}
                       onMouseLeave={(e) => e.target.style.color = isDark ? '#a1a1aa' : '#3f3f46'}
                     />
                  </div>
                  <h4 
                    className="text-3xl font-bold mb-8 transition-colors duration-300"
                    style={{ color: isDark ? '#ffffff' : '#18181b' }}
                  >
                     SQL & NoSQL
                  </h4>
                  <ul className="space-y-4 mt-auto">
                     <ListItem dark={isDark}>PostgreSQL Support</ListItem>
                     <ListItem dark={isDark}>MongoDB Support</ListItem>
                     <ListItem dark={isDark}>MySQL Support</ListItem>
                  </ul>
               </div>

            </div>
         </div>
      </div>

      {/* --- Footer CTA --- */}
      <div 
        className="py-24 px-6 text-center transition-colors duration-300"
        style={{
          backgroundColor: isDark ? '#a3e635' : '#84cc16'
        }}
      >
         <h2 
           className="text-4xl md:text-5xl font-bold mb-8 max-w-4xl mx-auto leading-tight transition-colors duration-300"
           style={{ color: '#000000' }}
         >
            Ready to structure your <br /> next big idea?
         </h2>
         <div className="flex justify-center gap-4">
             <button 
               onClick={onGetStarted} 
               className="px-8 py-4 rounded-full font-bold text-lg transition-colors flex items-center gap-2"
               style={{
                 backgroundColor: '#000000',
                 color: '#ffffff'
               }}
               onMouseEnter={(e) => {
                 e.target.style.backgroundColor = isDark ? '#18181b' : '#27272a';
               }}
               onMouseLeave={(e) => {
                 e.target.style.backgroundColor = '#000000';
               }}
             >
                Launch Architect <ArrowRight size={20} />
             </button>
             <button 
               className="px-8 py-4 bg-transparent border-2 rounded-full font-bold text-lg transition-colors"
               style={{
                 borderColor: '#000000',
                 color: '#000000'
               }}
               onMouseEnter={(e) => {
                 e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
               }}
               onMouseLeave={(e) => {
                 e.target.style.backgroundColor = 'transparent';
               }}
             >
                View Demos
             </button>
         </div>
      </div>

      {/* --- Simple Footer --- */}
      <footer 
        className="py-12 px-6 border-t transition-colors duration-300"
        style={{
          backgroundColor: isDark ? '#111111' : '#f4f4f5',
          borderColor: isDark ? '#27272a' : '#e4e4e7'
        }}
      >
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div 
              className="flex items-center gap-2 font-bold transition-colors duration-300"
              style={{ color: isDark ? '#ffffff' : '#18181b' }}
            >
               <div 
                 className="w-6 h-6 rounded-full"
                 style={{ backgroundColor: isDark ? '#a3e635' : '#84cc16' }}
               ></div>
               SchemaArchitect
            </div>
            <div className="flex gap-8 text-sm">
               <a 
                 href="#" 
                 className="transition-colors"
                 style={{ color: isDark ? '#a1a1aa' : '#3f3f46' }}
                 onMouseEnter={(e) => e.target.style.color = isDark ? '#ffffff' : '#18181b'}
                 onMouseLeave={(e) => e.target.style.color = isDark ? '#a1a1aa' : '#3f3f46'}
               >
                  Privacy
               </a>
               <a 
                 href="#" 
                 className="transition-colors"
                 style={{ color: isDark ? '#a1a1aa' : '#3f3f46' }}
                 onMouseEnter={(e) => e.target.style.color = isDark ? '#ffffff' : '#18181b'}
                 onMouseLeave={(e) => e.target.style.color = isDark ? '#a1a1aa' : '#3f3f46'}
               >
                  Terms
               </a>
               <a 
                 href="#" 
                 className="transition-colors"
                 style={{ color: isDark ? '#a1a1aa' : '#3f3f46' }}
                 onMouseEnter={(e) => e.target.style.color = isDark ? '#ffffff' : '#18181b'}
                 onMouseLeave={(e) => e.target.style.color = isDark ? '#a1a1aa' : '#3f3f46'}
               >
                  Cookies
               </a>
            </div>
            <div 
              className="text-sm transition-colors duration-300"
              style={{ color: isDark ? '#a1a1aa' : '#3f3f46' }}
            >
               © 2025 Design. All rights reserved.
            </div>
         </div>
      </footer>

    </div>
  );
};

// --- Helpers ---

const Asterisk = () => (
   <div className="text-black">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L14.5 9.5H22L16 14L18.5 21.5L12 17L5.5 21.5L8 14L2 9.5H9.5L12 2Z" /></svg>
   </div>
);

const ListItem = ({ children, dark }) => {
  return (
    <li 
      className="flex items-center gap-3 text-xl transition-colors duration-300"
      style={{ 
        color: dark ? '#a1a1aa' : '#52525b' 
      }}
    >
      <div 
        className="w-2.5 h-2.5 flex-shrink-0"
        style={{ 
          backgroundColor: dark ? '#a3e635' : '#84cc16' 
        }}
      ></div>
      {children}
    </li>
  );
};

export default LandingPage;

