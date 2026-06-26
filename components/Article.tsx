"use client";

import { Share2, Link as LinkIcon, Clock, ThumbsUp, Bookmark, Flag } from "lucide-react";
import { useEffect, useState } from "react";

function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px", threshold: 0.5 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}

export default function Article() {
  const activeSection = useActiveSection(["intro", "algorithmic-intent", "structural-shift", "conclusion"]);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header className="max-w-article-max mx-auto px-margin-mobile md:px-0 mb-16">
        <div className="flex items-center gap-4 mb-6">
          <span className="bg-primary text-on-primary px-3 py-1 font-label-sm text-label-sm rounded-lg">TECHNOLOGY</span>
          <span className="text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1">
            <Clock size={16} /> 12 min read
          </span>
        </div>
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-8 leading-tight">
          The Silent Architect: How AI Reshapes the Invisible Scaffolding of Human Intent
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container">
            <img 
              className="w-full h-full object-cover" 
              alt="Author Portrait" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBio3zW1ga4HvuqmjZaPPerBz74U6aoZdLwnitFeBRpFGHCobp0O3Jcwhz7bFOsHpOiTlB_GFwBTmevAKruDz0ElMlFmfvsyT-QVICN9vkbZDXxutR4t1lrWuZ569Oap8LIpPZaN_Ip7HpFvOYzG1dknWdKSYHIyRlf1pLAbqWIfSeP5QXSPtBAq0fbEhAuqDApzs_1-Py5pgpOYgXuY2oBG_xqPVc_bSzaUx0pYQvFMFtQ_TcEdKcLI8n4jjWDKnIyn6CWu_QPWJ0"
            />
          </div>
          <div>
            <p className="font-bold text-primary">Julian Thorne</p>
            <p className="text-on-surface-variant text-label-sm font-label-sm">Oct 24, 2024 • Senior Editor</p>
          </div>
        </div>
      </header>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-16">
        <div className="w-full h-[300px] sm:h-[400px] md:h-[614px] rounded-xl overflow-hidden relative group">
          <img 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            alt="Hero abstract art of neural intent" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3L5_l05sUCXBdxQqjdEKmHzv1QkaQG8L3OYTbCQuHAwjAUZZlRbbKK-rg7HO9euqHhMX5uMtl8baWkqNbWVou62Q70-TZuOKXSpniufZoOVFi_B-FeYTCwrFFTmAeigoHhUxGYk_CuYILLc2k7jvMFren4LpoTwwGY1F7AxahiIw62fQLOe8bi2cOHJPuZ04rutoPXexkJNezfrCARSfJjFKKfR-nbiYdw7nDCtIHQ8KVcl5VLiPD3-PBVGYbJSOLkX2dL_BVsyc"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>
        <p className="mt-4 text-center text-on-surface-variant text-label-sm italic">
          Visualizing the intersection of neural intent and structural design. Image by Opinion Matters Lab.
        </p>
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col lg:flex-row gap-16 relative">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-32 space-y-8">
            <div className="p-6 rounded-xl glass-surface">
              <h3 className="font-label-sm text-label-sm text-primary mb-4 uppercase tracking-widest">Table of Contents</h3>
              <nav className="flex flex-col gap-3 font-label-sm text-label-sm">
                <a onClick={e => scrollTo(e, "intro")} className={`${activeSection === 'intro' ? 'text-primary font-bold' : 'text-on-surface-variant'} hover:text-primary transition-colors cursor-pointer`}>The Invisible Scaffolding</a>
                <a onClick={e => scrollTo(e, "algorithmic-intent")} className={`${activeSection === 'algorithmic-intent' ? 'text-primary font-bold' : 'text-on-surface-variant'} hover:text-primary transition-colors cursor-pointer`}>Algorithmic Drift</a>
                <a onClick={e => scrollTo(e, "structural-shift")} className={`${activeSection === 'structural-shift' ? 'text-primary font-bold' : 'text-on-surface-variant'} hover:text-primary transition-colors cursor-pointer`}>Structural Sovereignty</a>
                <a onClick={e => scrollTo(e, "conclusion")} className={`${activeSection === 'conclusion' ? 'text-primary font-bold' : 'text-on-surface-variant'} hover:text-primary transition-colors cursor-pointer`}>The New Observer</a>
              </nav>
            </div>
            <div className="flex flex-col gap-4 px-2">
              <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Share this Story</h3>
              <div className="flex gap-4">
                <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-primary hover:text-on-primary text-primary transition-all">
                  <Share2 size={18} />
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant hover:bg-primary hover:text-on-primary text-primary transition-all">
                  <LinkIcon size={18} />
                </button>
              </div>
            </div>
          </div>
        </aside>

        <article className="article-content max-w-article-max mx-auto lg:mx-0 w-full text-body-lg font-body-lg text-on-surface-variant leading-relaxed">
          <section id="intro" className="mb-12">
            <p className="mb-8 first-letter:text-7xl first-letter:font-display-lg first-letter:float-left first-letter:mr-3 first-letter:text-primary">
              Every tool we design eventually begins to design us. This is the central paradox of technological advancement, a cycle of reciprocal evolution that has accelerated beyond our collective ability to observe it. Today, the {"\"tool\""} is no longer a static instrument like a hammer or a steam engine; it is a dynamic, predictive layer that intercedes between our thoughts and our actions.
            </p>
            <p className="mb-8">
              The emergence of Large Language Models (LLMs) and generative systems has created a new kind of {"\"Silent Architect.\""} This architect doesn{"'t"} just fulfill our requests; it shapes the very vocabulary of our intent. When an AI suggests the next word in an email or the next line in a codebase, it isn{"'t"} just saving time—it is subtly nudging the trajectory of our creative output.
            </p>
          </section>

          <h2 id="algorithmic-intent" className="font-headline-md text-headline-md text-primary mt-16 mb-8">The Nature of Algorithmic Drift</h2>
          <p className="mb-8">
            Consider the concept of {"\"Algorithmic Drift.\""} As we lean more heavily on predictive systems, our individual unique variances—the {"\"errors\""} that define human creativity—are smoothed out by the statistical averages of the training data. We are entering an era of peak efficiency, but potentially, peak homogeneity.
          </p>

          <blockquote className="my-12 pl-8 border-l-4 border-primary italic text-primary font-display-lg text-headline-md leading-[1.25]">
            {"\"We are optimizing for the most probable outcome, often at the expense of the most meaningful one.\""}
          </blockquote>

          <ul className="mb-8 space-y-4">
            <li>The erosion of idiosyncratic writing styles in professional environments.</li>
            <li>The shift from generative creation to curative selection.</li>
            <li>The diminishing returns of {"\"optimal\""} design patterns.</li>
          </ul>

          <h2 id="structural-shift" className="font-headline-md text-headline-md text-primary mt-16 mb-8">Reclaiming Structural Sovereignty</h2>
          <p className="mb-8">
            To maintain {"\"Opinion Matters\""} in such a landscape requires a deliberate act of resistance. It requires us to use these systems not as crutches, but as sounding boards. The future of high-end UI and intellectual depth lies in the tension between machine precision and human intuition.
          </p>

          <div className="my-16 p-8 bg-surface-container-low rounded-xl border border-outline-variant/30">
            <h4 className="font-bold text-primary mb-4">Key Takeaways for Designers:</h4>
            <p className="text-body-md font-body-md mb-0">Designing for the next decade means creating interfaces that don{"'t"} just {"\"predict\""} but {"\"provoke.\""} We must move beyond frictionless experiences toward meaningful friction—interfaces that force us to pause, think, and exert our own sovereignty over the digital landscape.</p>
          </div>

          <section id="conclusion">
            <p className="mb-8">
              The Silent Architect is already here, embedded in the code of our editors and the pixels of our screens. Our task isn{"'t"} to evict it, but to learn how to dance with it—retaining our role as the lead in a partnership that defines the next chapter of human ingenuity.
            </p>
          </section>

          <div className="mt-20 pt-12 border-t border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <span className="text-label-sm font-label-sm uppercase text-on-surface-variant">Liked this?</span>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm active:scale-95 transition-transform">
                <ThumbsUp size={18} /> Applaud 42
              </button>
            </div>
            <div className="flex items-center gap-4 text-on-surface-variant">
              <Share2 size={24} className="cursor-pointer hover:text-primary transition-colors" />
              <Bookmark size={24} className="cursor-pointer hover:text-primary transition-colors" />
              <Flag size={24} className="cursor-pointer hover:text-primary transition-colors" />
            </div>
          </div>
        </article>
      </div>

      <section className="max-w-article-max mx-auto px-margin-mobile md:px-0 mt-24 py-12 border-y border-outline-variant/30">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-surface-container-highest flex-shrink-0">
            <img 
              className="w-full h-full object-cover" 
              alt="Julian Thorne close-up" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCE6EAkxFko5Kd6lNfdihvDYC2Ftd6G-XS6_hRoXIoU3OmwMlxAf507c4cjK72UDmwPCTBZtWtLphFinLmAsFXlQ-Z4oNP759AUzCfv7T2e7h_ZEL3bX22tU8tuzUlew_PaRX00b8faJA-Kdn78YorBmFRciTQ925VBWhm2IfRIKx77Npqa4OCJrGV4WxHhcbruo8ZJyMYgxJ3a0tUd7y--MBtlsrsQKzP4Lhe0VofEWKoB_iqXaTHIV4NwNR3EUgwmR8iQbUwDOZ0"
            />
          </div>
          <div className="flex-grow">
            <h3 className="font-headline-md text-headline-md text-primary mb-2">Julian Thorne</h3>
            <p className="text-on-surface-variant text-body-md font-body-md mb-6">Julian is the Senior Editor at Opinion Matters, focusing on the sociological impact of emerging tech. With over a decade in digital journalism, he explores the intersection of design, ethics, and artificial intelligence.</p>
            <div className="flex gap-4">
              <a href="#" className="text-label-sm font-label-sm text-primary hover:underline">Twitter</a>
              <a href="#" className="text-label-sm font-label-sm text-primary hover:underline">LinkedIn</a>
              <a href="#" className="text-label-sm font-label-sm text-primary hover:underline">Newsletter</a>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-article-max mx-auto px-margin-mobile md:px-0 mt-24">
        <h2 className="font-headline-md text-headline-md text-primary mb-8">Comments (12)</h2>
        <div className="space-y-12">
          <div className="border-b border-outline-variant/20 pb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-primary text-body-md font-body-md">Sarah Jenkins</span>
              <span className="text-label-sm text-on-surface-variant font-label-sm">2h ago</span>
            </div>
            <p className="text-body-md text-on-surface-variant font-body-md">This perfectly captures the {"'invisible nudge'"} I{"'ve"} been feeling. We think we{"'re"} choosing, but we{"'re"} often just selecting from a curated menu of probabilities.</p>
            <button className="mt-4 text-label-sm font-bold text-primary uppercase tracking-widest hover:underline">Reply</button>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30">
            <textarea className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-body-md p-0 mb-4 resize-none placeholder:text-on-surface-variant/50" placeholder="Join the discussion..." rows={3}></textarea>
            <div className="flex justify-end">
              <button className="px-6 py-2 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm hover:opacity-90 transition-opacity">Post Opinion</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
