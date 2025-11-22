-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "order_description" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "product_name" VARCHAR(100) NOT NULL,
    "product_description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_product_map" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "order_product_map_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "order_product_map" ADD CONSTRAINT "order_product_map_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_product_map" ADD CONSTRAINT "order_product_map_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Insert data in products table
INSERT INTO "products" ("product_name", "product_description") VALUES
('HP laptop', 'This is HP laptop'),
('Lenovo laptop', 'This is lenovo'),
('Car', 'This is Car'),
('Bike', 'This is Bike');
