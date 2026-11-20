import { useEffect } from 'react';

interface PageMetaOptions {
  title: string;
  description?: string;
}

export const usePageMeta = ({ title, description }: PageMetaOptions) => {
  useEffect(() => {
    const fullTitle = title.includes('Milletly') ? title : `${title} | Milletly`;
    document.title = fullTitle;

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', fullTitle);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', description);
    }
  }, [title, description]);
};
