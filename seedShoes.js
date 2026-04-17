const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// i am add this for add the shoes in my database

async function main() {
    const drops = [
        {
            name: "Air Max 95 Neon",
            description: "Classic neon green and grey colorway.",
            price: 180.0,
            totalStock: 5,
            availableStock: 5,
            imageUrl:
                "https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=600&auto=format&fit=crop",
            isActive: true,
        },
        {
            name: "Yeezy Boost 350 V2",
            description: "Comfortable and stylish.",
            price: 220.0,
            totalStock: 30,
            availableStock: 30,
            imageUrl:
                "https://images.unsplash.com/photo-1595950653106-6c9ebd614c3a?q=80&w=600&auto=format&fit=crop",
            isActive: true,
        },
        {
            name: "Jordan 1 Retro High",
            description: "The classic Chicago colorway.",
            price: 190.0,
            totalStock: 20,
            availableStock: 20,
            imageUrl:
                "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=600&auto=format&fit=crop",
            isActive: true,
        },
        {
            name: "New Balance 550",
            description: "Retro basketball shoe in white and green.",
            price: 110.0,
            totalStock: 40,
            availableStock: 40,
            imageUrl:
                "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=600&auto=format&fit=crop",
            isActive: true,
        },
        {
            name: "Nike Dunk Low Panda",
            description: "Black and white colorway that goes with everything.",
            price: 115.0,
            totalStock: 60,
            availableStock: 60,
            imageUrl:
                "https://images.unsplash.com/photo-1612902456551-404b5b8e5181?q=80&w=600&auto=format&fit=crop",
            isActive: true,
        },
        {
            name: "Air Force 1 Triple White",
            description: "The timeless all-white classic sneaker.",
            price: 100.0,
            totalStock: 80,
            availableStock: 80,
            imageUrl:
                "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?q=80&w=600&auto=format&fit=crop",
            isActive: true,
        },
        {
            name: "Adidas Ultraboost 22",
            description: "Premium running shoe with Boost cushioning.",
            price: 195.0,
            totalStock: 35,
            availableStock: 35,
            imageUrl:
                "https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=600&auto=format&fit=crop",
            isActive: true,
        },
        {
            name: "ASICS Gel-Lyte III",
            description: "Split-tongue design with retro runner styling.",
            price: 130.0,
            totalStock: 25,
            availableStock: 25,
            imageUrl:
                "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600&auto=format&fit=crop",
            isActive: true,
        },
        {
            name: "Converse Chuck 70 High",
            description: "Premium version of the iconic Chuck Taylor.",
            price: 90.0,
            totalStock: 55,
            availableStock: 55,
            imageUrl:
                "https://images.unsplash.com/photo-1463100099107-aa0980c362e6?q=80&w=600&auto=format&fit=crop",
            isActive: true,
        },
        {
            name: "Puma Suede Classic",
            description: "Iconic suede sneaker in forest green.",
            price: 75.0,
            totalStock: 45,
            availableStock: 45,
            imageUrl:
                "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop",
            isActive: true,
        },
        {
            name: "Reebok Club C 85",
            description: "Clean court-style sneaker in vintage chalk.",
            price: 80.0,
            totalStock: 50,
            availableStock: 50,
            imageUrl:
                "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=600&auto=format&fit=crop",
            isActive: true,
        },
        {
            name: "Vans Old Skool",
            description: "The original side-stripe skate shoe in black.",
            price: 70.0,
            totalStock: 65,
            availableStock: 65,
            imageUrl:
                "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=600&auto=format&fit=crop",
            isActive: true,
        },
    ];

    for (const drop of drops) {
        const created = await prisma.drop.create({
            data: drop,
        });
        console.log(`Created drop: ${created.name}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
