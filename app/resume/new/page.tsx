'use client';

import ResumeNewTemplateGate from '@/components/resume/ResumeNewTemplateGate';

export default function NewResumePage() {
  return (
    <>
      <ResumeNewTemplateGate />
      <style jsx global>{`
        /* Compact Orrica Edge onboarding: keep the full experience visible on laptop screens. */
        .oe-create-shell header { padding-top: .7rem !important; padding-bottom: .7rem !important; }
        .oe-create-shell header > div { max-width: 1120px !important; }
        .oe-create-shell main {
          max-width: 1120px !important;
          grid-template-columns: minmax(0,.9fr) minmax(0,1.1fr) !important;
          gap: 2.25rem !important;
          padding-top: 2.25rem !important;
          padding-bottom: 2.25rem !important;
        }
        .oe-create-shell main > section:first-child { max-width: 500px; }
        .oe-create-shell main > section:first-child > h1 {
          max-width: 500px !important;
          margin-top: 1rem !important;
          font-size: clamp(2.8rem,4.5vw,4rem) !important;
          line-height: .98 !important;
        }
        .oe-create-shell main > section:first-child > p { margin-top: 1rem !important; max-width: 500px !important; font-size: .92rem !important; line-height: 1.55 !important; }
        .oe-create-shell main > section:first-child > div:nth-of-type(2) { margin-top: 1.35rem !important; }
        .oe-create-shell main > section:first-child > div:nth-of-type(2) > div { gap: .75rem !important; }
        .oe-create-shell main > section:first-child > div:nth-of-type(2) > div + div { margin-top: .85rem !important; }
        .oe-create-shell main > section:first-child > div:nth-of-type(2) h2 { font-size: .95rem !important; }
        .oe-create-shell main > section:first-child > div:nth-of-type(2) p { margin-top: .2rem !important; font-size: .76rem !important; line-height: 1.45 !important; }
        .oe-create-shell main > section:first-child > button { margin-top: 1.35rem !important; height: 2.8rem !important; }
        .oe-create-shell main > section:last-child { max-width: 560px !important; }
        .oe-create-shell main > section:last-child > div.relative { padding: 1rem !important; border-radius: 1.25rem !important; }
        .oe-create-shell main > section:last-child .mb-4 { margin-bottom: .65rem !important; }
        .oe-create-shell main > section:last-child .sm\\:p-7 { padding: 1.15rem !important; }
        .oe-create-shell main > section:last-child .mt-5 { margin-top: .9rem !important; }
        .oe-create-shell main > section:last-child .space-y-4 > div + div { margin-top: .75rem !important; }
        .oe-create-shell main > section:last-child .mt-4 { margin-top: .7rem !important; }
        @media (max-width: 1023px) {
          .oe-create-shell main { gap: 2rem !important; padding-top: 2rem !important; padding-bottom: 2rem !important; }
          .oe-create-shell main > section:first-child > h1 { font-size: clamp(2.6rem,7vw,3.5rem) !important; }
        }
        @media (max-width: 639px) {
          .oe-create-shell main { display: flex !important; flex-direction: column !important; gap: 1.5rem !important; padding: 1.5rem 1rem 2rem !important; }
          .oe-create-shell main > section:first-child,
          .oe-create-shell main > section:last-child { max-width: none !important; width: 100% !important; }
          .oe-create-shell main > section:first-child > h1 { margin-top: .8rem !important; font-size: 2.45rem !important; }
          .oe-create-shell main > section:first-child > p { font-size: .86rem !important; }
          .oe-create-shell main > section:first-child > div:nth-of-type(2) > div + div { margin-top: .7rem !important; }
          .oe-create-shell main > section:last-child .grid { grid-template-columns: 1fr !important; }
          .oe-create-shell main > section:last-child .hidden { display: none !important; }
        }
      `}</style>
    </>
  );
}
