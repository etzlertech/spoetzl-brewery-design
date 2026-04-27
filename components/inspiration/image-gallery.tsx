import Image from 'next/image';

interface ImageItem {
  title: string;
  category: string;
  url: string;
  alt: string;
}

const inspirationImages: ImageItem[] = [
  {
    title: 'Seasonal color massing',
    category: 'Gardens',
    url: '/research/images/07-spring-tulips-display.jpg',
    alt: 'Bright spring flowers in a massed seasonal color display',
  },
  {
    title: 'European village threshold',
    category: 'Architecture',
    url: '/research/images/14-bridge-architecture.jpg',
    alt: 'European village street framed by architecture and flowers',
  },
  {
    title: 'Water-facing guest edge',
    category: 'Water feature',
    url: '/research/images/23-river-cruise-scenery.jpg',
    alt: 'Landscape and water edge with guest-facing views',
  },
  {
    title: 'Arrival street perspective',
    category: 'Wayfinding',
    url: '/research/images/21-french-garden-chateau.jpg',
    alt: 'European street perspective with clear pedestrian direction',
  },
  {
    title: 'Italian village color',
    category: 'Themed zone',
    url: '/research/images/13-italian-architecture.jpg',
    alt: 'Colorful Italian village architecture beside water',
  },
  {
    title: 'Field proof detail',
    category: 'Operations',
    url: '/research/images/19-botanical-garden-path.jpg',
    alt: 'Soil and planting tools showing landscape work detail',
  },
];

export function ImageGallery() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {inspirationImages.map((image) => (
        <div
          key={image.title}
          className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-shadow hover:shadow-lg"
        >
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-white/70">
                {image.category}
              </p>
              <p className="mt-1 text-lg font-black leading-tight text-white">
                {image.title}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
