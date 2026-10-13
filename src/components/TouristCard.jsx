import { motion } from "framer-motion";
import { FiMapPin, FiArrowRight, FiCalendar } from "react-icons/fi";

const fallbackImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
];

function TouristCard({ site, index = 0, isRegistered, onBook, onDetails }) {
  const image =
    site.image_url ||
    fallbackImages[index % fallbackImages.length];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.4) }}
      whileHover={{ y: -6 }}
      className="group card-surface card-hover overflow-hidden"
    >
      <div className="relative aspect-[16/11] overflow-hidden">
        <img
          src={image}
          alt={site.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/10 to-transparent" />
        <span className="absolute left-4 top-4 rounded-lg bg-white/90 dark:bg-ink-900/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300 backdrop-blur">
          {site.category || "Destination"}
        </span>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-display text-2xl font-semibold text-white drop-shadow">
            {site.name}
          </h3>
          {site.address && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-white/85">
              <FiMapPin className="shrink-0" />
              <span className="truncate">{site.address}</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 p-5">
        <p className="line-clamp-2 text-sm leading-relaxed text-ink-500 dark:text-ink-400">
          {site.description || "Discover this destination and plan your next visit."}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={onDetails} className="btn-ghost !py-2.5 !px-4 text-sm flex-1 min-w-[120px]">
            Know More
            <FiArrowRight className="opacity-70" />
          </button>
          <button type="button" onClick={onBook} className="btn-primary !py-2.5 !px-4 text-sm flex-1 min-w-[120px]">
            <FiCalendar />
            Book Now
          </button>
        </div>

        {!isRegistered && (
          <p className="text-xs text-ink-400">Complete registration to unlock booking.</p>
        )}
      </div>
    </motion.article>
  );
}

export default TouristCard;
