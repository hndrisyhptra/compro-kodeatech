-- Select an EMPTY database in phpMyAdmin before import. Run seed separately.
SET NAMES utf8mb4;
-- CreateTable
CREATE TABLE `roles` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `roles_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `roleId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` VARCHAR(191) NOT NULL,
    `tokenHash` VARCHAR(191) NOT NULL,
    `csrfToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `sessions_tokenHash_key`(`tokenHash`),
    INDEX `sessions_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settings` (
    `key` VARCHAR(191) NOT NULL,
    `value` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seo_metadata` (
    `id` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `ogImage` VARCHAR(2048) NOT NULL DEFAULT '',
    `canonical` VARCHAR(2048) NOT NULL DEFAULT '',
    `keywords` TEXT NOT NULL,

    UNIQUE INDEX `seo_metadata_path_key`(`path`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `media` (
    `id` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(255) NOT NULL,
    `mime` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `width` INTEGER NOT NULL,
    `height` INTEGER NOT NULL,
    `alt` TEXT NOT NULL,
    `title` VARCHAR(255) NOT NULL DEFAULT '',
    `description` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `media_filename_key`(`filename`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_messages` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NOT NULL DEFAULT '',
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL DEFAULT '',
    `service` VARCHAR(191) NOT NULL,
    `budget` VARCHAR(191) NOT NULL DEFAULT '',
    `message` TEXT NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'unread',
    `notes` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `contact_messages_status_createdAt_idx`(`status`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rate_limits` (
    `key` VARCHAR(191) NOT NULL,
    `count` INTEGER NOT NULL DEFAULT 1,
    `resetAt` DATETIME(3) NOT NULL,

    INDEX `rate_limits_resetAt_idx`(`resetAt`),
    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `blog_categories_name_key`(`name`),
    UNIQUE INDEX `blog_categories_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_tags` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `blog_tags_name_key`(`name`),
    UNIQUE INDEX `blog_tags_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pages` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(191) NOT NULL DEFAULT 'en',
    `excerpt` TEXT NOT NULL,
    `content` LONGTEXT NOT NULL,
    `image` VARCHAR(2048) NOT NULL DEFAULT '',
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `data` JSON NOT NULL,
    `seoTitle` VARCHAR(255) NOT NULL DEFAULT '',
    `seoDescription` TEXT NOT NULL,
    `ogImage` VARCHAR(2048) NOT NULL DEFAULT '',
    `canonical` VARCHAR(2048) NOT NULL DEFAULT '',
    `keywords` TEXT NOT NULL,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `pages_status_locale_sortOrder_idx`(`status`, `locale`, `sortOrder`),
    UNIQUE INDEX `pages_slug_locale_key`(`slug`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `services` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(191) NOT NULL DEFAULT 'en',
    `excerpt` TEXT NOT NULL,
    `content` LONGTEXT NOT NULL,
    `image` VARCHAR(2048) NOT NULL DEFAULT '',
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `data` JSON NOT NULL,
    `seoTitle` VARCHAR(255) NOT NULL DEFAULT '',
    `seoDescription` TEXT NOT NULL,
    `ogImage` VARCHAR(2048) NOT NULL DEFAULT '',
    `canonical` VARCHAR(2048) NOT NULL DEFAULT '',
    `keywords` TEXT NOT NULL,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `services_status_locale_sortOrder_idx`(`status`, `locale`, `sortOrder`),
    UNIQUE INDEX `services_slug_locale_key`(`slug`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `solutions` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(191) NOT NULL DEFAULT 'en',
    `excerpt` TEXT NOT NULL,
    `content` LONGTEXT NOT NULL,
    `image` VARCHAR(2048) NOT NULL DEFAULT '',
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `data` JSON NOT NULL,
    `seoTitle` VARCHAR(255) NOT NULL DEFAULT '',
    `seoDescription` TEXT NOT NULL,
    `ogImage` VARCHAR(2048) NOT NULL DEFAULT '',
    `canonical` VARCHAR(2048) NOT NULL DEFAULT '',
    `keywords` TEXT NOT NULL,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `solutions_status_locale_sortOrder_idx`(`status`, `locale`, `sortOrder`),
    UNIQUE INDEX `solutions_slug_locale_key`(`slug`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `portfolio` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(191) NOT NULL DEFAULT 'en',
    `excerpt` TEXT NOT NULL,
    `content` LONGTEXT NOT NULL,
    `image` VARCHAR(2048) NOT NULL DEFAULT '',
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `data` JSON NOT NULL,
    `seoTitle` VARCHAR(255) NOT NULL DEFAULT '',
    `seoDescription` TEXT NOT NULL,
    `ogImage` VARCHAR(2048) NOT NULL DEFAULT '',
    `canonical` VARCHAR(2048) NOT NULL DEFAULT '',
    `keywords` TEXT NOT NULL,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `portfolio_status_locale_sortOrder_idx`(`status`, `locale`, `sortOrder`),
    UNIQUE INDEX `portfolio_slug_locale_key`(`slug`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `technologies` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(191) NOT NULL DEFAULT 'en',
    `excerpt` TEXT NOT NULL,
    `content` LONGTEXT NOT NULL,
    `image` VARCHAR(2048) NOT NULL DEFAULT '',
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `data` JSON NOT NULL,
    `seoTitle` VARCHAR(255) NOT NULL DEFAULT '',
    `seoDescription` TEXT NOT NULL,
    `ogImage` VARCHAR(2048) NOT NULL DEFAULT '',
    `canonical` VARCHAR(2048) NOT NULL DEFAULT '',
    `keywords` TEXT NOT NULL,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `technologies_status_locale_sortOrder_idx`(`status`, `locale`, `sortOrder`),
    UNIQUE INDEX `technologies_slug_locale_key`(`slug`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `testimonials` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(191) NOT NULL DEFAULT 'en',
    `excerpt` TEXT NOT NULL,
    `content` LONGTEXT NOT NULL,
    `image` VARCHAR(2048) NOT NULL DEFAULT '',
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `data` JSON NOT NULL,
    `seoTitle` VARCHAR(255) NOT NULL DEFAULT '',
    `seoDescription` TEXT NOT NULL,
    `ogImage` VARCHAR(2048) NOT NULL DEFAULT '',
    `canonical` VARCHAR(2048) NOT NULL DEFAULT '',
    `keywords` TEXT NOT NULL,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `testimonials_status_locale_sortOrder_idx`(`status`, `locale`, `sortOrder`),
    UNIQUE INDEX `testimonials_slug_locale_key`(`slug`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `partners` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(191) NOT NULL DEFAULT 'en',
    `excerpt` TEXT NOT NULL,
    `content` LONGTEXT NOT NULL,
    `image` VARCHAR(2048) NOT NULL DEFAULT '',
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `data` JSON NOT NULL,
    `seoTitle` VARCHAR(255) NOT NULL DEFAULT '',
    `seoDescription` TEXT NOT NULL,
    `ogImage` VARCHAR(2048) NOT NULL DEFAULT '',
    `canonical` VARCHAR(2048) NOT NULL DEFAULT '',
    `keywords` TEXT NOT NULL,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `partners_status_locale_sortOrder_idx`(`status`, `locale`, `sortOrder`),
    UNIQUE INDEX `partners_slug_locale_key`(`slug`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team_members` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(191) NOT NULL DEFAULT 'en',
    `excerpt` TEXT NOT NULL,
    `content` LONGTEXT NOT NULL,
    `image` VARCHAR(2048) NOT NULL DEFAULT '',
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `data` JSON NOT NULL,
    `seoTitle` VARCHAR(255) NOT NULL DEFAULT '',
    `seoDescription` TEXT NOT NULL,
    `ogImage` VARCHAR(2048) NOT NULL DEFAULT '',
    `canonical` VARCHAR(2048) NOT NULL DEFAULT '',
    `keywords` TEXT NOT NULL,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `team_members_status_locale_sortOrder_idx`(`status`, `locale`, `sortOrder`),
    UNIQUE INDEX `team_members_slug_locale_key`(`slug`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_posts` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(191) NOT NULL DEFAULT 'en',
    `excerpt` TEXT NOT NULL,
    `content` LONGTEXT NOT NULL,
    `image` VARCHAR(2048) NOT NULL DEFAULT '',
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `data` JSON NOT NULL,
    `seoTitle` VARCHAR(255) NOT NULL DEFAULT '',
    `seoDescription` TEXT NOT NULL,
    `ogImage` VARCHAR(2048) NOT NULL DEFAULT '',
    `canonical` VARCHAR(2048) NOT NULL DEFAULT '',
    `keywords` TEXT NOT NULL,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `authorId` VARCHAR(191) NULL,
    `categoryId` VARCHAR(191) NULL,

    INDEX `blog_posts_status_locale_sortOrder_idx`(`status`, `locale`, `sortOrder`),
    UNIQUE INDEX `blog_posts_slug_locale_key`(`slug`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `portfolio_images` (
    `id` VARCHAR(191) NOT NULL,
    `portfolioId` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `alt` TEXT NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProjectTechnologies` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ProjectTechnologies_AB_unique`(`A`, `B`),
    INDEX `_ProjectTechnologies_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PostTags` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_PostTags_AB_unique`(`A`, `B`),
    INDEX `_PostTags_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_posts` ADD CONSTRAINT `blog_posts_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blog_posts` ADD CONSTRAINT `blog_posts_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `blog_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `portfolio_images` ADD CONSTRAINT `portfolio_images_portfolioId_fkey` FOREIGN KEY (`portfolioId`) REFERENCES `portfolio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectTechnologies` ADD CONSTRAINT `_ProjectTechnologies_A_fkey` FOREIGN KEY (`A`) REFERENCES `portfolio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectTechnologies` ADD CONSTRAINT `_ProjectTechnologies_B_fkey` FOREIGN KEY (`B`) REFERENCES `technologies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PostTags` ADD CONSTRAINT `_PostTags_A_fkey` FOREIGN KEY (`A`) REFERENCES `blog_posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PostTags` ADD CONSTRAINT `_PostTags_B_fkey` FOREIGN KEY (`B`) REFERENCES `blog_tags`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

