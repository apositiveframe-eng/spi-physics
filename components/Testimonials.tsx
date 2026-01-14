
import React from 'react';
import { Star, Quote } from 'lucide-react';

interface TestimonialsProps {
  theme?: 'dark' | 'light';
}

const Testimonials: React.FC<TestimonialsProps> = ({ theme = 'dark' }) => {
  const isLight = theme === 'light';
  
  const reviews = [
    {
      name: "Sarah J.",
      role: "RDMS Certified",
      content: "I failed the SPI exam twice before finding this. The way they explain the Doppler equations finally made it click for me. I passed with a 650!",
      rating: 5
    },
    {
      name: "Michael R.",
      role: "Sonography Student",
      content: "Physics has always been my weakest subject. This guide cuts out the fluff and focuses on what actually shows up on the test. Highly recommended.",
      rating: 5
    },
    {
      name: "Jessica T.",
      role: "Sonographer",
      content: "The video links for the artifact section were worth the price alone. I'm a visual learner and they helped clarify the concepts perfectly.",
      rating: 4
    }
  ];

  return (
    <div className={`py-24 relative overflow-hidden transition-colors duration-1000 ${isLight ? 'bg-light-primary' : 'bg-dark-primary'}`}>
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-900/10 blur-[80px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold-main/5 blur-[80px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className={`text-3xl md:text-5xl font-display font-bold text-center mb-16 uppercase tracking-widest ${isLight ? 'text-slate-900' : 'text-text-main'}`}>
          Student <span className="text-gold-main">Success Stories</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {reviews.map((review, index) => (
            <div key={index} className={`glass-panel p-8 transition-all duration-500 hover:-translate-y-1 relative group rounded-xl border ${isLight ? 'bg-white border-black/5 shadow-xl hover:border-gold-main/30' : 'border-white/5 hover:border-gold-main/30'}`}>
              <Quote className={`absolute top-6 right-6 w-8 h-8 opacity-5 transition-colors group-hover:opacity-20 ${isLight ? 'text-slate-900' : 'text-white'}`} />
              
              <div className="flex mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < review.rating ? 'text-gold-main fill-gold-main' : isLight ? 'text-slate-100' : 'text-dark-tertiary'}`} 
                  />
                ))}
              </div>
              
              <p className={`mb-8 italic relative z-10 font-light leading-relaxed font-serif ${isLight ? 'text-slate-600' : 'text-text-main'}`}>"{review.content}"</p>
              
              <div className={`flex items-center pt-6 border-t ${isLight ? 'border-black/5' : 'border-white/5'}`}>
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-display font-bold text-gold-main shadow-sm ${isLight ? 'bg-slate-50 border-black/5' : 'bg-dark-secondary border-gold-main/20'}`}>
                    {review.name.charAt(0)}
                </div>
                <div className="ml-3">
                    <p className={`font-bold text-sm font-sans ${isLight ? 'text-slate-900' : 'text-text-main'}`}>{review.name}</p>
                    <p className="text-xs text-gold-main/70 uppercase tracking-wider font-sans">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
