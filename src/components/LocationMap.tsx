'use client';

interface LocationMapProps {
  latitude?: number;
  longitude?: number;
  title?: string;
  height?: string;
  showLabel?: boolean;
}

export default function LocationMap({
  latitude = 19.2520727,
  longitude = -103.7227271,
  title = 'Oxal',
  height = 'h-80',
  showLabel = false,
}: LocationMapProps) {
  const embedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3746.2451234567!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x84255b0011d44dc5%3A0x904cf5eabf521d5d!2s${title}!5e0!3m2!1sen!2smx!4v1730000000000`;

  return (
    <div className="w-full">
      {showLabel && (
        <h3 className="text-lg font-semibold text-oxal-verdigris mb-3">
          {title}
        </h3>
      )}
      <a
        href={`https://maps.app.goo.gl/2qAGT62fBnyojRBq9`}
        target="_blank"
        rel="noopener noreferrer"
        className={`block relative ${height} rounded-lg overflow-hidden shadow-lg bg-gray-200 hover:shadow-xl transition-shadow`}
      >
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="pointer-events-none"
        ></iframe>
      </a>
    </div>
  );
}
