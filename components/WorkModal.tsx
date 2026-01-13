import React, { useEffect, useRef, useState } from 'react';
import { WorkItem } from '../types';
import gsap from 'gsap';
import { TRANSLATIONS } from '../translations';

interface WorkModalProps {
    work: WorkItem | null;
    onClose: () => void;
    lang: 'EN' | 'PT';
}

const WorkModal: React.FC<WorkModalProps> = ({ work, onClose, lang }) => {
    const t = TRANSLATIONS[lang];
    const overlayRef = useRef<HTMLDivElement>(null);
    const modalContainerRef = useRef<HTMLDivElement>(null);
    const mediaContainerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [activeWork, setActiveWork] = useState<WorkItem | null>(null);

    useEffect(() => {
        if (work) {
            setActiveWork(work);
            document.body.style.overflow = 'hidden';
            document.documentElement.classList.add('modal-open');
        }
    }, [work]);

    // GSAP Entrance Animation
    useEffect(() => {
        if (activeWork && overlayRef.current && modalContainerRef.current) {
            const tl = gsap.timeline({
                defaults: { ease: "expo.out", duration: 1.2 }
            });

            // Initial state: Hidden, scaled up, and blurred
            gsap.set(overlayRef.current, { opacity: 0 });
            gsap.set(modalContainerRef.current, {
                opacity: 0,
                scale: 1.1,
                filter: 'blur(30px) brightness(2)',
                y: 50
            });
            gsap.set([mediaContainerRef.current, contentRef.current], { opacity: 0, y: 30 });

            tl.to(overlayRef.current, {
                opacity: 1,
                duration: 0.8,
                ease: "none"
            })
                .to(modalContainerRef.current, {
                    opacity: 1,
                    scale: 1,
                    filter: 'blur(0px) brightness(1)',
                    y: 0,
                    duration: 1.4,
                }, "-=0.4")
                .to(mediaContainerRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                }, "-=1")
                .to(contentRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                }, "-=0.8")
                .fromTo(contentRef.current?.children || [],
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, stagger: 0.05, duration: 0.8 },
                    "-=0.6"
                );
        }
    }, [activeWork]);

    const handleClose = () => {
        if (!overlayRef.current || !modalContainerRef.current) {
            onClose();
            return;
        }

        const tl = gsap.timeline({
            onComplete: () => {
                setActiveWork(null);
                onClose();
                document.body.style.overflow = 'unset';
                document.documentElement.classList.remove('modal-open');
            }
        });

        tl.to(contentRef.current, {
            opacity: 0,
            y: -20,
            duration: 0.4,
            ease: "power2.in"
        })
            .to(modalContainerRef.current, {
                opacity: 0,
                scale: 0.95,
                filter: 'blur(20px) brightness(0.5)',
                y: -30,
                duration: 0.6,
                ease: "expo.in"
            }, "-=0.2")
            .to(overlayRef.current, {
                opacity: 0,
                duration: 0.4,
                ease: "none"
            }, "-=0.3");
    };

    if (!activeWork) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-12 bg-black/95 backdrop-blur-2xl overflow-hidden"
            onClick={handleClose}
        >
            <div
                ref={modalContainerRef}
                className="relative w-full max-w-7xl h-full max-h-[85vh] bg-[#050505] border border-white/10 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.05)] z-10 custom-scrollbar"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Interaction */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 md:top-8 md:right-8 z-[60] group flex items-center gap-4 text-white/50 hover:text-white transition-colors duration-500"
                >
                    <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-white/10 rounded-full group-hover:border-white/50 transition-all duration-500 bg-black/50 backdrop-blur-md">
                        <span className="text-xl md:text-2xl font-light">+</span>
                    </div>
                </button>

                {/* Left Side: Media */}
                <div ref={mediaContainerRef} className="w-full md:w-[60%] aspect-video md:h-full relative bg-black overflow-hidden shrink-0">
                    {activeWork.mediaType === 'video' ? (
                        <video
                            src={activeWork.mediaUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <img
                            src={activeWork.mediaUrl}
                            alt={activeWork.title}
                            className="w-full h-full object-cover"
                        />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent z-10 hidden md:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
                </div>

                {/* Right Side: Information */}
                <div ref={contentRef} className="w-full md:w-[40%] p-8 md:p-16 flex flex-col justify-start md:justify-center bg-[#050505] relative border-l border-white/5">
                    <span className="text-[10px] font-mono tracking-[0.6em] text-accent uppercase mb-8 block font-bold">
                        ID::{activeWork.id.toUpperCase()}
                    </span>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-8 uppercase tracking-tighter leading-tight break-words">
                        {t.worksIndex[activeWork.id as keyof typeof t.worksIndex]?.title || activeWork.title}
                    </h2>

                    <div className="w-16 h-[2px] bg-white/20 mb-12" />

                    <p className="text-sm md:text-base text-concrete/70 leading-relaxed font-light mb-16 max-w-sm tracking-wide">
                        {t.worksIndex[activeWork.id as keyof typeof t.worksIndex]?.description || activeWork.description}
                    </p>

                    <div className="space-y-6 text-white/60">
                        <span className="text-[11px] uppercase tracking-[0.2em]">{lang === 'EN' ? 'Interactive Integration' : 'Integração Interativa'}</span>
                        <div className="h-[1px] w-full bg-white/5" />
                        <span className="text-[11px] uppercase tracking-[0.2em]">{lang === 'EN' ? 'Real-time Systems' : 'Sistemas de Tempo Real'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkModal;
