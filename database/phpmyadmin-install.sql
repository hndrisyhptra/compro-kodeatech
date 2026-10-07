-- KODEA TECH · MySQL 8 / phpMyAdmin installation
-- Import into an EMPTY database selected in phpMyAdmin.
-- Admin email/password: SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in local .env.
-- Passwords are bcrypt-hashed. Keep the local .env private.
SET NAMES utf8mb4;
SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO';

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



START TRANSACTION;
INSERT INTO `roles` (`id`, `name`) VALUES ('c8426537730b4124b0bbbc09ec23ee03', 'OWNER');
INSERT INTO `roles` (`id`, `name`) VALUES ('bd917b76d3004bc78dc2aecdeba9a389', 'EDITOR');
INSERT INTO `roles` (`id`, `name`) VALUES ('d241509191654c2b95832f31a426839c', 'VIEWER');
INSERT INTO `users` (`id`, `email`, `name`, `passwordHash`, `roleId`, `createdAt`) VALUES ('b2636487baa74ee48fa4f696037f3ac3', 'admin@kodeatech.cloud', 'Kodea Administrator', '$2b$12$btdrHvf/EVnCsoRZJYGN7eQo.8hpKEVZT2ee3pU4i2td2hxc25d.m', 'c8426537730b4124b0bbbc09ec23ee03', '2026-10-05 03:18:31.970');
INSERT INTO `settings` (`key`, `value`, `updatedAt`) VALUES ('general', '{"companyName":"KODEA TECH","tagline":"Technology that works for your business.","logo":"","favicon":"","email":"hello@kodeatech.cloud","phone":"","whatsapp":"6281234567890","address":"Indonesia · Working with teams everywhere","mapsUrl":"","linkedin":"","instagram":"","github":"","copyright":"KODEA TECH. All rights reserved.","heroLabel":"ENGINEERED FOR YOUR NEXT CHAPTER","heroTitle":"Good technology.","heroAccent":"Great possibilities.","heroSubtitle":"From your first idea to your next big milestone. We build digital products and IT infrastructure that move your business forward.","ctaLabel":"Start a project","ctaUrl":"/contact","secondaryCtaLabel":"Explore our solutions","secondaryCtaUrl":"/solutions","aboutTitle":"Technology that solves real business problems.","aboutText":"KodeaTech brings software engineering, digital solutions, and IT infrastructure together. We help businesses turn ambitious ideas into reliable systems — thoughtfully designed, carefully built, and supported for the long run.","stats":[{"value":"11","label":"Specialist services"},{"value":"08","label":"Solution areas"},{"value":"15","label":"Core technologies"},{"value":"24/7","label":"Support options"}],"technologiesIntro":"The right tools for the job. Proven technology, chosen around your needs.","gaId":"","searchVerification":"","seoTitle":"KODEA TECH — Technology That Moves Business Forward","seoDescription":"Software engineering, digital solutions, and dependable IT infrastructure. KodeaTech helps businesses build, connect, and grow.","ogImage":"","supportLabel":"Built for today. Ready for tomorrow."}', '2026-10-05 03:18:31.970');
INSERT INTO `services` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('8c02eb0cb9c44c93b8c01f99800db9c1', 'Web Application Development', 'web-application-development', 'en', 'Fast, intuitive web applications built around the way your business works.', '<p>Fast, intuitive web applications built around the way your business works.</p>', '', 'published', 1, 0, '{"icon":"Code","benefits":["A solution designed around your business","A dependable foundation that can grow with you","Clear ownership, documentation, and ongoing support"],"features":["Discovery and requirements mapping","Architecture and implementation","Testing, security review, and handover","Maintenance and continuous improvement"],"technology":["React","Next.js","TypeScript"],"workflow":["Discover your goals","Design the right solution","Build and validate","Launch and support"],"faq":["How do we get started? | Tell us about your goals and we will arrange a discovery conversation.","Can you work with existing systems? | Yes. We assess your current environment and plan integrations around your needs.","Do you provide ongoing support? | Support scope and response times are agreed as part of your project."]}', 'Web Application Development', 'Fast, intuitive web applications built around the way your business works.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `services` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('221c87146f064494b74ab2202a684e3b', 'Mobile Application Development', 'mobile-application-development', 'en', 'Useful mobile experiences that connect your business to people on the move.', '<p>Useful mobile experiences that connect your business to people on the move.</p>', '', 'published', 1, 1, '{"icon":"Smartphone","benefits":["A solution designed around your business","A dependable foundation that can grow with you","Clear ownership, documentation, and ongoing support"],"features":["Discovery and requirements mapping","Architecture and implementation","Testing, security review, and handover","Maintenance and continuous improvement"],"technology":["React Native","Flutter","REST APIs"],"workflow":["Discover your goals","Design the right solution","Build and validate","Launch and support"],"faq":["How do we get started? | Tell us about your goals and we will arrange a discovery conversation.","Can you work with existing systems? | Yes. We assess your current environment and plan integrations around your needs.","Do you provide ongoing support? | Support scope and response times are agreed as part of your project."]}', 'Mobile Application Development', 'Useful mobile experiences that connect your business to people on the move.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `services` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('17be2c764c7c409fb0981a5a6b3a18d2', 'Custom Software Development', 'custom-software-development', 'en', 'Purpose-built software for the challenges off-the-shelf products cannot solve.', '<p>Purpose-built software for the challenges off-the-shelf products cannot solve.</p>', '', 'published', 1, 2, '{"icon":"Layers","benefits":["A solution designed around your business","A dependable foundation that can grow with you","Clear ownership, documentation, and ongoing support"],"features":["Discovery and requirements mapping","Architecture and implementation","Testing, security review, and handover","Maintenance and continuous improvement"],"technology":["Node.js","Laravel","MySQL"],"workflow":["Discover your goals","Design the right solution","Build and validate","Launch and support"],"faq":["How do we get started? | Tell us about your goals and we will arrange a discovery conversation.","Can you work with existing systems? | Yes. We assess your current environment and plan integrations around your needs.","Do you provide ongoing support? | Support scope and response times are agreed as part of your project."]}', 'Custom Software Development', 'Purpose-built software for the challenges off-the-shelf products cannot solve.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `services` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('05427fe1b562404889de52f2c2079d0e', 'IT Tools & Automation', 'it-tools-automation', 'en', 'Less repetitive work. More time to focus on what matters.', '<p>Less repetitive work. More time to focus on what matters.</p>', '', 'published', 1, 3, '{"icon":"Workflow","benefits":["A solution designed around your business","A dependable foundation that can grow with you","Clear ownership, documentation, and ongoing support"],"features":["Discovery and requirements mapping","Architecture and implementation","Testing, security review, and handover","Maintenance and continuous improvement"],"technology":["Node.js","Python","REST APIs"],"workflow":["Discover your goals","Design the right solution","Build and validate","Launch and support"],"faq":["How do we get started? | Tell us about your goals and we will arrange a discovery conversation.","Can you work with existing systems? | Yes. We assess your current environment and plan integrations around your needs.","Do you provide ongoing support? | Support scope and response times are agreed as part of your project."]}', 'IT Tools & Automation', 'Less repetitive work. More time to focus on what matters.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `services` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('229c70d44ebf401ab168ca70e4eb5990', 'Network & Internet Infrastructure', 'network-internet-infrastructure', 'en', 'Stable connectivity that keeps your people, systems, and operations connected.', '<p>Stable connectivity that keeps your people, systems, and operations connected.</p>', '', 'published', 1, 4, '{"icon":"Network","benefits":["A solution designed around your business","A dependable foundation that can grow with you","Clear ownership, documentation, and ongoing support"],"features":["Discovery and requirements mapping","Architecture and implementation","Testing, security review, and handover","Maintenance and continuous improvement"],"technology":["Mikrotik","Cisco","Linux"],"workflow":["Discover your goals","Design the right solution","Build and validate","Launch and support"],"faq":["How do we get started? | Tell us about your goals and we will arrange a discovery conversation.","Can you work with existing systems? | Yes. We assess your current environment and plan integrations around your needs.","Do you provide ongoing support? | Support scope and response times are agreed as part of your project."]}', 'Network & Internet Infrastructure', 'Stable connectivity that keeps your people, systems, and operations connected.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `services` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('5e1a96d33f234590a90e249ab0fae708', 'CCTV & Security System', 'cctv-security-system', 'en', 'Thoughtfully designed security and monitoring for your physical spaces.', '<p>Thoughtfully designed security and monitoring for your physical spaces.</p>', '', 'published', 1, 5, '{"icon":"Shield","benefits":["A solution designed around your business","A dependable foundation that can grow with you","Clear ownership, documentation, and ongoing support"],"features":["Discovery and requirements mapping","Architecture and implementation","Testing, security review, and handover","Maintenance and continuous improvement"],"technology":["IP cameras","NVR","Network monitoring"],"workflow":["Discover your goals","Design the right solution","Build and validate","Launch and support"],"faq":["How do we get started? | Tell us about your goals and we will arrange a discovery conversation.","Can you work with existing systems? | Yes. We assess your current environment and plan integrations around your needs.","Do you provide ongoing support? | Support scope and response times are agreed as part of your project."]}', 'CCTV & Security System', 'Thoughtfully designed security and monitoring for your physical spaces.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `services` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('0142b7d4090141968f5b0f9c5619fffc', 'IT Infrastructure', 'it-infrastructure', 'en', 'Reliable foundations for business-critical applications and everyday operations.', '<p>Reliable foundations for business-critical applications and everyday operations.</p>', '', 'published', 1, 6, '{"icon":"Server","benefits":["A solution designed around your business","A dependable foundation that can grow with you","Clear ownership, documentation, and ongoing support"],"features":["Discovery and requirements mapping","Architecture and implementation","Testing, security review, and handover","Maintenance and continuous improvement"],"technology":["Linux","Docker","Cloud"],"workflow":["Discover your goals","Design the right solution","Build and validate","Launch and support"],"faq":["How do we get started? | Tell us about your goals and we will arrange a discovery conversation.","Can you work with existing systems? | Yes. We assess your current environment and plan integrations around your needs.","Do you provide ongoing support? | Support scope and response times are agreed as part of your project."]}', 'IT Infrastructure', 'Reliable foundations for business-critical applications and everyday operations.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `services` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('95073e68c3ac4b9ea47d36d7ac31ee42', 'System Integration', 'system-integration', 'en', 'Bring separate tools and data together into one connected business.', '<p>Bring separate tools and data together into one connected business.</p>', '', 'published', 1, 7, '{"icon":"Cable","benefits":["A solution designed around your business","A dependable foundation that can grow with you","Clear ownership, documentation, and ongoing support"],"features":["Discovery and requirements mapping","Architecture and implementation","Testing, security review, and handover","Maintenance and continuous improvement"],"technology":["REST APIs","MySQL","Redis"],"workflow":["Discover your goals","Design the right solution","Build and validate","Launch and support"],"faq":["How do we get started? | Tell us about your goals and we will arrange a discovery conversation.","Can you work with existing systems? | Yes. We assess your current environment and plan integrations around your needs.","Do you provide ongoing support? | Support scope and response times are agreed as part of your project."]}', 'System Integration', 'Bring separate tools and data together into one connected business.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `services` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('334cca4bc05b4da6a4e70a57e189c9b5', 'IT Maintenance & Support', 'it-maintenance-support', 'en', 'Practical, responsive support that helps your technology keep performing.', '<p>Practical, responsive support that helps your technology keep performing.</p>', '', 'published', 1, 8, '{"icon":"Headphones","benefits":["A solution designed around your business","A dependable foundation that can grow with you","Clear ownership, documentation, and ongoing support"],"features":["Discovery and requirements mapping","Architecture and implementation","Testing, security review, and handover","Maintenance and continuous improvement"],"technology":["Monitoring","Linux","Network tools"],"workflow":["Discover your goals","Design the right solution","Build and validate","Launch and support"],"faq":["How do we get started? | Tell us about your goals and we will arrange a discovery conversation.","Can you work with existing systems? | Yes. We assess your current environment and plan integrations around your needs.","Do you provide ongoing support? | Support scope and response times are agreed as part of your project."]}', 'IT Maintenance & Support', 'Practical, responsive support that helps your technology keep performing.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `services` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('438514c8b1184048a341b66d4c86dd3c', 'Digital Transformation', 'digital-transformation', 'en', 'Turn business goals into a practical roadmap for meaningful digital change.', '<p>Turn business goals into a practical roadmap for meaningful digital change.</p>', '', 'published', 1, 9, '{"icon":"Sparkles","benefits":["A solution designed around your business","A dependable foundation that can grow with you","Clear ownership, documentation, and ongoing support"],"features":["Discovery and requirements mapping","Architecture and implementation","Testing, security review, and handover","Maintenance and continuous improvement"],"technology":["Process design","Analytics","Cloud"],"workflow":["Discover your goals","Design the right solution","Build and validate","Launch and support"],"faq":["How do we get started? | Tell us about your goals and we will arrange a discovery conversation.","Can you work with existing systems? | Yes. We assess your current environment and plan integrations around your needs.","Do you provide ongoing support? | Support scope and response times are agreed as part of your project."]}', 'Digital Transformation', 'Turn business goals into a practical roadmap for meaningful digital change.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `services` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('f523e3b5d4f644b08cfc8feebb715cc9', 'IT Consulting', 'it-consulting', 'en', 'Clear technical advice to make confident decisions about your next investment.', '<p>Clear technical advice to make confident decisions about your next investment.</p>', '', 'published', 1, 10, '{"icon":"Compass","benefits":["A solution designed around your business","A dependable foundation that can grow with you","Clear ownership, documentation, and ongoing support"],"features":["Discovery and requirements mapping","Architecture and implementation","Testing, security review, and handover","Maintenance and continuous improvement"],"technology":["Architecture","Security","Infrastructure"],"workflow":["Discover your goals","Design the right solution","Build and validate","Launch and support"],"faq":["How do we get started? | Tell us about your goals and we will arrange a discovery conversation.","Can you work with existing systems? | Yes. We assess your current environment and plan integrations around your needs.","Do you provide ongoing support? | Support scope and response times are agreed as part of your project."]}', 'IT Consulting', 'Clear technical advice to make confident decisions about your next investment.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `solutions` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('aa99381aabc1417387e232b493abaa0c', 'Business Application', 'business-application', 'en', 'Bring your business processes into one intuitive workspace.', '<p>Bring your business processes into one intuitive workspace.</p>', '', 'published', 1, 0, '{"icon":"Layers","features":["Business discovery","Solution architecture","Implementation and training"],"benefits":["Clearer visibility","More efficient operations","A foundation for growth"]}', 'Business Application', 'Bring your business processes into one intuitive workspace.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `solutions` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('ee3a99d0384e4d1dac9c7007373d82d5', 'Digital Monitoring', 'digital-monitoring', 'en', 'Understand what is happening across your operations in real time.', '<p>Understand what is happening across your operations in real time.</p>', '', 'published', 1, 1, '{"icon":"Activity","features":["Business discovery","Solution architecture","Implementation and training"],"benefits":["Clearer visibility","More efficient operations","A foundation for growth"]}', 'Digital Monitoring', 'Understand what is happening across your operations in real time.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `solutions` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('f742832f7d014d65bcd8b6c9b85e2219', 'Workflow Automation', 'workflow-automation', 'en', 'Connect tasks, reduce manual work, and keep progress moving.', '<p>Connect tasks, reduce manual work, and keep progress moving.</p>', '', 'published', 1, 2, '{"icon":"Workflow","features":["Business discovery","Solution architecture","Implementation and training"],"benefits":["Clearer visibility","More efficient operations","A foundation for growth"]}', 'Workflow Automation', 'Connect tasks, reduce manual work, and keep progress moving.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `solutions` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('1d6063950eca41a3b0a498807aa98f7e', 'Network Infrastructure', 'network-infrastructure', 'en', 'Build stable, secure connectivity across locations and teams.', '<p>Build stable, secure connectivity across locations and teams.</p>', '', 'published', 1, 3, '{"icon":"Network","features":["Business discovery","Solution architecture","Implementation and training"],"benefits":["Clearer visibility","More efficient operations","A foundation for growth"]}', 'Network Infrastructure', 'Build stable, secure connectivity across locations and teams.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `solutions` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('68df076442834722bcb5b1bf28c3f512', 'Security & CCTV', 'security-cctv', 'en', 'Protect your spaces with clear visibility and connected security.', '<p>Protect your spaces with clear visibility and connected security.</p>', '', 'published', 1, 4, '{"icon":"Shield","features":["Business discovery","Solution architecture","Implementation and training"],"benefits":["Clearer visibility","More efficient operations","A foundation for growth"]}', 'Security & CCTV', 'Protect your spaces with clear visibility and connected security.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `solutions` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('d7046df084a54a699af99c7919d6e559', 'Data & Analytics', 'data-analytics', 'en', 'Turn operational information into useful business decisions.', '<p>Turn operational information into useful business decisions.</p>', '', 'published', 1, 5, '{"icon":"ChartNoAxesCombined","features":["Business discovery","Solution architecture","Implementation and training"],"benefits":["Clearer visibility","More efficient operations","A foundation for growth"]}', 'Data & Analytics', 'Turn operational information into useful business decisions.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `solutions` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('b801e0dc11b14d92894c7e7c04d914c6', 'Cloud & Server', 'cloud-server', 'en', 'Deploy your applications on a reliable, scalable foundation.', '<p>Deploy your applications on a reliable, scalable foundation.</p>', '', 'published', 1, 6, '{"icon":"Cloud","features":["Business discovery","Solution architecture","Implementation and training"],"benefits":["Clearer visibility","More efficient operations","A foundation for growth"]}', 'Cloud & Server', 'Deploy your applications on a reliable, scalable foundation.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `solutions` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('595850551f06449aacadc2d25168dfb8', 'System Integration', 'system-integration', 'en', 'Connect your existing tools without losing what already works.', '<p>Connect your existing tools without losing what already works.</p>', '', 'published', 1, 7, '{"icon":"Cable","features":["Business discovery","Solution architecture","Implementation and training"],"benefits":["Clearer visibility","More efficient operations","A foundation for growth"]}', 'System Integration', 'Connect your existing tools without losing what already works.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `technologies` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('e41c2de6a7da44d29cf90e8be7dd41bb', 'React', 'react', 'en', 'Part of our technology toolkit.', '<p>Part of our technology toolkit.</p>', '', 'published', 1, 0, '{"symbol":"Re","category":"Development"}', 'React', 'Part of our technology toolkit.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `technologies` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('4713f931cff9471f9cdcd4f7abb967c5', 'Next.js', 'next-js', 'en', 'Part of our technology toolkit.', '<p>Part of our technology toolkit.</p>', '', 'published', 1, 1, '{"symbol":"Ne","category":"Development"}', 'Next.js', 'Part of our technology toolkit.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `technologies` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('dce433022796404ca727432675953da3', 'Laravel', 'laravel', 'en', 'Part of our technology toolkit.', '<p>Part of our technology toolkit.</p>', '', 'published', 1, 2, '{"symbol":"La","category":"Development"}', 'Laravel', 'Part of our technology toolkit.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `technologies` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('a548eeb10174400ba27f20cd7c47d079', 'PHP', 'php', 'en', 'Part of our technology toolkit.', '<p>Part of our technology toolkit.</p>', '', 'published', 1, 3, '{"symbol":"PH","category":"Development"}', 'PHP', 'Part of our technology toolkit.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `technologies` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('b3ae84eeb698417db9af77a6dcbe7839', 'Node.js', 'node-js', 'en', 'Part of our technology toolkit.', '<p>Part of our technology toolkit.</p>', '', 'published', 1, 4, '{"symbol":"No","category":"Development"}', 'Node.js', 'Part of our technology toolkit.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `technologies` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('9b59898de9cf42d5a0707c1a9570a012', 'TypeScript', 'typescript', 'en', 'Part of our technology toolkit.', '<p>Part of our technology toolkit.</p>', '', 'published', 1, 5, '{"symbol":"Ty","category":"Development"}', 'TypeScript', 'Part of our technology toolkit.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `technologies` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('01a50d1911a74c1b95f7bcc21e23f276', 'JavaScript', 'javascript', 'en', 'Part of our technology toolkit.', '<p>Part of our technology toolkit.</p>', '', 'published', 1, 6, '{"symbol":"Ja","category":"Development"}', 'JavaScript', 'Part of our technology toolkit.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `technologies` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('499d5d055e384273b44cc89c352213db', 'MySQL', 'mysql', 'en', 'Part of our technology toolkit.', '<p>Part of our technology toolkit.</p>', '', 'published', 1, 7, '{"symbol":"My","category":"Data"}', 'MySQL', 'Part of our technology toolkit.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `technologies` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('c9596a3fa7bc4fdb8996524b64c70e06', 'PostgreSQL', 'postgresql', 'en', 'Part of our technology toolkit.', '<p>Part of our technology toolkit.</p>', '', 'published', 1, 8, '{"symbol":"Po","category":"Data"}', 'PostgreSQL', 'Part of our technology toolkit.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `technologies` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('da7bc8732fbc4e15ad1a6ec66c8c7033', 'Redis', 'redis', 'en', 'Part of our technology toolkit.', '<p>Part of our technology toolkit.</p>', '', 'published', 1, 9, '{"symbol":"Re","category":"Data"}', 'Redis', 'Part of our technology toolkit.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `technologies` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('86a9f96231f4468aba3f860d00db0881', 'Docker', 'docker', 'en', 'Part of our technology toolkit.', '<p>Part of our technology toolkit.</p>', '', 'published', 1, 10, '{"symbol":"Do","category":"Infrastructure"}', 'Docker', 'Part of our technology toolkit.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `technologies` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('4b0646fa8efe4542800bca1e2257f849', 'Linux', 'linux', 'en', 'Part of our technology toolkit.', '<p>Part of our technology toolkit.</p>', '', 'published', 1, 11, '{"symbol":"Li","category":"Infrastructure"}', 'Linux', 'Part of our technology toolkit.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `technologies` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('f626aea691c74ecaa0f8f21e1fd746bd', 'Mikrotik', 'mikrotik', 'en', 'Part of our technology toolkit.', '<p>Part of our technology toolkit.</p>', '', 'published', 1, 12, '{"symbol":"Mi","category":"Infrastructure"}', 'Mikrotik', 'Part of our technology toolkit.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `technologies` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('484ec812d5cf47dc96b641301b2c7df0', 'Cisco', 'cisco', 'en', 'Part of our technology toolkit.', '<p>Part of our technology toolkit.</p>', '', 'published', 1, 13, '{"symbol":"Ci","category":"Infrastructure"}', 'Cisco', 'Part of our technology toolkit.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `technologies` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('c33b74fea0464f408de18bc41fa00fca', 'Cloud', 'cloud', 'en', 'Part of our technology toolkit.', '<p>Part of our technology toolkit.</p>', '', 'published', 1, 14, '{"symbol":"Cl","category":"Infrastructure"}', 'Cloud', 'Part of our technology toolkit.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `portfolio` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('9c7eaa51b254435ba8ac937cd10f9d56', 'Enterprise Monitoring Platform', 'enterprise-monitoring-platform', 'en', 'A clearer view of complex operations.', '<p>A clearer view of complex operations.</p>', '', 'published', 1, 0, '{"client":"Demonstration project","category":"Digital platforms","challenge":"Teams need better visibility across disconnected processes and systems. This demonstration explores a practical approach to bringing that information together.","solution":"A central platform combines a focused interface, reliable data flows, and clear operational workflows. The architecture is designed to support future integrations.","result":"This example illustrates the delivery approach and intended business outcomes. No client-specific performance claims are made.","metrics":["01 | Connected workspace","04 | Delivery phases"],"technology":["Next.js","TypeScript","MySQL"],"projectDate":"2026","websiteUrl":"","thumbnail":"","gallery":[],"illustration":"monitor","demo":"true"}', 'Enterprise Monitoring Platform', 'A clearer view of complex operations.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `portfolio` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('4d5ec7d3ca50422185d0ea76fc304869', 'Digital Operation Management', 'digital-operation-management', 'en', 'One workspace. A more connected team.', '<p>One workspace. A more connected team.</p>', '', 'published', 1, 1, '{"client":"Demonstration project","category":"Business software","challenge":"Teams need better visibility across disconnected processes and systems. This demonstration explores a practical approach to bringing that information together.","solution":"A central platform combines a focused interface, reliable data flows, and clear operational workflows. The architecture is designed to support future integrations.","result":"This example illustrates the delivery approach and intended business outcomes. No client-specific performance claims are made.","metrics":["01 | Connected workspace","04 | Delivery phases"],"technology":["Next.js","TypeScript","MySQL"],"projectDate":"2026","websiteUrl":"","thumbnail":"","gallery":[],"illustration":"operations","demo":"true"}', 'Digital Operation Management', 'One workspace. A more connected team.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `portfolio` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('6a0eed7a34a245809d42c9a284cdb577', 'Network Infrastructure Deployment', 'network-infrastructure-deployment', 'en', 'A dependable network for distributed operations.', '<p>A dependable network for distributed operations.</p>', '', 'published', 1, 2, '{"client":"Demonstration project","category":"Infrastructure","challenge":"Teams need better visibility across disconnected processes and systems. This demonstration explores a practical approach to bringing that information together.","solution":"A central platform combines a focused interface, reliable data flows, and clear operational workflows. The architecture is designed to support future integrations.","result":"This example illustrates the delivery approach and intended business outcomes. No client-specific performance claims are made.","metrics":["01 | Connected workspace","04 | Delivery phases"],"technology":["Next.js","TypeScript","MySQL"],"projectDate":"2026","websiteUrl":"","thumbnail":"","gallery":[],"illustration":"network","demo":"true"}', 'Network Infrastructure Deployment', 'A dependable network for distributed operations.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `portfolio` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('709ca5654fcd4a34a828d333fe947edf', 'Business Workflow Automation', 'business-workflow-automation', 'en', 'Move from manual processes to connected workflows.', '<p>Move from manual processes to connected workflows.</p>', '', 'published', 1, 3, '{"client":"Demonstration project","category":"Automation","challenge":"Teams need better visibility across disconnected processes and systems. This demonstration explores a practical approach to bringing that information together.","solution":"A central platform combines a focused interface, reliable data flows, and clear operational workflows. The architecture is designed to support future integrations.","result":"This example illustrates the delivery approach and intended business outcomes. No client-specific performance claims are made.","metrics":["01 | Connected workspace","04 | Delivery phases"],"technology":["Next.js","TypeScript","MySQL"],"projectDate":"2026","websiteUrl":"","thumbnail":"","gallery":[],"illustration":"automation","demo":"true"}', 'Business Workflow Automation', 'Move from manual processes to connected workflows.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `portfolio` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('b87902b1138a4c19a619f9a5a82860e9', 'CCTV & Security Infrastructure', 'cctv-security-infrastructure', 'en', 'Visibility and security, working together.', '<p>Visibility and security, working together.</p>', '', 'published', 1, 4, '{"client":"Demonstration project","category":"Security systems","challenge":"Teams need better visibility across disconnected processes and systems. This demonstration explores a practical approach to bringing that information together.","solution":"A central platform combines a focused interface, reliable data flows, and clear operational workflows. The architecture is designed to support future integrations.","result":"This example illustrates the delivery approach and intended business outcomes. No client-specific performance claims are made.","metrics":["01 | Connected workspace","04 | Delivery phases"],"technology":["Next.js","TypeScript","MySQL"],"projectDate":"2026","websiteUrl":"","thumbnail":"","gallery":[],"illustration":"security","demo":"true"}', 'CCTV & Security Infrastructure', 'Visibility and security, working together.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `blog_categories` (`id`, `name`, `slug`) VALUES ('444a753643fa47d681b4fdd3146357e0', 'Engineering', 'engineering');
INSERT INTO `blog_categories` (`id`, `name`, `slug`) VALUES ('2408aa590bf74af4a3abaef5df8e7b49', 'Infrastructure', 'infrastructure');
INSERT INTO `blog_categories` (`id`, `name`, `slug`) VALUES ('ac718a7ae11b49228319fd4b52d8ab66', 'Digital transformation', 'digital-transformation');
INSERT INTO `blog_tags` (`id`, `name`, `slug`) VALUES ('645cc73d1235417a8bec59015affcd6b', 'Engineering', 'engineering');
INSERT INTO `blog_tags` (`id`, `name`, `slug`) VALUES ('70eeeab99f00472783418b599e4c1402', 'Infrastructure', 'infrastructure');
INSERT INTO `blog_tags` (`id`, `name`, `slug`) VALUES ('934e85037d3743f3a2f5ecbdceb787da', 'Digital transformation', 'digital-transformation');
INSERT INTO `blog_posts` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `authorId`, `categoryId`, `createdAt`, `updatedAt`) VALUES ('f8d4a8f590aa42309a64984f233d6872', 'Great software starts with better questions', 'great-software-starts-with-better-questions', 'en', 'Before choosing a framework, get clear on the problem you are solving.', '<h2>Start with the business</h2><p>A successful digital product begins with understanding the people who will use it. Map their current workflow, ask where time is lost, and agree on what a better outcome would look like.</p><h2>Make the scope measurable</h2><p>Choose a few concrete outcomes: fewer manual steps, faster reporting, or more reliable information. These goals help a team decide what belongs in the first release.</p><blockquote>Good discovery turns a long feature list into a clear product direction.</blockquote><h2>Build in small, useful increments</h2><p>Validate the most important workflow early. Bring users into the process, keep decisions visible, and use real feedback to shape the next iteration.</p>', '', 'published', 1, 0, '{"category":"Engineering","tags":["Engineering","Technology"],"author":"KodeaTech Editorial","readTime":"6 min read"}', 'Great software starts with better questions', 'Before choosing a framework, get clear on the problem you are solving.', '', '', '', '2026-10-05 03:18:31.970', 'b2636487baa74ee48fa4f696037f3ac3', '444a753643fa47d681b4fdd3146357e0', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `blog_posts` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `authorId`, `categoryId`, `createdAt`, `updatedAt`) VALUES ('c50a4c74fa86412ea99c7fbd71afd258', 'Building an IT foundation that grows with you', 'building-an-it-foundation-that-grows-with-you', 'en', 'A practical approach to networks, servers, and business continuity.', '<h2>Reliability is a design decision</h2><p>A dependable infrastructure starts with understanding your critical systems. Document which applications your team uses, who needs access, and what happens when a connection fails.</p><h2>Plan for operations</h2><p>Monitoring, tested backups, clear access control, and documented recovery steps matter as much as the initial deployment.</p><h2>Keep the architecture understandable</h2><p>Choose tools your team can maintain. Record configurations, review capacity regularly, and agree on support responsibilities before launch.</p>', '', 'published', 1, 1, '{"category":"Infrastructure","tags":["Infrastructure","Technology"],"author":"KodeaTech Editorial","readTime":"5 min read"}', 'Building an IT foundation that grows with you', 'A practical approach to networks, servers, and business continuity.', '', '', '', '2026-10-05 03:18:31.970', 'b2636487baa74ee48fa4f696037f3ac3', '2408aa590bf74af4a3abaef5df8e7b49', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `blog_posts` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `authorId`, `categoryId`, `createdAt`, `updatedAt`) VALUES ('422c812e152944e8846f238a621971a5', 'The real value of workflow automation', 'the-real-value-of-workflow-automation', 'en', 'How to choose the repetitive tasks worth automating first.', '<h2>Follow the work</h2><p>Look for tasks that repeat often and follow predictable rules. Data entry, status updates, and routine notifications are useful places to start.</p><h2>Improve before automating</h2><p>Remove unnecessary steps first. Automating an unclear process can make the same problems happen faster.</p><h2>Keep people in control</h2><p>Make exceptions visible, provide a way to review changes, and measure how much time the new process actually saves.</p>', '', 'published', 1, 2, '{"category":"Digital transformation","tags":["Digital transformation","Technology"],"author":"KodeaTech Editorial","readTime":"4 min read"}', 'The real value of workflow automation', 'How to choose the repetitive tasks worth automating first.', '', '', '', '2026-10-05 03:18:31.970', 'b2636487baa74ee48fa4f696037f3ac3', 'ac718a7ae11b49228319fd4b52d8ab66', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `_PostTags` (`A`, `B`) VALUES ('f8d4a8f590aa42309a64984f233d6872', '645cc73d1235417a8bec59015affcd6b');
INSERT INTO `_PostTags` (`A`, `B`) VALUES ('c50a4c74fa86412ea99c7fbd71afd258', '70eeeab99f00472783418b599e4c1402');
INSERT INTO `_PostTags` (`A`, `B`) VALUES ('422c812e152944e8846f238a621971a5', '934e85037d3743f3a2f5ecbdceb787da');
INSERT INTO `partners` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('ce2d50070b3d4909aa7470a386d2b226', 'ASTER', 'aster', 'en', 'Illustrative company identity. Replace with an authorized client or partner before publication.', '<p>Illustrative company identity. Replace with an authorized client or partner before publication.</p>', '', 'published', 1, 0, '{"category":"Business Partner","websiteUrl":"","demo":"true"}', 'ASTER', 'Illustrative company identity. Replace with an authorized client or partner before publication.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `partners` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('e126531f588846b69ef00ef38d676e0d', 'Bumi Group', 'bumi-group', 'en', 'Illustrative company identity. Replace with an authorized client or partner before publication.', '<p>Illustrative company identity. Replace with an authorized client or partner before publication.</p>', '', 'published', 1, 1, '{"category":"Business Partner","websiteUrl":"","demo":"true"}', 'Bumi Group', 'Illustrative company identity. Replace with an authorized client or partner before publication.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `partners` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('756b1c04cd964bb3a7408e37f604834d', 'NEXORA', 'nexora', 'en', 'Illustrative company identity. Replace with an authorized client or partner before publication.', '<p>Illustrative company identity. Replace with an authorized client or partner before publication.</p>', '', 'published', 1, 2, '{"category":"Business Partner","websiteUrl":"","demo":"true"}', 'NEXORA', 'Illustrative company identity. Replace with an authorized client or partner before publication.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `partners` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('89141496434f4596857d07a857c881d1', 'orbit', 'orbit', 'en', 'Illustrative company identity. Replace with an authorized client or partner before publication.', '<p>Illustrative company identity. Replace with an authorized client or partner before publication.</p>', '', 'published', 1, 3, '{"category":"Business Partner","websiteUrl":"","demo":"true"}', 'orbit', 'Illustrative company identity. Replace with an authorized client or partner before publication.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `partners` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('10da50c35a3a4630ada81045988cde81', 'VANTAGE', 'vantage', 'en', 'Illustrative company identity. Replace with an authorized client or partner before publication.', '<p>Illustrative company identity. Replace with an authorized client or partner before publication.</p>', '', 'published', 1, 4, '{"category":"Business Partner","websiteUrl":"","demo":"true"}', 'VANTAGE', 'Illustrative company identity. Replace with an authorized client or partner before publication.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `testimonials` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('ba07575611e14f7ea320dcd3d0228108', 'Example client', 'example-client', 'en', 'What stood out was the clarity. From the first conversation to the final handover, every decision had a purpose and our team knew what to expect.', '<p>What stood out was the clarity. From the first conversation to the final handover, every decision had a purpose and our team knew what to expect.</p>', '', 'published', 1, 0, '{"position":"Operations lead","company":"Demonstration testimonial","rating":5,"demo":"true"}', 'Example client', 'What stood out was the clarity. From the first conversation to the final handover, every decision had a purpose and our team knew what to expect.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `team_members` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('aef88399f0c54a2e904b3439054302a6', 'Software Engineering', 'software-engineering', 'en', 'Thoughtful architecture, useful interfaces, and maintainable software.', '<p>Thoughtful architecture, useful interfaces, and maintainable software.</p>', '', 'published', 1, 0, '{"position":"Engineering team","linkedin":"","instagram":""}', 'Software Engineering', 'Thoughtful architecture, useful interfaces, and maintainable software.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `team_members` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('ca7eb852bc25465fbdb01d157df807b2', 'Infrastructure & Networks', 'infrastructure-networks', 'en', 'Reliable connectivity and systems designed for real operations.', '<p>Reliable connectivity and systems designed for real operations.</p>', '', 'published', 1, 1, '{"position":"Infrastructure team","linkedin":"","instagram":""}', 'Infrastructure & Networks', 'Reliable connectivity and systems designed for real operations.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `team_members` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('15abc0059b1e4218be8150e36232afb9', 'Delivery & Support', 'delivery-support', 'en', 'Clear communication from discovery through launch and ongoing care.', '<p>Clear communication from discovery through launch and ongoing care.</p>', '', 'published', 1, 2, '{"position":"Delivery team","linkedin":"","instagram":""}', 'Delivery & Support', 'Clear communication from discovery through launch and ongoing care.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `pages` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('513522a6dd874f0a8906941db312a570', 'A technology partner for your next chapter.', 'about', 'en', 'We believe good technology should make business simpler. KodeaTech combines thoughtful software engineering with practical infrastructure expertise to help teams build, connect, and grow.', '<p>We believe good technology should make business simpler. KodeaTech combines thoughtful software engineering with practical infrastructure expertise to help teams build, connect, and grow.</p>', '', 'published', 1, 0, '{"eyebrow":"OUR COMPANY"}', 'A technology partner for your next chapter.', 'We believe good technology should make business simpler. KodeaTech combines thoughtful software engineering with practical infrastructure expertise to help teams build, connect, and grow.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `pages` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('99f4d72a9a1f45928c24412066d871ec', 'Expertise that brings your ideas to life.', 'services', 'en', 'From digital products to the infrastructure behind them, we connect the expertise you need to move forward.', '<p>From digital products to the infrastructure behind them, we connect the expertise you need to move forward.</p>', '', 'published', 1, 0, '{"eyebrow":"WHAT WE DO"}', 'Expertise that brings your ideas to life.', 'From digital products to the infrastructure behind them, we connect the expertise you need to move forward.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `pages` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('338eb8b6bd7646ffbea21c91edea4d0a', 'Connected solutions. Real possibilities.', 'solutions', 'en', 'Technology works best when it fits your business. Explore practical solutions for your next challenge.', '<p>Technology works best when it fits your business. Explore practical solutions for your next challenge.</p>', '', 'published', 1, 0, '{"eyebrow":"BUILT AROUND YOUR BUSINESS"}', 'Connected solutions. Real possibilities.', 'Technology works best when it fits your business. Explore practical solutions for your next challenge.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `pages` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('95d5706b78af457c83572f984c5079c4', 'Good ideas, thoughtfully engineered.', 'portfolio', 'en', 'Explore our approach to digital products, business systems, and reliable infrastructure.', '<p>Explore our approach to digital products, business systems, and reliable infrastructure.</p>', '', 'published', 1, 0, '{"eyebrow":"SELECTED WORK"}', 'Good ideas, thoughtfully engineered.', 'Explore our approach to digital products, business systems, and reliable infrastructure.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `pages` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('28bdf9e9aa924cc09b0365ac5afee32e', 'A little perspective. A lot of possibility.', 'blog', 'en', 'Ideas and practical thinking from the world of software, infrastructure, and digital business.', '<p>Ideas and practical thinking from the world of software, infrastructure, and digital business.</p>', '', 'published', 1, 0, '{"eyebrow":"THE KODEA JOURNAL"}', 'A little perspective. A lot of possibility.', 'Ideas and practical thinking from the world of software, infrastructure, and digital business.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `pages` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('4976c1ee1e614a0db07ceda9070d595a', 'Partnership is at the heart of our work.', 'testimonials', 'en', 'Clear communication, thoughtful decisions, and a shared commitment to a useful result.', '<p>Clear communication, thoughtful decisions, and a shared commitment to a useful result.</p>', '', 'published', 1, 0, '{"eyebrow":"CLIENT PERSPECTIVES"}', 'Partnership is at the heart of our work.', 'Clear communication, thoughtful decisions, and a shared commitment to a useful result.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `pages` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('999536c848b64e4283e6817fb0ca7747', 'Better technology, built together.', 'partners', 'en', 'Our ecosystem brings together expertise across software, networks, cloud, and infrastructure.', '<p>Our ecosystem brings together expertise across software, networks, cloud, and infrastructure.</p>', '', 'published', 1, 0, '{"eyebrow":"OUR PARTNERS"}', 'Better technology, built together.', 'Our ecosystem brings together expertise across software, networks, cloud, and infrastructure.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `pages` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('e8a185a2a7b94945b395a1c1d91725f3', 'Let''s build something great together.', 'contact', 'en', 'Have an idea, a challenge, or a question? Tell us what you have in mind. We will help you find a practical next step.', '<p>Have an idea, a challenge, or a question? Tell us what you have in mind. We will help you find a practical next step.</p>', '', 'published', 1, 0, '{"eyebrow":"START A CONVERSATION"}', 'Let''s build something great together.', 'Have an idea, a challenge, or a question? Tell us what you have in mind. We will help you find a practical next step.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `pages` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('501ccb5bce3042a9a6bf17eca3737c20', 'Do meaningful work. Build what matters.', 'careers', 'en', 'We are interested in thoughtful people who care about useful technology. Share your experience and the work you want to do with our team.', '<p>We are interested in thoughtful people who care about useful technology. Share your experience and the work you want to do with our team.</p>', '', 'published', 1, 0, '{"eyebrow":"GROW WITH KODEA"}', 'Do meaningful work. Build what matters.', 'We are interested in thoughtful people who care about useful technology. Share your experience and the work you want to do with our team.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `pages` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('a5ae43f2f9d74924b4f00d0cc997052e', 'Privacy policy', 'privacy-policy', 'en', 'We collect information you choose to send through our contact form, including your name, contact details, company, and project description. We use it to respond to your inquiry and manage our business communications.', '<p>We collect information you choose to send through our contact form, including your name, contact details, company, and project description. We use it to respond to your inquiry and manage our business communications.</p><h2>Storage and access</h2><p>Submitted information is stored in our systems and accessed by authorized staff. Contact us to request correction or deletion. We retain information only as needed for business communications and applicable obligations.</p><h2>Cookies and analytics</h2><p>We use necessary cookies for admin authentication and browser storage for your theme preference. Optional analytics, when enabled, require your consent.</p><h2>Contact</h2><p>Send privacy requests to hello@kodeatech.cloud.</p>', '', 'published', 1, 0, '{"eyebrow":"YOUR PRIVACY"}', 'Privacy policy', 'We collect information you choose to send through our contact form, including your name, contact details, company, and project description. We use it to respond to your inquiry and manage our business communications.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `pages` (`id`, `title`, `slug`, `locale`, `excerpt`, `content`, `image`, `status`, `featured`, `sortOrder`, `data`, `seoTitle`, `seoDescription`, `ogImage`, `canonical`, `keywords`, `publishedAt`, `createdAt`, `updatedAt`) VALUES ('29efe48ed2714dc191489315a0810114', 'Terms & conditions', 'terms', 'en', 'This website describes our services and provides general information. Project scope, fees, delivery schedules, intellectual property, and support are agreed in a separate written agreement.', '<p>This website describes our services and provides general information. Project scope, fees, delivery schedules, intellectual property, and support are agreed in a separate written agreement.</p>', '', 'published', 1, 0, '{"eyebrow":"WEBSITE TERMS"}', 'Terms & conditions', 'This website describes our services and provides general information. Project scope, fees, delivery schedules, intellectual property, and support are agreed in a separate written agreement.', '', '', '', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970', '2026-10-05 03:18:31.970');
INSERT INTO `seo_metadata` (`id`, `path`, `title`, `description`, `keywords`) VALUES ('0c2ae84672124e90bf723185711dc9be', '/about', 'A technology partner for your next chapter.', 'We believe good technology should make business simpler. KodeaTech combines thoughtful software engineering with practical infrastructure expertise to help teams build, connect, and grow.', '');
INSERT INTO `seo_metadata` (`id`, `path`, `title`, `description`, `keywords`) VALUES ('d15737c1efda4d30802746bc9e4974f2', '/services', 'Expertise that brings your ideas to life.', 'From digital products to the infrastructure behind them, we connect the expertise you need to move forward.', '');
INSERT INTO `seo_metadata` (`id`, `path`, `title`, `description`, `keywords`) VALUES ('037715a3869e49ce9334c05a1df816e1', '/solutions', 'Connected solutions. Real possibilities.', 'Technology works best when it fits your business. Explore practical solutions for your next challenge.', '');
INSERT INTO `seo_metadata` (`id`, `path`, `title`, `description`, `keywords`) VALUES ('ab846b89c5ea4ac1ae1e4d639e9cfbb9', '/portfolio', 'Good ideas, thoughtfully engineered.', 'Explore our approach to digital products, business systems, and reliable infrastructure.', '');
INSERT INTO `seo_metadata` (`id`, `path`, `title`, `description`, `keywords`) VALUES ('f6818200344d440fb035646ec9c5003b', '/blog', 'A little perspective. A lot of possibility.', 'Ideas and practical thinking from the world of software, infrastructure, and digital business.', '');
INSERT INTO `seo_metadata` (`id`, `path`, `title`, `description`, `keywords`) VALUES ('56b1f0517bdc4d28a40d244a8de9cc13', '/testimonials', 'Partnership is at the heart of our work.', 'Clear communication, thoughtful decisions, and a shared commitment to a useful result.', '');
INSERT INTO `seo_metadata` (`id`, `path`, `title`, `description`, `keywords`) VALUES ('ccc86be235d54992aea2a6ade2c89a10', '/partners', 'Better technology, built together.', 'Our ecosystem brings together expertise across software, networks, cloud, and infrastructure.', '');
INSERT INTO `seo_metadata` (`id`, `path`, `title`, `description`, `keywords`) VALUES ('e298b8131f8c4b44b366999f133045f7', '/contact', 'Let''s build something great together.', 'Have an idea, a challenge, or a question? Tell us what you have in mind. We will help you find a practical next step.', '');
INSERT INTO `seo_metadata` (`id`, `path`, `title`, `description`, `keywords`) VALUES ('5645b173f2364ba69bfcb0c53886abc4', '/careers', 'Do meaningful work. Build what matters.', 'We are interested in thoughtful people who care about useful technology. Share your experience and the work you want to do with our team.', '');
INSERT INTO `seo_metadata` (`id`, `path`, `title`, `description`, `keywords`) VALUES ('ce1dafc81c12426db7b5393d168cdbed', '/privacy-policy', 'Privacy policy', 'We collect information you choose to send through our contact form, including your name, contact details, company, and project description. We use it to respond to your inquiry and manage our business communications.', '');
INSERT INTO `seo_metadata` (`id`, `path`, `title`, `description`, `keywords`) VALUES ('604d1c01f285404c90773f54da89c52c', '/terms', 'Terms & conditions', 'This website describes our services and provides general information. Project scope, fees, delivery schedules, intellectual property, and support are agreed in a separate written agreement.', '');
COMMIT;

CREATE TABLE `_prisma_migrations` (id VARCHAR(36) NOT NULL PRIMARY KEY, checksum VARCHAR(64) NOT NULL, finished_at DATETIME(3) NULL, migration_name VARCHAR(255) NOT NULL, logs TEXT NULL, rolled_back_at DATETIME(3) NULL, started_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), applied_steps_count INTEGER UNSIGNED NOT NULL DEFAULT 0) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
INSERT INTO `_prisma_migrations` (id, checksum, finished_at, migration_name, started_at, applied_steps_count) VALUES ('f4df4a8f-a1ab-400e-8dcf-a4c4d574126a', '325e9149a08f6f8890798abbc426e2bf385422eecfd154b68501340d18e86f67', CURRENT_TIMESTAMP(3), '20261005000000_initial', CURRENT_TIMESTAMP(3), 1);
