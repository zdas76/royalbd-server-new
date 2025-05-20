/*
  Warnings:

  - A unique constraint covering the columns `[voucherNo]` on the table `log_orders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `log_orders_voucherNo_key` ON `log_orders`(`voucherNo`);
