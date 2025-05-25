// components/Card.js
import Link from 'next/link';

const Card = ({ item }) => {
  return (
    <Link href={item.link} className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="w-full h-48 relative bg-gray-100">
        {item.video ? (
          <video
            src={item.video}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
        <p className="text-gray-600 mt-1">{item.description}</p>
      </div>
    </Link>
  );
};

export default Card;
