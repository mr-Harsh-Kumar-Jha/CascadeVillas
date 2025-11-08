import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config.js';

const sampleVillas = [
  {
    name: "Sunset Paradise Villa",
    location: "Lonavala",
    description: "Luxurious villa with stunning sunset views, perfect for family getaways and celebrations. Features a private pool, spacious garden, and modern amenities.",
    pricePerNight: 12000,
    bedrooms: 4,
    bathrooms: 3,
    maxGuests: 8,
    amenities: ["Pool", "WiFi", "AC", "Kitchen", "Parking", "Garden", "BBQ"],
    images: [
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
    ],
    isFeatured: true,
    isTrending: true,
    discountPercentage: 15,
    status: "available"
  },
  {
    name: "Mountain View Retreat",
    location: "Mahabaleshwar",
    description: "Peaceful mountain retreat with panoramic views. Ideal for couples and small families seeking tranquility and natural beauty.",
    pricePerNight: 8500,
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    amenities: ["WiFi", "AC", "Kitchen", "Parking", "Balcony", "TV"],
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800"
    ],
    isFeatured: false,
    isTrending: true,
    discountPercentage: 10,
    status: "available"
  },
  {
    name: "Royal Heritage Villa",
    location: "Lonavala",
    description: "Experience royalty with this heritage-style villa featuring traditional architecture and modern comfort. Perfect for weddings and special events.",
    pricePerNight: 25000,
    bedrooms: 6,
    bathrooms: 5,
    maxGuests: 12,
    amenities: ["Pool", "WiFi", "AC", "Kitchen", "Parking", "Garden", "BBQ", "TV", "Gym"],
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800"
    ],
    isFeatured: true,
    isTrending: false,
    discountPercentage: 20,
    status: "available"
  },
  {
    name: "Cozy Hillside Cottage",
    location: "Mahabaleshwar",
    description: "Charming cottage nestled in the hills. Perfect for romantic getaways with breathtaking valley views.",
    pricePerNight: 6000,
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    amenities: ["WiFi", "Kitchen", "Parking", "Balcony"],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800"
    ],
    isFeatured: false,
    isTrending: true,
    discountPercentage: 0,
    status: "available"
  },
  {
    name: "Lake View Villa",
    location: "Lonavala",
    description: "Stunning villa overlooking the serene lake. Spacious interiors with modern amenities and outdoor entertainment area.",
    pricePerNight: 15000,
    bedrooms: 5,
    bathrooms: 4,
    maxGuests: 10,
    amenities: ["Pool", "WiFi", "AC", "Kitchen", "Parking", "Garden", "BBQ", "TV"],
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800"
    ],
    isFeatured: true,
    isTrending: true,
    discountPercentage: 25,
    status: "available"
  },
  {
    name: "Forest Edge Villa",
    location: "Mahabaleshwar",
    description: "Wake up to birdsong in this villa at the forest's edge. Private and peaceful with all modern conveniences.",
    pricePerNight: 10000,
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    amenities: ["WiFi", "AC", "Kitchen", "Parking", "Garden", "Balcony"],
    images: [
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
    ],
    isFeatured: false,
    isTrending: false,
    discountPercentage: 0,
    status: "available"
  },
  {
    name: "Modern Luxury Estate",
    location: "Lonavala",
    description: "Contemporary luxury villa with infinity pool, home theater, and premium finishes throughout. Ideal for luxury seekers.",
    pricePerNight: 30000,
    bedrooms: 5,
    bathrooms: 5,
    maxGuests: 10,
    amenities: ["Pool", "WiFi", "AC", "Kitchen", "Parking", "Garden", "BBQ", "TV", "Gym", "Pet Friendly"],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800"
    ],
    isFeatured: true,
    isTrending: true,
    discountPercentage: 0,
    status: "available"
  },
  {
    name: "Valley View Homestay",
    location: "Mahabaleshwar",
    description: "Homely atmosphere with spectacular valley views. Host family provides authentic local cuisine and warm hospitality.",
    pricePerNight: 5000,
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    amenities: ["WiFi", "Kitchen", "Parking", "Balcony"],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800"
    ],
    isFeatured: false,
    isTrending: true,
    discountPercentage: 15,
    status: "available"
  },
  {
    name: "Hilltop Mansion",
    location: "Lonavala",
    description: "Majestic mansion on hilltop with 360-degree views. Perfect for large gatherings, corporate retreats, and weddings.",
    pricePerNight: 35000,
    bedrooms: 7,
    bathrooms: 6,
    maxGuests: 14,
    amenities: ["Pool", "WiFi", "AC", "Kitchen", "Parking", "Garden", "BBQ", "TV", "Gym", "Washing Machine"],
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
    ],
    isFeatured: true,
    isTrending: false,
    discountPercentage: 10,
    status: "available"
  },
  {
    name: "Riverside Bungalow",
    location: "Mahabaleshwar",
    description: "Charming bungalow by the river with private fishing area. Peaceful location for nature lovers.",
    pricePerNight: 7500,
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    amenities: ["WiFi", "Kitchen", "Parking", "Garden", "BBQ"],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800"
    ],
    isFeatured: false,
    isTrending: false,
    discountPercentage: 0,
    status: "available"
  },
  {
    name: "Garden Villa Retreat",
    location: "Lonavala",
    description: "Beautiful villa surrounded by lush gardens and fruit orchards. Kids playground and pet-friendly environment.",
    pricePerNight: 11000,
    bedrooms: 4,
    bathrooms: 3,
    maxGuests: 8,
    amenities: ["WiFi", "AC", "Kitchen", "Parking", "Garden", "Pet Friendly", "TV"],
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800",
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800"
    ],
    isFeatured: false,
    isTrending: true,
    discountPercentage: 20,
    status: "available"
  },
  {
    name: "Heritage Farmhouse",
    location: "Mahabaleshwar",
    description: "Restored farmhouse with rustic charm and modern comforts. Experience farm life with organic meals included.",
    pricePerNight: 9000,
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    amenities: ["WiFi", "Kitchen", "Parking", "Garden", "Pet Friendly"],
    images: [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800"
    ],
    isFeatured: false,
    isTrending: false,
    discountPercentage: 5,
    status: "available"
  }
];

export const seedVillas = async () => {
  try {;
    const villasRef = collection(db, 'villas');
    
    for (const villa of sampleVillas) {
      await addDoc(villasRef, {
        ...villa,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error seeding villas:', error);
    return false;
  }
};

// Uncomment below and run this file once to seed data
seedVillas();