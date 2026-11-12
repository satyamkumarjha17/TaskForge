-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(30) NOT NULL,
    `name` VARCHAR(80) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workspaces` (
    `id` VARCHAR(30) NOT NULL,
    `name` VARCHAR(80) NOT NULL,
    `description` VARCHAR(500) NULL,
    `ownerId` VARCHAR(30) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `workspaces_ownerId_updatedAt_idx`(`ownerId`, `updatedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `boards` (
    `id` VARCHAR(30) NOT NULL,
    `name` VARCHAR(80) NOT NULL,
    `description` VARCHAR(500) NULL,
    `workspaceId` VARCHAR(30) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `boards_workspaceId_updatedAt_idx`(`workspaceId`, `updatedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tasks` (
    `id` VARCHAR(30) NOT NULL,
    `title` VARCHAR(160) NOT NULL,
    `description` TEXT NULL,
    `priority` ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM',
    `status` ENUM('TODO', 'IN_PROGRESS', 'DONE') NOT NULL DEFAULT 'TODO',
    `dueDate` DATE NULL,
    `boardId` VARCHAR(30) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `tasks_boardId_status_updatedAt_idx`(`boardId`, `status`, `updatedAt`),
    INDEX `tasks_boardId_dueDate_idx`(`boardId`, `dueDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `workspaces` ADD CONSTRAINT `workspaces_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `boards` ADD CONSTRAINT `boards_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `workspaces`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `boards`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
