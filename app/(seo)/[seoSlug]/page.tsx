import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/seo";
import {
  SEO_LANDING_PAGE_LIST,
  getSeoLandingConfigBySlug,
  type SeoLandingSlug,
} from "@/constants/seoLandingPages";
import JntuhResultLandingPage from "@/components/seo/JntuhResultLandingPage";

type Props = {
  params: { seoSlug: string };
};

export async function generateStaticParams() {
  return SEO_LANDING_PAGE_LIST.map((page) => ({
    seoSlug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const config = getSeoLandingConfigBySlug(params.seoSlug);
  if (!config) {
    return {};
  }

  const url = `${SITE_URL}${config.path}`;

  return {
    title: config.metaTitle,
    description: config.metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: config.metaTitle,
      description: config.metaDescription,
      url,
      type: "website",
      siteName: "JNTUH RESULTS",
    },
    twitter: {
      card: "summary_large_image",
      title: config.metaTitle,
      description: config.metaDescription,
    },
  };
}

export default function SeoLandingPage({ params }: Props) {
  const slug = params.seoSlug as SeoLandingSlug;
  const config = getSeoLandingConfigBySlug(slug);
  if (!config) {
    notFound();
  }

  return <JntuhResultLandingPage config={config} allPages={SEO_LANDING_PAGE_LIST} />;
}

