import type { Metadata } from 'next';
import { jobsService } from '@/feature/jobs/services/jobs.service';
import { categoriesService } from '@/feature/jobs/services/categories.service';
import { serializeJobs } from '@/feature/jobs/utils/job.serialization';
import Header from '@/shared/components/Header/Header';
import Footer from '@/shared/components/Footer/Footer';
import HomeClient from './components/HomeClient';
import HomeStructuredData from './components/HomeStructuredData';

export const metadata: Metadata = {
  title: 'TomyJobs - Encuentra tu trabajo ideal',
  description: 'Plataforma para encontrar y publicar trabajos. Miles de ofertas de empleo en diferentes categorías y ubicaciones. Busca tu trabajo soñado hoy.',
  keywords: ['trabajos', 'empleo', 'ofertas de trabajo', 'buscar trabajo', 'publicar trabajo', 'trabajos en españa', 'trabajos online'],
  openGraph: {
    title: 'TomyJobs - Encuentra tu trabajo ideal',
    description: 'Plataforma para encontrar y publicar trabajos. Miles de ofertas de empleo en diferentes categorías y ubicaciones.',
    url: '/',
    type: 'website',
  },
  alternates: {
    canonical: '/',
  },
};

export default async function Home() {
  const [jobs, categories] = await Promise.all([
    jobsService.getAllJobs(),
    categoriesService.getMainCategories(),
  ]);

  const serializedJobs = serializeJobs(jobs);

  return (
    <>
      <HomeStructuredData jobs={serializedJobs} categories={categories} />
      <Header />
      <HomeClient initialJobs={serializedJobs} initialCategories={categories} />
      <Footer />
    </>
  );
}
