import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { SampleResumeCard } from '@/components/landing/SampleResumeCard';
import { TEMPLATE_LIST } from '@/lib/templates/presets';

export default function TemplatesPage() {
  return (
    <div className="min-h-dvh bg-white">
      <SiteHeader />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">10 Resume Templates</h1>
        <p className="text-muted-foreground mb-10">
          Every template is print-safe, ATS-friendly, and switches instantly in the live editor.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATE_LIST.map((t) => (
            <div key={t.id} className="rounded-xl border overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="aspect-[3/4] relative">
                <SampleResumeCard accent={t.defaultAccentColor} layout={t.layout} />
                <Link
                  href="/resume/new"
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                >
                  <span className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                    Use this template
                  </span>
                </Link>
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{t.name}</h3>
                <p className="text-sm text-muted-foreground mt-0.5 mb-3">{t.description}</p>
                <Link href="/resume/new">
                  <Button variant="outline" size="sm" className="w-full">
                    Use This Template <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
