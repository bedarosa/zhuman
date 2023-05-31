/*
  Warnings:

  - You are about to drop the column `em_aberto` on the `sessionid` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `sessionid` DROP COLUMN `em_aberto`,
    ADD COLUMN `opened` TINYINT NOT NULL DEFAULT 0;
