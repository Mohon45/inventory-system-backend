const http = require("http");
require("dotenv").config();

const app = require("./src/app");
const { initializeSocket } = require("./src/socket");
const prisma = require("./src/config/prisma");
const {
    startCleanupJob,
} = require("./src/modules/reservation/reservation.expiration");
const config = require("./src/config");

const server = http.createServer(app);

initializeSocket(server);

(async () => {
    try {
        await prisma.$connect();
        await startCleanupJob();
        server.listen(config.port, () =>
            console.log(`Server running on port ${config.port}`),
        );

        const shutdown = async (signal) => {
            console.log(`\nReceived ${signal}. Shutting down gracefully...`);
            server.close(async () => {
                await prisma.$disconnect();
                console.log("Database connection closed");
                process.exit(0);
            });
        };

        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));
    } catch (err) {
        console.error("Failed to start server:", err);
        await prisma.$disconnect();
        process.exit(1);
    }
})();
