# Inventory System Backend

A robust e-commerce inventory and reservation system backend built with Node.js, Express, Prisma, and Socket.io.

## How to Run the App (Including Setup)

1. **Install Dependencies:**
    ```bash
    npm install
    ```
2. **Environment Variables:**
   Create a `.env` file in the root directory and ensure you provide the necessary configuration, notably the remote database URL:
    ```env
    PORT=4000
    DATABASE_URL="postgresql://user:password@host/dbname"
    NODE_ENV="development"
    RATE_LIMIT_MAX=100
    ```
3. **SQL Schema Setup:**
   Generate the Prisma Client and push the schema to your SQL database.
    ```bash
    npx prisma generate
    npx prisma db push
    ```
4. **Seed the Database (Optional):**
   Seed the database with sample shoe data drops.
    ```bash
    node seedShoes.js
    ```
5. **Start the Application:**
   Run the backend development server (defaults to port 4000).
    ```bash
    npm run dev
    ```

---

## Architecture Choice: 60-Second Expiration Logic

The 60-second reservation expiration logic natively operates inside the Node.js runtime to guarantee high precision, rather than relying on heavy cron jobs querying the database constantly.

- **In-Memory Scheduling**: When a reservation is created, `reservation.expiration.js` triggers a `setTimeout` function mapped by the `reservationId` set to execute in 60 seconds.
- **Dynamic Cancellations**: If a user completes their purchase before the time ends, `cancelExpiration()` locates the reservation timer in the map via its ID, clears the timeout using `clearTimeout()`, and deletes the reference footprint.
- **Resiliency & Recovery**: Since `setTimeout` jobs are wiped if the server crashes or restarts, we utilize an init function (`startCleanupJob()`). At startup, it evaluates the database for any active reservations. Past-due reservations are immediately marked `EXPIRED`, while pending reservations have their `setTimeout` jobs naturally re-created.
- **Real-Time Client Updates**: Once expired, the `Drop`'s `availableStock` atomically increments, and Socket.io broadcasts `stock:updated` to synchronize the UI dynamically across all active clients.

---

## Concurrency: Resolving Race Conditions for Final Items

In high-demand checkout sequences, standard validations face the "Phantom Read" vulnerability where two concurrent requests check the stock limits `(if stock > 0)` precisely simultaneously, pass the check, and negatively over-draft the item resulting in duplicate claims.

We prevented multiple users from claiming the final item using two primary layers:

1. **Transaction Isolation Levels**: We wrapped the reservation logic within Prisma `$transaction` blocks utilizing the highest restriction tier (`Prisma.TransactionIsolationLevel.Serializable`). This effectively locks the execution pipeline so one transaction is fully reconciled before the next read commences.
2. **Atomic Row Decrements**: Rather than reading stock into application memory, doing math in Node, and writing it back, we rely on the database's internal atomic guarantees combined with a conditional bound:
    ```javascript
    await tx.drop.updateMany({
        where: { id: dropId, isActive: true, availableStock: { gt: 0 } },
        data: { availableStock: { decrement: 1 } },
    });
    ```
    By mandating the condition `availableStock: { gt: 0 }`, the database engine naturally rejects any decrement operation if the stock has already touched zero within milliseconds. If `updated.count === 0` structurally triggers, an `"Item is out of stock"` error securely bounces the transaction, assuring 100% data integrity with no overselling.
