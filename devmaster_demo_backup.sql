/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.16-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: qlts_dev
-- ------------------------------------------------------
-- Server version	10.11.16-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `approval_delegations`
--

DROP TABLE IF EXISTS `approval_delegations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `approval_delegations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `from_user_id` int(10) unsigned NOT NULL,
  `to_user_id` int(10) unsigned NOT NULL,
  `request_type` varchar(50) DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` text DEFAULT NULL,
  `revoked_at` datetime DEFAULT NULL,
  `revoked_by` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `approval_delegations_revoked_by_foreign` (`revoked_by`),
  KEY `idx_delegations_from_active` (`from_user_id`,`revoked_at`),
  KEY `idx_delegations_to_active` (`to_user_id`,`revoked_at`),
  KEY `idx_delegations_dates` (`start_date`,`end_date`),
  CONSTRAINT `approval_delegations_from_user_id_foreign` FOREIGN KEY (`from_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `approval_delegations_revoked_by_foreign` FOREIGN KEY (`revoked_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `approval_delegations_to_user_id_foreign` FOREIGN KEY (`to_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approval_delegations`
--

LOCK TABLES `approval_delegations` WRITE;
/*!40000 ALTER TABLE `approval_delegations` DISABLE KEYS */;
INSERT INTO `approval_delegations` VALUES
(8,327,328,NULL,'2026-11-04','2026-11-11','Trưởng phòng đi công tác, ủy quyền Phó phòng duyệt phiếu',NULL,NULL,'2026-11-04 11:13:41','2026-11-04 11:13:41');
/*!40000 ALTER TABLE `approval_delegations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_categories`
--

DROP TABLE IF EXISTS `asset_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_categories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(150) NOT NULL,
  `default_depreciation_method` enum('straight_line','declining_balance') NOT NULL DEFAULT 'straight_line',
  `default_life_months` int(11) NOT NULL DEFAULT 60,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `asset_categories_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=167 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_categories`
--

LOCK TABLES `asset_categories` WRITE;
/*!40000 ALTER TABLE `asset_categories` DISABLE KEYS */;
INSERT INTO `asset_categories` VALUES
(160,'MT','Máy tính, Laptop & Server','straight_line',36,1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(161,'TBVP','Thiết bị văn phòng & Ngoại vi','straight_line',48,1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(162,'TBNN','Thiết bị trình chiếu & Nghe nhìn','straight_line',60,1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(163,'NT','Bàn ghế & Nội thất văn phòng','straight_line',60,1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(164,'TBD','Thiết bị điện & Chiếu sáng','straight_line',36,1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(165,'OTO','Phương tiện vận tải công ty','straight_line',120,1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(166,'SOFTWARE','Phần mềm & Bản quyền số','straight_line',36,1,'2026-11-04 11:13:38','2026-11-04 11:13:38');
/*!40000 ALTER TABLE `asset_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_events`
--

DROP TABLE IF EXISTS `asset_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_events` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `asset_id` bigint(20) unsigned NOT NULL,
  `event_type` varchar(50) NOT NULL,
  `from_org_unit_id` int(10) unsigned DEFAULT NULL,
  `to_org_unit_id` int(10) unsigned DEFAULT NULL,
  `from_assignee_id` int(10) unsigned DEFAULT NULL,
  `to_assignee_id` int(10) unsigned DEFAULT NULL,
  `request_id` int(10) unsigned DEFAULT NULL,
  `performed_by` int(10) unsigned NOT NULL,
  `performed_at` datetime NOT NULL DEFAULT current_timestamp(),
  `note` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `asset_events_from_org_unit_id_foreign` (`from_org_unit_id`),
  KEY `asset_events_to_org_unit_id_foreign` (`to_org_unit_id`),
  KEY `asset_events_from_assignee_id_foreign` (`from_assignee_id`),
  KEY `asset_events_to_assignee_id_foreign` (`to_assignee_id`),
  KEY `asset_events_performed_by_foreign` (`performed_by`),
  KEY `idx_asset_events_timeline` (`asset_id`,`performed_at`),
  CONSTRAINT `asset_events_asset_id_foreign` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `asset_events_from_assignee_id_foreign` FOREIGN KEY (`from_assignee_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `asset_events_from_org_unit_id_foreign` FOREIGN KEY (`from_org_unit_id`) REFERENCES `org_units` (`id`) ON DELETE SET NULL,
  CONSTRAINT `asset_events_performed_by_foreign` FOREIGN KEY (`performed_by`) REFERENCES `users` (`id`),
  CONSTRAINT `asset_events_to_assignee_id_foreign` FOREIGN KEY (`to_assignee_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `asset_events_to_org_unit_id_foreign` FOREIGN KEY (`to_org_unit_id`) REFERENCES `org_units` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=715 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_events`
--

LOCK TABLES `asset_events` WRITE;
/*!40000 ALTER TABLE `asset_events` DISABLE KEYS */;
INSERT INTO `asset_events` VALUES
(644,60625,'increase',NULL,228,NULL,324,NULL,319,'2026-11-04 18:13:39','Bộ máy tính cá nhân Trưởng phòng HCNS sử dụng'),
(645,60625,'assign',228,228,NULL,324,NULL,319,'2026-11-04 18:13:39','Bàn giao đưa vào sử dụng cho nhân sự: tp.hcns'),
(646,60626,'increase',NULL,228,NULL,NULL,NULL,319,'2026-11-04 18:13:39','Máy in chung phòng HCNS'),
(647,60627,'increase',NULL,228,NULL,NULL,NULL,319,'2026-11-04 18:13:39','Khai báo hồ sơ tài sản ban đầu'),
(648,60628,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:39','Máy chiếu phòng họp lớn P201'),
(649,60629,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:39','Khai báo hồ sơ tài sản ban đầu'),
(650,60630,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:39','Khai báo hồ sơ tài sản ban đầu'),
(651,60631,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:39','Khai báo hồ sơ tài sản ban đầu'),
(652,60632,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:39','Khai báo hồ sơ tài sản ban đầu'),
(653,60633,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:39','Khai báo hồ sơ tài sản ban đầu'),
(654,60634,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:39','Khai báo hồ sơ tài sản ban đầu'),
(655,60635,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:39','Khai báo hồ sơ tài sản ban đầu'),
(656,60636,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:39','Khai báo hồ sơ tài sản ban đầu'),
(657,60637,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:39','Khai báo hồ sơ tài sản ban đầu'),
(658,60638,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:39','Khai báo hồ sơ tài sản ban đầu'),
(659,60639,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:39','Khai báo hồ sơ tài sản ban đầu'),
(660,60640,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:39','Khai báo hồ sơ tài sản ban đầu'),
(661,60641,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(662,60642,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(663,60643,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(664,60644,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(665,60645,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(666,60646,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(667,60647,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(668,60648,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(669,60649,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(670,60650,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(671,60651,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(672,60652,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(673,60653,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(674,60654,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(675,60655,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(676,60656,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(677,60657,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(678,60658,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(679,60659,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(680,60660,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(681,60661,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(682,60662,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(683,60663,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(684,60664,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(685,60665,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(686,60666,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Máy tính phục vụ dự án thực tập sinh số #1'),
(687,60667,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Máy tính phục vụ dự án thực tập sinh số #2'),
(688,60668,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Máy tính phục vụ dự án thực tập sinh số #3'),
(689,60669,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Máy tính phục vụ dự án thực tập sinh số #4'),
(690,60670,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Máy tính phục vụ dự án thực tập sinh số #5'),
(691,60671,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Máy tính phục vụ dự án thực tập sinh số #6'),
(692,60672,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Máy tính phục vụ dự án thực tập sinh số #7'),
(693,60673,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Máy tính phục vụ dự án thực tập sinh số #8'),
(694,60674,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Máy tính phục vụ dự án thực tập sinh số #9'),
(695,60675,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Máy tính phục vụ dự án thực tập sinh số #10'),
(696,60676,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(697,60677,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(698,60678,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(699,60679,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(700,60680,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(701,60681,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(702,60682,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(703,60683,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(704,60684,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(705,60685,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(706,60686,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Tivi màn hình lớn phòng Internship P202'),
(707,60687,'increase',NULL,231,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Máy chủ vận hành hệ thống Devmaster'),
(708,60688,'increase',NULL,231,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(709,60689,'increase',NULL,226,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Xe công tác phục vụ Ban Giám đốc'),
(710,60690,'increase',NULL,229,NULL,NULL,NULL,319,'2026-11-04 18:13:40','Khai báo hồ sơ tài sản ban đầu'),
(711,60691,'increase',NULL,229,NULL,NULL,NULL,319,'2026-11-04 18:13:41','Khai báo hồ sơ tài sản ban đầu'),
(712,60692,'increase',NULL,229,NULL,NULL,NULL,319,'2026-11-04 18:13:41','Khai báo hồ sơ tài sản ban đầu'),
(713,60693,'increase',NULL,229,NULL,NULL,NULL,319,'2026-11-04 18:13:41','Khai báo hồ sơ tài sản ban đầu'),
(714,60694,'increase',NULL,229,NULL,NULL,NULL,319,'2026-11-04 18:13:41','Khai báo hồ sơ tài sản ban đầu');
/*!40000 ALTER TABLE `asset_events` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_asset_events_no_update
    BEFORE UPDATE ON asset_events
    FOR EACH ROW
    BEGIN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Bảng asset_events là append-only, cấm thao tác UPDATE';
    END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_asset_events_no_delete
    BEFORE DELETE ON asset_events
    FOR EACH ROW
    BEGIN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Bảng asset_events là append-only, cấm thao tác DELETE';
    END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `asset_files`
--

DROP TABLE IF EXISTS `asset_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_files` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `asset_id` bigint(20) unsigned NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `stored_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_type` varchar(50) NOT NULL DEFAULT 'OTHER',
  `mime_type` varchar(120) NOT NULL,
  `file_size` int(10) unsigned NOT NULL,
  `uploaded_by` int(10) unsigned NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `deleted_by` int(10) unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_asset_files_stored_name` (`stored_name`),
  KEY `asset_files_uploaded_by_foreign` (`uploaded_by`),
  KEY `asset_files_deleted_by_foreign` (`deleted_by`),
  KEY `idx_asset_files_asset_active` (`asset_id`,`deleted_at`),
  CONSTRAINT `asset_files_asset_id_foreign` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `asset_files_deleted_by_foreign` FOREIGN KEY (`deleted_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `asset_files_uploaded_by_foreign` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_files`
--

LOCK TABLES `asset_files` WRITE;
/*!40000 ALTER TABLE `asset_files` DISABLE KEYS */;
/*!40000 ALTER TABLE `asset_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_upgrades`
--

DROP TABLE IF EXISTS `asset_upgrades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_upgrades` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `asset_id` bigint(20) unsigned NOT NULL,
  `from_period` varchar(7) NOT NULL,
  `added_cost` decimal(18,2) NOT NULL,
  `new_original_cost` decimal(18,2) NOT NULL,
  `remaining_months` int(10) unsigned NOT NULL,
  `notes` text DEFAULT NULL,
  `created_by` int(10) unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `asset_upgrades_created_by_foreign` (`created_by`),
  KEY `idx_asset_upgrades_asset_period` (`asset_id`,`from_period`),
  CONSTRAINT `asset_upgrades_asset_id_foreign` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `asset_upgrades_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_upgrades`
--

LOCK TABLES `asset_upgrades` WRITE;
/*!40000 ALTER TABLE `asset_upgrades` DISABLE KEYS */;
/*!40000 ALTER TABLE `asset_upgrades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assets`
--

DROP TABLE IF EXISTS `assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `assets` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `qr_token` varchar(64) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category_id` int(10) unsigned NOT NULL,
  `serial_no` varchar(100) DEFAULT NULL,
  `purchase_date` date NOT NULL,
  `original_cost` decimal(18,2) NOT NULL,
  `residual_value` decimal(18,2) NOT NULL DEFAULT 0.00,
  `depreciable` tinyint(1) NOT NULL DEFAULT 1,
  `depreciation_method` varchar(50) NOT NULL DEFAULT 'STRAIGHT_LINE',
  `useful_life_months` int(10) unsigned NOT NULL DEFAULT 36,
  `depreciation_start` varchar(7) DEFAULT NULL,
  `opening_accumulated` decimal(18,2) NOT NULL DEFAULT 0.00,
  `status` enum('in_stock','in_use','transferring','maintenance','disposing','disposed','lost') NOT NULL DEFAULT 'in_stock',
  `exit_reason` varchar(255) DEFAULT NULL,
  `org_unit_id` int(10) unsigned NOT NULL,
  `location_id` int(10) unsigned DEFAULT NULL,
  `assignee_id` int(10) unsigned DEFAULT NULL,
  `supplier_id` int(10) unsigned DEFAULT NULL,
  `active_request_id` int(10) unsigned DEFAULT NULL,
  `locked_stocktake_id` int(10) unsigned DEFAULT NULL,
  `version` int(10) unsigned NOT NULL DEFAULT 1,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `disposal_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_assets_code` (`code`),
  UNIQUE KEY `idx_assets_qr_token` (`qr_token`),
  KEY `assets_location_id_foreign` (`location_id`),
  KEY `assets_assignee_id_foreign` (`assignee_id`),
  KEY `assets_supplier_id_foreign` (`supplier_id`),
  KEY `idx_assets_org_status` (`org_unit_id`,`status`),
  KEY `idx_assets_category` (`category_id`),
  KEY `idx_assets_purchase_date` (`purchase_date`),
  KEY `idx_assets_deleted_at` (`deleted_at`),
  CONSTRAINT `assets_assignee_id_foreign` FOREIGN KEY (`assignee_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `assets_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `asset_categories` (`id`),
  CONSTRAINT `assets_location_id_foreign` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL,
  CONSTRAINT `assets_org_unit_id_foreign` FOREIGN KEY (`org_unit_id`) REFERENCES `org_units` (`id`),
  CONSTRAINT `assets_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=60695 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assets`
--

LOCK TABLES `assets` WRITE;
/*!40000 ALTER TABLE `assets` DISABLE KEYS */;
INSERT INTO `assets` VALUES
(60625,'TS-2026-00001','9ff79667973264e9af08385ad82cbe4b4203f301dd840704ae74b46570d56143','Bộ máy tính để bàn Dell OptiPlex 7010',160,NULL,'2025-01-15',18500000.00,0.00,1,'straight_line',36,NULL,0.00,'in_use',NULL,228,220,324,106,NULL,NULL,1,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39',NULL),
(60626,'TS-2026-00002','403ad7f1ce30b8e73722b2528f288d2a836e075e51df10c685c7ee3a85fb32f9','Máy in đa năng HP LaserJet Pro MFP M428fdw',161,NULL,'2025-01-15',12500000.00,0.00,1,'straight_line',36,NULL,0.00,'in_use',NULL,228,220,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39',NULL),
(60627,'TS-2026-00003','918f53e4be93525d43be3ce27a633f6f106ae469a85809e76ffd733f4f2dfe00','Bàn làm việc giám đốc gỗ sồi P102',163,NULL,'2025-01-15',6500000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,228,220,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39',NULL),
(60628,'TS-2026-00004','ac5581a3ac76d64b7f70ecd1d1099dc52e48080f25913edb471beab48fe93214','Máy chiếu độ nét cao Epson EB-2250U Full HD',162,NULL,'2025-01-15',32000000.00,0.00,1,'straight_line',36,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39',NULL),
(60629,'TS-2026-00005','b0487e8926d75485569846e7ca934f9792751249a3ff9b6284396d6a375bc1cc','Bộ máy tính trình chiếu phòng họp lớn P201',160,NULL,'2025-01-15',15500000.00,0.00,1,'straight_line',36,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39',NULL),
(60630,'TS-2026-00006','275753d0a6d0861842b12e91ff9f3ff5370fcdd4d3afff40268d844a91469197','Bàn họp lớn 24 chỗ gỗ công nghiệp cao cấp',163,NULL,'2025-01-15',28000000.00,0.00,1,'straight_line',36,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39',NULL),
(60631,'TS-2026-00007','6f1621b491c90c84a231591dd159b831cb67f722bcd18b464f0a2784ebc9ed0f','Ghế chân quỳ phòng họp bọc da cao cấp Hòa Phát #1',163,NULL,'2025-01-15',1250000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39',NULL),
(60632,'TS-2026-00008','3f87a756af0e9b166a1f4a0cb817f8ff3ca4cb60794584fa9568221bbbe6be2c','Ghế chân quỳ phòng họp bọc da cao cấp Hòa Phát #2',163,NULL,'2025-01-15',1250000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39',NULL),
(60633,'TS-2026-00009','a97b1fd84413e7c2a12e9be913631bce878e1411a6e9302b1dbc7e8f652e218c','Ghế chân quỳ phòng họp bọc da cao cấp Hòa Phát #3',163,NULL,'2025-01-15',1250000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39',NULL),
(60634,'TS-2026-00010','a523d4c72987c9baca5e1b141079e41c7be31f5f17c074f7e556faa9cb168ece','Ghế chân quỳ phòng họp bọc da cao cấp Hòa Phát #4',163,NULL,'2025-01-15',1250000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39',NULL),
(60635,'TS-2026-00011','370f8f305fdff38c928dea7f1a1f02108430b68c1dc85c74fb6474adaccd42ed','Ghế chân quỳ phòng họp bọc da cao cấp Hòa Phát #5',163,NULL,'2025-01-15',1250000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39',NULL),
(60636,'TS-2026-00012','f45d8b36f9ce6a7ceb1b4a0897602e53445817a52b8a06a31cfc37134ad2ca7b','Ghế chân quỳ phòng họp bọc da cao cấp Hòa Phát #6',163,NULL,'2025-01-15',1250000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39',NULL),
(60637,'TS-2026-00013','d5cebe03eaa66fcbf7c282d9b2d11fe6da1f48e0a525fa715eb43d9bdb4a13c0','Ghế chân quỳ phòng họp bọc da cao cấp Hòa Phát #7',163,NULL,'2025-01-15',1250000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39',NULL),
(60638,'TS-2026-00014','2e08d1cb04ffd1a889a2978ce358ec697ef9b222956f36cf9045866cb7829fcd','Ghế chân quỳ phòng họp bọc da cao cấp Hòa Phát #8',163,NULL,'2025-01-15',1250000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39',NULL),
(60639,'TS-2026-00015','97d02a199ad4098f85b8459531e3666cc7036e1b59fe950afce0cab3f4753dec','Ghế chân quỳ phòng họp bọc da cao cấp Hòa Phát #9',163,NULL,'2025-01-15',1250000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39',NULL),
(60640,'TS-2026-00016','02ff5fd5888b2f500140975da311af74b25a81c67d1e0c1c9f09e59a7fd65abf','Ghế chân quỳ phòng họp bọc da cao cấp Hòa Phát #10',163,NULL,'2025-01-15',1250000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39',NULL),
(60641,'TS-2026-00017','ba24ea2228c4c3aa31b3ff5eb14320b8645c81ff8162c1c45efb7cb10038a47f','Ghế chân quỳ phòng họp bọc da cao cấp Hòa Phát #11',163,NULL,'2025-01-15',1250000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60642,'TS-2026-00018','2fcc412841139fb1f9935f2f3b51af63925941c681597a861826db1e1cfb9cfe','Ghế chân quỳ phòng họp bọc da cao cấp Hòa Phát #12',163,NULL,'2025-01-15',1250000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60643,'TS-2026-00019','7aede0fc59e0b201e6cb15a04099e1f2efa86a8be701b7fd7676c869341c01b9','Ghế chân quỳ phòng họp bọc da cao cấp Hòa Phát #13',163,NULL,'2025-01-15',1250000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60644,'TS-2026-00020','e359a0fd9a4b4ee6ca162eb08f8f099d84b86f5bd0bb385f17316999ea167b58','Ghế chân quỳ phòng họp bọc da cao cấp Hòa Phát #14',163,NULL,'2025-01-15',1250000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60645,'TS-2026-00021','d7ce7e92c938f8a6a29df24e746ffb2e895cb84aeb7539f010720fc90b933ccd','Ghế chân quỳ phòng họp bọc da cao cấp Hòa Phát #15',163,NULL,'2025-01-15',1250000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60646,'TS-2026-00022','9b9b2a1f837705b46c0a13cb620c0bd1d3435b86a5ec562852ea9f5162f7a3c8','Ghế chân quỳ phòng họp bọc da cao cấp Hòa Phát #16',163,NULL,'2025-01-15',1250000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60647,'TS-2026-00023','482a67533a158dd5d11ba25e9f35bc42f0cc5ddd29545552a7af19beae48ded2','Ghế chân quỳ phòng họp bọc da cao cấp Hòa Phát #17',163,NULL,'2025-01-15',1250000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60648,'TS-2026-00024','82713c63a70e619003500cd76141196b591dfa7473e4de509a3fca7c67a4505b','Ghế chân quỳ phòng họp bọc da cao cấp Hòa Phát #18',163,NULL,'2025-01-15',1250000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60649,'TS-2026-00025','4cc4ab6fc34a70f776f7157bb3a6d59d2b9000d12d0f2d3dde4c6523f2a08b4c','Ghế chân quỳ phòng họp bọc da cao cấp Hòa Phát #19',163,NULL,'2025-01-15',1250000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60650,'TS-2026-00026','2213a4b29e68497cbc2fe7093d2d8e915cd8b3f12c7f6f93160c7c2e98dccd4f','Ghế chân quỳ phòng họp bọc da cao cấp Hòa Phát #20',163,NULL,'2025-01-15',1250000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60651,'TS-2026-00027','1a0fc693818876efbc239944a8b0f1ff5237a0700837981766b99ed85071dc59','Ghế chân quỳ phòng họp bọc da cao cấp Hòa Phát #21',163,NULL,'2025-01-15',1250000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60652,'TS-2026-00028','a77f0587647ae6b02ff0cdcb84ee45e8a8c1094c75989c15db7506e8d2d41217','Ghế chân quỳ phòng họp bọc da cao cấp Hòa Phát #22',163,NULL,'2025-01-15',1250000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60653,'TS-2026-00029','a6bcb4cd499be3f1f5abe71589e15ccbc89a16bcc30e7c4214b423d9bff586a1','Ghế chân quỳ phòng họp bọc da cao cấp Hòa Phát #23',163,NULL,'2025-01-15',1250000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60654,'TS-2026-00030','fe701a4503c067088e4815c04a4f2d3894d0defa9a833a7bb955b683d1855d10','Ghế chân quỳ phòng họp bọc da cao cấp Hòa Phát #24',163,NULL,'2025-01-15',1250000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60655,'TS-2026-00031','66ea5fd277ec2a7ce0541e0b528acc5b2baab6e26659cb32f82604080e0ae205','Ghế chân quỳ phòng họp bọc da cao cấp Hòa Phát #25',163,NULL,'2025-01-15',1250000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60656,'TS-2026-00032','d714a401126d98a17f9d7a4714894832eb62f8a12889d80b0952f7eae1ef64e7','Bóng đèn LED Panel Rạng Đông 60x60 P201 #1',164,NULL,'2025-01-15',450000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60657,'TS-2026-00033','a1d8ada1cfdb25edcf747403c12c3ce41f46e7a1f88896c296c422e5620bb864','Bóng đèn LED Panel Rạng Đông 60x60 P201 #2',164,NULL,'2025-01-15',450000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60658,'TS-2026-00034','6570b720feb6e47cc5c6352a4d860cf20a3fdaa553c118b16f7e525c6f3bda0e','Bóng đèn LED Panel Rạng Đông 60x60 P201 #3',164,NULL,'2025-01-15',450000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60659,'TS-2026-00035','b5e208f2adb66046e479f181104464deb5b44e281ae9befd1edc9ad6e7e1a763','Bóng đèn LED Panel Rạng Đông 60x60 P201 #4',164,NULL,'2025-01-15',450000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60660,'TS-2026-00036','bf24276fc492d329f9722674dbc0f0abe2cd22fde325777b45e3c69c38120d7a','Bóng đèn LED Panel Rạng Đông 60x60 P201 #5',164,NULL,'2025-01-15',450000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60661,'TS-2026-00037','e5223df8759082e2dfa975cc3995f4712c25ae5bb748e86d9d392de78e7a1c87','Bóng đèn LED Panel Rạng Đông 60x60 P201 #6',164,NULL,'2025-01-15',450000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60662,'TS-2026-00038','96fac2d667b3f27ae9b5f835ac45208a33967e70c9b101897b74f272dc17f70b','Bóng đèn LED Panel Rạng Đông 60x60 P201 #7',164,NULL,'2025-01-15',450000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60663,'TS-2026-00039','d2cfefbf997a346f4e0795577177b69fb9e5564814e9fa3bbea609ba8615505a','Bóng đèn LED Panel Rạng Đông 60x60 P201 #8',164,NULL,'2025-01-15',450000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60664,'TS-2026-00040','785df95e678c73608f0ba05287571f73faecd8cc7b3c618923134f1d90f1a337','Bóng đèn LED Panel Rạng Đông 60x60 P201 #9',164,NULL,'2025-01-15',450000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60665,'TS-2026-00041','490945949f4a1cf945d027969ffa460ff58baf3d4fda4378a33ea4ecec402ea7','Bóng đèn LED Panel Rạng Đông 60x60 P201 #10',164,NULL,'2025-01-15',450000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,223,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60666,'TS-2026-00042','aba649c6556128777acb0878ee9b82a1a66b0316a2a5d2de11aecef4dc5d176d','Laptop Dell Latitude 5440 Core i7 / 16GB RAM #1',160,NULL,'2025-01-15',21500000.00,0.00,1,'straight_line',36,NULL,0.00,'in_use',NULL,226,224,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60667,'TS-2026-00043','0b715e926ba7e0cb3f4ce87a2a48ce0fd3733563209152633ac79a20dce378d6','Laptop Dell Latitude 5440 Core i7 / 16GB RAM #2',160,NULL,'2025-01-15',21500000.00,0.00,1,'straight_line',36,NULL,0.00,'in_use',NULL,226,224,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60668,'TS-2026-00044','60c2f61999eb0df2af5e297c3c09449821f641d1a907442589c4635cc4cb2201','Laptop Dell Latitude 5440 Core i7 / 16GB RAM #3',160,NULL,'2025-01-15',21500000.00,0.00,1,'straight_line',36,NULL,0.00,'in_use',NULL,226,224,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60669,'TS-2026-00045','d6aeba4cc4eed500958bf61383bb6b1c3677af66cceaed50903267fd50119753','Laptop Dell Latitude 5440 Core i7 / 16GB RAM #4',160,NULL,'2025-01-15',21500000.00,0.00,1,'straight_line',36,NULL,0.00,'in_use',NULL,226,224,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60670,'TS-2026-00046','6c8eb82af53b0b5cce3f20f984e83dae0bcb0a24518b4d9f87ada130ff0c606e','Laptop Dell Latitude 5440 Core i7 / 16GB RAM #5',160,NULL,'2025-01-15',21500000.00,0.00,1,'straight_line',36,NULL,0.00,'in_use',NULL,226,224,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60671,'TS-2026-00047','4ce293f38845389ad01c5892307401b7c99d7299a2f0966d0f94d4f710dc341a','Laptop Dell Latitude 5440 Core i7 / 16GB RAM #6',160,NULL,'2025-01-15',21500000.00,0.00,1,'straight_line',36,NULL,0.00,'in_use',NULL,226,224,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60672,'TS-2026-00048','c984fa678ef232494ddbf04aa8d0842ad5918605474f762921cada56afd7d32d','Laptop Dell Latitude 5440 Core i7 / 16GB RAM #7',160,NULL,'2025-01-15',21500000.00,0.00,1,'straight_line',36,NULL,0.00,'in_use',NULL,226,224,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60673,'TS-2026-00049','e400082bbf2f711071de5173d93b15ebdbc278fa6e072f9273c5d293b2e3cf87','Laptop Dell Latitude 5440 Core i7 / 16GB RAM #8',160,NULL,'2025-01-15',21500000.00,0.00,1,'straight_line',36,NULL,0.00,'in_use',NULL,226,224,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60674,'TS-2026-00050','6dc1741631575db90b9104807d17f776f8f9332f6a47be7caf032fda36a13e55','Laptop Dell Latitude 5440 Core i7 / 16GB RAM #9',160,NULL,'2025-01-15',21500000.00,0.00,1,'straight_line',36,NULL,0.00,'in_use',NULL,226,224,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60675,'TS-2026-00051','0e19a1dff9bb8785fd715692782ad5edb202786de407460d5af88c207530811f','Laptop Dell Latitude 5440 Core i7 / 16GB RAM #10',160,NULL,'2025-01-15',21500000.00,0.00,1,'straight_line',36,NULL,0.00,'in_use',NULL,226,224,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60676,'TS-2026-00052','809f877785b50a5a4c12ae4dacd942abfa80cefda13e1060d14c296cec00fb2c','Bộ bàn ghế làm việc modul chuyên dụng #1',163,NULL,'2025-01-15',3200000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,224,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60677,'TS-2026-00053','0bb82a509264f0f74989d09a83c9996eb32f1ee6c11b047283ffb023c896bbb7','Bộ bàn ghế làm việc modul chuyên dụng #2',163,NULL,'2025-01-15',3200000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,224,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60678,'TS-2026-00054','8cff8c278912778dc2b43afa03b3dda866b30a601e20da61309f91b6cbe01eb0','Bộ bàn ghế làm việc modul chuyên dụng #3',163,NULL,'2025-01-15',3200000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,224,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60679,'TS-2026-00055','a17d67a02054bfe2a23eca5a4e6a85b68be3c6236b288ec5f6f8d166ef6fcd5c','Bộ bàn ghế làm việc modul chuyên dụng #4',163,NULL,'2025-01-15',3200000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,224,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60680,'TS-2026-00056','1368b35bd95d475d79704896274101b07de756891d8181b3d5d1199ddd09d1f7','Bộ bàn ghế làm việc modul chuyên dụng #5',163,NULL,'2025-01-15',3200000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,224,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60681,'TS-2026-00057','4e80bc8abbd2abf7451f4bea7287ddc101d78ed02fec536ec84ad08c6d62aceb','Bộ bàn ghế làm việc modul chuyên dụng #6',163,NULL,'2025-01-15',3200000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,224,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60682,'TS-2026-00058','55c0aefea35f0d2e2eb79afeb8333b3549a00a12a1d76842c11003c57c1241f6','Bộ bàn ghế làm việc modul chuyên dụng #7',163,NULL,'2025-01-15',3200000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,224,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60683,'TS-2026-00059','8d2c50e0440468fb264d9fa9bd1b1654c1ea26096a29e60dd3f82bd7c5bfb491','Bộ bàn ghế làm việc modul chuyên dụng #8',163,NULL,'2025-01-15',3200000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,224,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60684,'TS-2026-00060','91a4f89238f0d4f40b24e7679c861f656d5c481f4aab81d2d1d8933dd2a441e0','Bộ bàn ghế làm việc modul chuyên dụng #9',163,NULL,'2025-01-15',3200000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,224,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60685,'TS-2026-00061','a0d24ec20e8808d314af6eaf6be4af0250f1e7e0c465ffd407b58796476320fc','Bộ bàn ghế làm việc modul chuyên dụng #10',163,NULL,'2025-01-15',3200000.00,0.00,0,'straight_line',0,NULL,0.00,'in_use',NULL,226,224,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60686,'TS-2026-00062','165d61f92fa72f2fc18b5f5be5a4f120ccd22f5dcaabb77fb2da72c2a52a47e8','Tivi thông minh Sony Bravia 85 inch 4K HDR',162,NULL,'2025-01-15',48900000.00,0.00,1,'straight_line',36,NULL,0.00,'in_use',NULL,226,224,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60687,'TS-2026-00063','1b76bd921c56a6e1ce4b72a59a283104fd05a294a72da3bb9ec9db66a9ca2899','Máy chủ Server Dell PowerEdge R750xs Rack 2U',160,NULL,'2025-01-15',115000000.00,0.00,1,'straight_line',36,NULL,0.00,'in_use',NULL,231,233,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60688,'TS-2026-00064','fb3f2325bce98884701fb8189f1cd57ab8eeb9cfbf87a10bee891428e4424acf','Bộ lưu điện thông minh APC Smart-UPS RT 5000VA',161,NULL,'2025-01-15',45000000.00,0.00,1,'straight_line',36,NULL,0.00,'in_use',NULL,231,233,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60689,'TS-2026-00065','1e4cbd3c94aac7da2df0dc0275cbd2444a28238509b87bf1f9ea32454eed89bb','Xe ô tô Toyota Fortuner 2.7V 4x2 AT công ty',165,NULL,'2025-01-15',1050000000.00,0.00,1,'straight_line',36,NULL,0.00,'in_use',NULL,226,219,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60690,'TS-2026-00066','627002b87a8c078f6486d314b17f1d948f69b16d5de09bae7bf3e8ce25b9d1ed','Màn hình máy tính Dell UltraSharp 24 inch U2422H trong kho #1',160,NULL,'2025-01-15',6200000.00,0.00,0,'straight_line',0,NULL,0.00,'in_stock',NULL,229,219,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:40','2026-11-04 11:13:40',NULL),
(60691,'TS-2026-00067','4385825208427234a6c69391ae5e1baa413ca5c00f541d33d75f5b049a27d4d7','Màn hình máy tính Dell UltraSharp 24 inch U2422H trong kho #2',160,NULL,'2025-01-15',6200000.00,0.00,0,'straight_line',0,NULL,0.00,'in_stock',NULL,229,219,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:41','2026-11-04 11:13:41',NULL),
(60692,'TS-2026-00068','99e2bda059a133648f9fc8d3bd9214b4ec7d9fbf4e28b788315869c6a7680f15','Màn hình máy tính Dell UltraSharp 24 inch U2422H trong kho #3',160,NULL,'2025-01-15',6200000.00,0.00,0,'straight_line',0,NULL,0.00,'in_stock',NULL,229,219,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:41','2026-11-04 11:13:41',NULL),
(60693,'TS-2026-00069','2043a30cfd68707dcdee30201324bb60b60e68e2ae42bc0084077f218f5e2fcf','Màn hình máy tính Dell UltraSharp 24 inch U2422H trong kho #4',160,NULL,'2025-01-15',6200000.00,0.00,0,'straight_line',0,NULL,0.00,'in_stock',NULL,229,219,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:41','2026-11-04 11:13:41',NULL),
(60694,'TS-2026-00070','38a061286f0067836ea9d634cf54bc799a2a116150cb73f47b6fb7452eafaaea','Màn hình máy tính Dell UltraSharp 24 inch U2422H trong kho #5',160,NULL,'2025-01-15',6200000.00,0.00,0,'straight_line',0,NULL,0.00,'in_stock',NULL,229,219,NULL,106,NULL,NULL,1,NULL,'2026-11-04 11:13:41','2026-11-04 11:13:41',NULL);
/*!40000 ALTER TABLE `assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `actor_id` int(10) unsigned DEFAULT NULL,
  `action` varchar(50) NOT NULL,
  `entity` varchar(50) NOT NULL,
  `entity_id` varchar(50) NOT NULL,
  `before` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`before`)),
  `after` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`after`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `performed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `audit_logs_performed_at_index` (`performed_at`),
  KEY `audit_logs_actor_id_performed_at_index` (`actor_id`,`performed_at`),
  KEY `audit_logs_entity_entity_id_index` (`entity`,`entity_id`),
  CONSTRAINT `audit_logs_actor_id_foreign` FOREIGN KEY (`actor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=696 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_audit_logs_no_update
    BEFORE UPDATE ON audit_logs
    FOR EACH ROW
    BEGIN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Bảng audit_logs là append-only, cấm thao tác UPDATE';
    END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_audit_logs_no_delete
    BEFORE DELETE ON audit_logs
    FOR EACH ROW
    BEGIN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Bảng audit_logs là append-only, cấm thao tác DELETE';
    END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `catalog_items`
--

DROP TABLE IF EXISTS `catalog_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalog_items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` enum('UNIT','CONDITION') NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `catalog_items_type_code_unique` (`type`,`code`)
) ENGINE=InnoDB AUTO_INCREMENT=245 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalog_items`
--

LOCK TABLES `catalog_items` WRITE;
/*!40000 ALTER TABLE `catalog_items` DISABLE KEYS */;
INSERT INTO `catalog_items` VALUES
(236,'UNIT','CAI','Cái',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(237,'UNIT','CHIEC','Chiếc',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(238,'UNIT','BO','Bộ',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(239,'UNIT','DAN','Dàn',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(240,'CONDITION','NEW','Mới 100%',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(241,'CONDITION','GOOD','Đang hoạt động tốt',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(242,'CONDITION','NEED_MAINTENANCE','Cần bảo dưỡng, sửa chữa',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(243,'CONDITION','BROKEN','Hỏng hóc sự cố',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(244,'CONDITION','DISPOSAL_PENDING','Chờ thanh lý',1,'2026-11-04 11:13:38','2026-11-04 11:13:38');
/*!40000 ALTER TABLE `catalog_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `code_counters`
--

DROP TABLE IF EXISTS `code_counters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `code_counters` (
  `key` varchar(50) NOT NULL,
  `last_value` bigint(20) unsigned NOT NULL DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `code_counters`
--

LOCK TABLES `code_counters` WRITE;
/*!40000 ALTER TABLE `code_counters` DISABLE KEYS */;
INSERT INTO `code_counters` VALUES
('ASSET_2026',71,'2026-11-04 11:13:41');
/*!40000 ALTER TABLE `code_counters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `depreciation_entries`
--

DROP TABLE IF EXISTS `depreciation_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `depreciation_entries` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `run_id` int(10) unsigned NOT NULL,
  `asset_id` bigint(20) unsigned NOT NULL,
  `period` varchar(7) NOT NULL,
  `org_unit_id` int(10) unsigned NOT NULL,
  `category_id` int(10) unsigned NOT NULL,
  `amount` decimal(18,2) NOT NULL,
  `accumulated` decimal(18,2) NOT NULL,
  `book_value_after` decimal(18,2) NOT NULL,
  `entry_type` enum('run','adjustment') NOT NULL DEFAULT 'run',
  `adjust_seq` int(10) unsigned NOT NULL DEFAULT 0,
  `reason` text DEFAULT NULL,
  `created_by` int(10) unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_asset_period_entry` (`asset_id`,`period`,`entry_type`,`adjust_seq`),
  KEY `depreciation_entries_run_id_foreign` (`run_id`),
  KEY `depreciation_entries_org_unit_id_foreign` (`org_unit_id`),
  KEY `depreciation_entries_category_id_foreign` (`category_id`),
  KEY `depreciation_entries_created_by_foreign` (`created_by`),
  KEY `idx_depr_period_unit` (`period`,`org_unit_id`),
  KEY `idx_depr_period_category` (`period`,`category_id`),
  KEY `idx_depr_asset_period` (`asset_id`,`period`),
  CONSTRAINT `depreciation_entries_asset_id_foreign` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`),
  CONSTRAINT `depreciation_entries_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `asset_categories` (`id`),
  CONSTRAINT `depreciation_entries_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `depreciation_entries_org_unit_id_foreign` FOREIGN KEY (`org_unit_id`) REFERENCES `org_units` (`id`),
  CONSTRAINT `depreciation_entries_run_id_foreign` FOREIGN KEY (`run_id`) REFERENCES `depreciation_runs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49115 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `depreciation_entries`
--

LOCK TABLES `depreciation_entries` WRITE;
/*!40000 ALTER TABLE `depreciation_entries` DISABLE KEYS */;
/*!40000 ALTER TABLE `depreciation_entries` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_depreciation_entries_no_update_locked
    BEFORE UPDATE ON depreciation_entries
    FOR EACH ROW
    BEGIN
      DECLARE v_status VARCHAR(20);
      SELECT status INTO v_status FROM depreciation_runs WHERE id = OLD.run_id;
      IF v_status = 'locked' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Kỳ khấu hao đã chốt (locked), cấm thao tác UPDATE dòng bút toán khấu hao (TC-04)';
      END IF;
    END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_depreciation_entries_no_delete_locked
    BEFORE DELETE ON depreciation_entries
    FOR EACH ROW
    BEGIN
      DECLARE v_status VARCHAR(20);
      SELECT status INTO v_status FROM depreciation_runs WHERE id = OLD.run_id;
      IF v_status = 'locked' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Kỳ khấu hao đã chốt (locked), cấm thao tác DELETE dòng bút toán khấu hao (TC-04)';
      END IF;
    END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `depreciation_runs`
--

DROP TABLE IF EXISTS `depreciation_runs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `depreciation_runs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `period` varchar(7) NOT NULL,
  `scope_org_unit_id` int(10) unsigned DEFAULT NULL,
  `status` enum('draft','running','failed','locked') NOT NULL DEFAULT 'draft',
  `started_at` datetime DEFAULT NULL,
  `finished_at` datetime DEFAULT NULL,
  `locked_at` datetime DEFAULT NULL,
  `locked_by` int(10) unsigned DEFAULT NULL,
  `row_count` int(10) unsigned NOT NULL DEFAULT 0,
  `total_depreciation_amount` decimal(18,2) NOT NULL DEFAULT 0.00,
  `missing_params_count` int(10) unsigned NOT NULL DEFAULT 0,
  `missing_params_assets` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`missing_params_assets`)),
  `error_message` text DEFAULT NULL,
  `created_by` int(10) unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `scope_key` int(10) unsigned GENERATED ALWAYS AS (ifnull(`scope_org_unit_id`,0)) STORED,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_depr_period_scope` (`period`,`scope_key`),
  KEY `depreciation_runs_scope_org_unit_id_foreign` (`scope_org_unit_id`),
  KEY `depreciation_runs_locked_by_foreign` (`locked_by`),
  KEY `depreciation_runs_created_by_foreign` (`created_by`),
  KEY `idx_depr_runs_period_status` (`period`,`status`),
  CONSTRAINT `depreciation_runs_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `depreciation_runs_locked_by_foreign` FOREIGN KEY (`locked_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `depreciation_runs_scope_org_unit_id_foreign` FOREIGN KEY (`scope_org_unit_id`) REFERENCES `org_units` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `depreciation_runs`
--

LOCK TABLES `depreciation_runs` WRITE;
/*!40000 ALTER TABLE `depreciation_runs` DISABLE KEYS */;
/*!40000 ALTER TABLE `depreciation_runs` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_depreciation_runs_no_update_locked
    BEFORE UPDATE ON depreciation_runs
    FOR EACH ROW
    BEGIN
      IF OLD.status = 'locked' AND NEW.status = 'locked' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Kỳ khấu hao đã chốt (locked), không thể sửa đổi trực tiếp dữ liệu kỳ đã chốt (TC-04)';
      END IF;
    END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_depreciation_runs_no_delete_locked
    BEFORE DELETE ON depreciation_runs
    FOR EACH ROW
    BEGIN
      IF OLD.status = 'locked' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Kỳ khấu hao đã chốt (locked), cấm thao tác DELETE đợt chạy khấu hao (TC-04)';
      END IF;
    END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `import_errors`
--

DROP TABLE IF EXISTS `import_errors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `import_errors` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `job_id` bigint(20) unsigned NOT NULL,
  `row_number` int(10) unsigned NOT NULL,
  `field_name` varchar(100) DEFAULT NULL,
  `raw_value` text DEFAULT NULL,
  `error_message` varchar(500) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_import_errors_job_row` (`job_id`,`row_number`),
  CONSTRAINT `import_errors_job_id_foreign` FOREIGN KEY (`job_id`) REFERENCES `import_jobs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `import_errors`
--

LOCK TABLES `import_errors` WRITE;
/*!40000 ALTER TABLE `import_errors` DISABLE KEYS */;
/*!40000 ALTER TABLE `import_errors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `import_jobs`
--

DROP TABLE IF EXISTS `import_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `import_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `job_type` enum('ASSET_IMPORT','OPENING_BALANCE') NOT NULL DEFAULT 'ASSET_IMPORT',
  `file_name` varchar(255) NOT NULL,
  `status` enum('dry_run','completed','partial','failed') NOT NULL DEFAULT 'dry_run',
  `total_rows` int(10) unsigned NOT NULL DEFAULT 0,
  `valid_rows` int(10) unsigned NOT NULL DEFAULT 0,
  `imported_rows` int(10) unsigned NOT NULL DEFAULT 0,
  `error_rows` int(10) unsigned NOT NULL DEFAULT 0,
  `created_by` int(10) unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `import_jobs_created_by_foreign` (`created_by`),
  KEY `idx_import_jobs_type_date` (`job_type`,`created_at`),
  CONSTRAINT `import_jobs_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `import_jobs`
--

LOCK TABLES `import_jobs` WRITE;
/*!40000 ALTER TABLE `import_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `import_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invalidated_qr_tokens`
--

DROP TABLE IF EXISTS `invalidated_qr_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `invalidated_qr_tokens` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `asset_id` bigint(20) unsigned NOT NULL,
  `token` varchar(255) NOT NULL,
  `reason` text NOT NULL,
  `invalidated_by` int(10) unsigned NOT NULL,
  `invalidated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `invalidated_qr_tokens_token_unique` (`token`),
  KEY `invalidated_qr_tokens_invalidated_by_foreign` (`invalidated_by`),
  KEY `idx_invalidated_qr_tokens_token` (`token`),
  KEY `idx_invalidated_qr_tokens_asset` (`asset_id`),
  CONSTRAINT `invalidated_qr_tokens_asset_id_foreign` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `invalidated_qr_tokens_invalidated_by_foreign` FOREIGN KEY (`invalidated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invalidated_qr_tokens`
--

LOCK TABLES `invalidated_qr_tokens` WRITE;
/*!40000 ALTER TABLE `invalidated_qr_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `invalidated_qr_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `knex_migrations`
--

DROP TABLE IF EXISTS `knex_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `knex_migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `migration_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `knex_migrations`
--

LOCK TABLES `knex_migrations` WRITE;
/*!40000 ALTER TABLE `knex_migrations` DISABLE KEYS */;
INSERT INTO `knex_migrations` VALUES
(1,'20261027000001_create_org_structure_tables.ts',1,'2026-10-27 02:45:56'),
(2,'20261027000002_create_auth_rbac_tables.ts',1,'2026-10-27 02:45:58'),
(3,'20261027000003_create_catalog_settings_tables.ts',1,'2026-10-27 02:45:59'),
(4,'20261027000004_create_audit_notification_tables.ts',1,'2026-10-27 02:46:00'),
(5,'20261027000005_create_assets_and_events_tables.ts',2,'2026-10-27 04:15:04'),
(6,'20261027000006_create_requests_and_workflow_tables.ts',3,'2026-10-27 05:20:17'),
(8,'20261028000007_add_lifecycle_columns_to_request_lines.ts',4,'2026-10-27 17:49:05'),
(9,'20261028000008_create_stocktake_tables.ts',5,'2026-10-27 21:09:35'),
(11,'20261028000009_create_depreciation_tables.ts',6,'2026-10-28 01:01:04'),
(12,'20261028000010_create_p10_files_and_import_tables.ts',7,'2026-10-28 03:01:32'),
(13,'20261028000011_create_maintenance_tables.ts',8,'2026-10-28 04:13:19'),
(14,'20261029000012_create_reports_and_delegations_tables.ts',9,'2026-10-29 02:55:36'),
(15,'20261102000013_p14_conditional_workflow_and_repair.ts',10,'2026-11-02 01:27:17'),
(16,'20261102000014_p14_maintenance_finance_handover.ts',11,'2026-11-02 05:30:43');
/*!40000 ALTER TABLE `knex_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `knex_migrations_lock`
--

DROP TABLE IF EXISTS `knex_migrations_lock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `knex_migrations_lock` (
  `index` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `is_locked` int(11) DEFAULT NULL,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `knex_migrations_lock`
--

LOCK TABLES `knex_migrations_lock` WRITE;
/*!40000 ALTER TABLE `knex_migrations_lock` DISABLE KEYS */;
INSERT INTO `knex_migrations_lock` VALUES
(1,0);
/*!40000 ALTER TABLE `knex_migrations_lock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `org_unit_id` int(10) unsigned NOT NULL,
  `parent_id` int(10) unsigned DEFAULT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(150) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `locations_org_unit_id_code_unique` (`org_unit_id`,`code`),
  KEY `locations_parent_id_foreign` (`parent_id`),
  CONSTRAINT `locations_org_unit_id_foreign` FOREIGN KEY (`org_unit_id`) REFERENCES `org_units` (`id`),
  CONSTRAINT `locations_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=235 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES
(219,229,NULL,'P101','Kho tài sản & Thiết bị (Tầng 1)',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(220,228,NULL,'P102','Phòng Hành chính Nhân sự (Tầng 1)',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(221,230,NULL,'P103','Phòng Kế toán (Tầng 1)',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(222,229,NULL,'P104','Phòng Cơ sở Vật chất (Tầng 1)',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(223,226,NULL,'P201','Phòng Họp Lớn (Tầng 2)',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(224,226,NULL,'P202','Phòng Internship & Dự án (Tầng 2)',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(225,231,NULL,'P203','Phòng Kỹ thuật & Công nghệ (Tầng 2)',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(226,233,NULL,'P204','Phòng Dự án Phần mềm (Tầng 2)',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(227,227,NULL,'P301','Phòng Giám đốc (Tầng 3)',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(228,227,NULL,'P302','Phòng Phó Giám đốc & Thư ký (Tầng 3)',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(229,232,NULL,'P303','Phòng Đào tạo (Tầng 3)',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(230,234,NULL,'P304','Phòng Truyền thông & Marketing (Tầng 3)',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(231,235,NULL,'P305','Phòng Tư vấn Tuyển sinh (Tầng 3)',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(232,236,NULL,'P306','Phòng Hợp tác Doanh nghiệp (Tầng 3)',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(233,231,NULL,'P401','Phòng Máy chủ Server Room (Tầng 4)',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(234,232,NULL,'P402','Phòng Lab Thực hành Công nghệ (Tầng 4)',1,'2026-11-04 11:13:38','2026-11-04 11:13:38');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenance_orders`
--

DROP TABLE IF EXISTS `maintenance_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenance_orders` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `asset_id` bigint(20) unsigned NOT NULL,
  `plan_id` int(10) unsigned DEFAULT NULL,
  `type` enum('preventive','corrective') NOT NULL DEFAULT 'corrective',
  `source` enum('manual','scheduled','damage_report','repair_request') NOT NULL DEFAULT 'manual',
  `status` enum('pending_receive','open','in_progress','pending_finance','payment_confirmed','ready_handover','done','cancelled') NOT NULL DEFAULT 'open',
  `prev_asset_status` varchar(30) DEFAULT NULL,
  `reported_by` int(10) unsigned DEFAULT NULL,
  `assigned_to` int(10) unsigned DEFAULT NULL,
  `vendor_id` int(10) unsigned DEFAULT NULL,
  `cause` text NOT NULL,
  `attachment_file_id` bigint(20) unsigned DEFAULT NULL,
  `cost` decimal(18,2) NOT NULL DEFAULT 0.00,
  `started_at` date DEFAULT NULL,
  `finished_at` date DEFAULT NULL,
  `result` text DEFAULT NULL,
  `outcome` enum('repaired','unrepairable') DEFAULT NULL,
  `version` int(10) unsigned NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `request_id` int(10) unsigned DEFAULT NULL,
  `finance_status` enum('none','pending','approved_paid','rejected') NOT NULL DEFAULT 'none',
  `finance_voucher_no` varchar(50) DEFAULT NULL,
  `finance_approved_by` int(10) unsigned DEFAULT NULL,
  `finance_approved_at` datetime DEFAULT NULL,
  `finance_note` varchar(500) DEFAULT NULL,
  `handover_to_user_id` int(10) unsigned DEFAULT NULL,
  `handover_at` datetime DEFAULT NULL,
  `handover_confirmed_at` datetime DEFAULT NULL,
  `handover_note` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_maintenance_orders_code` (`code`),
  KEY `maintenance_orders_plan_id_foreign` (`plan_id`),
  KEY `maintenance_orders_vendor_id_foreign` (`vendor_id`),
  KEY `maintenance_orders_attachment_file_id_foreign` (`attachment_file_id`),
  KEY `idx_morders_asset_status` (`asset_id`,`status`),
  KEY `idx_morders_assigned_status` (`assigned_to`,`status`),
  KEY `idx_morders_status_finished` (`status`,`finished_at`),
  KEY `idx_morders_reporter_created` (`reported_by`,`created_at`),
  KEY `idx_morders_request_id` (`request_id`),
  KEY `maintenance_orders_finance_approved_by_foreign` (`finance_approved_by`),
  KEY `maintenance_orders_handover_to_user_id_foreign` (`handover_to_user_id`),
  CONSTRAINT `maintenance_orders_asset_id_foreign` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`),
  CONSTRAINT `maintenance_orders_assigned_to_foreign` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `maintenance_orders_attachment_file_id_foreign` FOREIGN KEY (`attachment_file_id`) REFERENCES `asset_files` (`id`) ON DELETE SET NULL,
  CONSTRAINT `maintenance_orders_finance_approved_by_foreign` FOREIGN KEY (`finance_approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `maintenance_orders_handover_to_user_id_foreign` FOREIGN KEY (`handover_to_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `maintenance_orders_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `maintenance_plans` (`id`) ON DELETE SET NULL,
  CONSTRAINT `maintenance_orders_reported_by_foreign` FOREIGN KEY (`reported_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `maintenance_orders_request_id_foreign` FOREIGN KEY (`request_id`) REFERENCES `requests` (`id`) ON DELETE SET NULL,
  CONSTRAINT `maintenance_orders_vendor_id_foreign` FOREIGN KEY (`vendor_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance_orders`
--

LOCK TABLES `maintenance_orders` WRITE;
/*!40000 ALTER TABLE `maintenance_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `maintenance_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenance_plans`
--

DROP TABLE IF EXISTS `maintenance_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `maintenance_plans` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `asset_id` bigint(20) unsigned NOT NULL,
  `task` varchar(500) NOT NULL,
  `interval_months` int(10) unsigned NOT NULL,
  `next_due_date` date NOT NULL,
  `remind_state` varchar(10) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` int(10) unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `maintenance_plans_created_by_foreign` (`created_by`),
  KEY `idx_mplans_due_active` (`active`,`next_due_date`),
  KEY `idx_mplans_asset_active` (`asset_id`,`active`),
  CONSTRAINT `maintenance_plans_asset_id_foreign` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `maintenance_plans_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance_plans`
--

LOCK TABLES `maintenance_plans` WRITE;
/*!40000 ALTER TABLE `maintenance_plans` DISABLE KEYS */;
/*!40000 ALTER TABLE `maintenance_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification_outbox`
--

DROP TABLE IF EXISTS `notification_outbox`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_outbox` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `recipient_email` varchar(255) NOT NULL,
  `recipient_user_id` int(10) unsigned DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `content_html` text NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `retry_count` int(11) NOT NULL DEFAULT 0,
  `max_retries` int(11) NOT NULL DEFAULT 3,
  `last_error` text DEFAULT NULL,
  `sent_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `notification_outbox_recipient_user_id_foreign` (`recipient_user_id`),
  KEY `idx_outbox_status_created` (`status`,`created_at`),
  CONSTRAINT `notification_outbox_recipient_user_id_foreign` FOREIGN KEY (`recipient_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification_outbox`
--

LOCK TABLES `notification_outbox` WRITE;
/*!40000 ALTER TABLE `notification_outbox` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification_outbox` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `ref_type` varchar(50) DEFAULT NULL,
  `ref_id` varchar(50) DEFAULT NULL,
  `read_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `notifications_created_at_index` (`created_at`),
  KEY `notifications_user_id_read_at_index` (`user_id`,`read_at`),
  CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opening_balance_batches`
--

DROP TABLE IF EXISTS `opening_balance_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `opening_balance_batches` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) NOT NULL,
  `row_count` int(10) unsigned NOT NULL DEFAULT 0,
  `system_total_accumulated` decimal(18,2) NOT NULL DEFAULT 0.00,
  `ledger_total_accumulated` decimal(18,2) NOT NULL DEFAULT 0.00,
  `difference_amount` decimal(18,2) NOT NULL DEFAULT 0.00,
  `discrepancy_reason` varchar(500) DEFAULT NULL,
  `created_by` int(10) unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `opening_balance_batches_created_by_foreign` (`created_by`),
  CONSTRAINT `opening_balance_batches_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opening_balance_batches`
--

LOCK TABLES `opening_balance_batches` WRITE;
/*!40000 ALTER TABLE `opening_balance_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `opening_balance_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `org_units`
--

DROP TABLE IF EXISTS `org_units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `org_units` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` int(10) unsigned DEFAULT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(150) NOT NULL,
  `type` enum('BRANCH','DEPARTMENT') NOT NULL,
  `path` varchar(255) NOT NULL,
  `depth` int(11) NOT NULL DEFAULT 1,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `org_units_code_unique` (`code`),
  KEY `org_units_parent_id_foreign` (`parent_id`),
  KEY `org_units_path_index` (`path`),
  CONSTRAINT `org_units_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `org_units` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=237 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `org_units`
--

LOCK TABLES `org_units` WRITE;
/*!40000 ALTER TABLE `org_units` DISABLE KEYS */;
INSERT INTO `org_units` VALUES
(226,NULL,'DEVMASTER','Công ty Cổ phần Công nghệ Devmaster','BRANCH','/226/',1,1,'2026-11-04 11:13:37','2026-11-04 11:13:37'),
(227,226,'BGD','Ban Giám đốc','DEPARTMENT','/226/227/',2,1,'2026-11-04 11:13:37','2026-11-04 11:13:37'),
(228,226,'HCNS','Phòng Hành chính Nhân sự','DEPARTMENT','/226/228/',2,1,'2026-11-04 11:13:37','2026-11-04 11:13:37'),
(229,226,'CSVC','Phòng Cơ sở Vật chất','DEPARTMENT','/226/229/',2,1,'2026-11-04 11:13:37','2026-11-04 11:13:37'),
(230,226,'KT','Phòng Kế toán','DEPARTMENT','/226/230/',2,1,'2026-11-04 11:13:37','2026-11-04 11:13:37'),
(231,226,'KTH','Phòng Kỹ thuật','DEPARTMENT','/226/231/',2,1,'2026-11-04 11:13:37','2026-11-04 11:13:37'),
(232,226,'DT','Phòng Đào tạo','DEPARTMENT','/226/232/',2,1,'2026-11-04 11:13:37','2026-11-04 11:13:37'),
(233,226,'DA','Phòng Dự án','DEPARTMENT','/226/233/',2,1,'2026-11-04 11:13:37','2026-11-04 11:13:37'),
(234,226,'TT','Phòng Truyền thông','DEPARTMENT','/226/234/',2,1,'2026-11-04 11:13:37','2026-11-04 11:13:37'),
(235,226,'TV','Phòng Tư vấn','DEPARTMENT','/226/235/',2,1,'2026-11-04 11:13:37','2026-11-04 11:13:37'),
(236,226,'HTDN','Phòng Hợp tác Doanh nghiệp','DEPARTMENT','/226/236/',2,1,'2026-11-04 11:13:38','2026-11-04 11:13:38');
/*!40000 ALTER TABLE `org_units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(100) NOT NULL,
  `name` varchar(150) NOT NULL,
  `module` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=1387 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES
(1329,'user.read','Xem người dùng','System','Xem danh sách và chi tiết người dùng','2026-11-04 11:13:38'),
(1330,'user.create','Tạo người dùng','System','Tạo tài khoản người dùng mới','2026-11-04 11:13:38'),
(1331,'user.update','Sửa người dùng','System','Cập nhật thông tin tài khoản','2026-11-04 11:13:38'),
(1332,'user.status','Khóa/Mở tài khoản','System','Đổi trạng thái hoạt động của tài khoản','2026-11-04 11:13:38'),
(1333,'user.roles','Gán vai trò và phạm vi','System','Phân quyền và gán scope cho người dùng','2026-11-04 11:13:38'),
(1334,'role.read','Xem vai trò','System','Xem danh sách vai trò và quyền','2026-11-04 11:13:38'),
(1335,'role.update','Cập nhật vai trò','System','Sửa ma trận quyền của vai trò','2026-11-04 11:13:38'),
(1336,'setting.read','Xem tham số','System','Xem tham số cấu hình hệ thống','2026-11-04 11:13:38'),
(1337,'setting.update','Cấu hình tham số','System','Cập nhật tham số hệ thống','2026-11-04 11:13:38'),
(1338,'audit.read','Xem nhật ký hoạt động','System','Xem audit log truy vết hệ thống','2026-11-04 11:13:38'),
(1339,'org_unit.read','Xem cây tổ chức','Organization','Xem sơ đồ cơ cấu tổ chức','2026-11-04 11:13:38'),
(1340,'org_unit.create','Tạo đơn vị','Organization','Tạo chi nhánh hoặc phòng ban','2026-11-04 11:13:38'),
(1341,'org_unit.update','Sửa đơn vị','Organization','Cập nhật thông tin hoặc di chuyển đơn vị','2026-11-04 11:13:38'),
(1342,'org_unit.delete','Ngừng dùng đơn vị','Organization','Ngừng hoạt động đơn vị','2026-11-04 11:13:38'),
(1343,'location.read','Xem vị trí','Organization','Xem danh sách vị trí vật lý','2026-11-04 11:13:38'),
(1344,'location.create','Thêm vị trí','Organization','Thêm mới vị trí đặt tài sản','2026-11-04 11:13:38'),
(1345,'location.update','Sửa vị trí','Organization','Cập nhật vị trí đặt tài sản','2026-11-04 11:13:38'),
(1346,'catalog.read','Xem danh mục','Catalog','Xem danh mục loại tài sản, nhà cung cấp, ĐVT, tình trạng','2026-11-04 11:13:38'),
(1347,'catalog.update','Cập nhật danh mục','Catalog','Thêm sửa các mục trong danh mục dùng chung','2026-11-04 11:13:38'),
(1348,'asset.read','Xem tài sản','Asset','Xem danh sách và chi tiết hồ sơ tài sản','2026-11-04 11:13:38'),
(1349,'asset.create','Tạo tài sản','Asset','Khai báo hồ sơ tài sản mới','2026-11-04 11:13:38'),
(1350,'asset.update','Sửa tài sản','Asset','Cập nhật thông tin hồ sơ tài sản','2026-11-04 11:13:38'),
(1351,'asset.status','Đổi trạng thái tài sản','Asset','Ngừng dùng hoặc thu hồi tài sản','2026-11-04 11:13:38'),
(1352,'asset.import','Nhập tài sản Excel','Asset','Nhập danh sách tài sản hàng loạt từ Excel','2026-11-04 11:13:38'),
(1353,'asset.export','Xuất tài sản Excel','Asset','Xuất danh mục tài sản ra Excel','2026-11-04 11:13:38'),
(1354,'request.read','Xem phiếu','Request','Xem danh sách và chi tiết phiếu yêu cầu','2026-11-04 11:13:38'),
(1355,'request.create','Tạo phiếu','Request','Lập phiếu yêu cầu mới','2026-11-04 11:13:38'),
(1356,'request.submit','Gửi duyệt phiếu','Request','Gửi phiếu vào quy trình phê duyệt','2026-11-04 11:13:38'),
(1357,'request.cancel','Hủy phiếu','Request','Hủy phiếu yêu cầu đã tạo','2026-11-04 11:13:38'),
(1358,'request.approve_dept','Duyệt cấp Trưởng phòng','Request','Phê duyệt cấp 1','2026-11-04 11:13:38'),
(1359,'request.approve_chief','Duyệt cấp Kế toán trưởng','Request','Phê duyệt tài chính cấp 2','2026-11-04 11:13:38'),
(1360,'request.approve_dir','Duyệt cấp Giám đốc','Request','Phê duyệt cao nhất cấp 3','2026-11-04 11:13:38'),
(1361,'workflow.manage','Cấu hình quy trình duyệt','Request','Cấu hình số cấp duyệt và người duyệt theo loại phiếu','2026-11-04 11:13:38'),
(1362,'lifecycle.assign','Cấp phát tài sản','Lifecycle','Thực hiện cấp phát tài sản','2026-11-04 11:13:38'),
(1363,'lifecycle.transfer','Điều chuyển tài sản','Lifecycle','Thực hiện điều chuyển tài sản','2026-11-04 11:13:38'),
(1364,'lifecycle.recall','Thu hồi tài sản','Lifecycle','Thực hiện thu hồi tài sản','2026-11-04 11:13:38'),
(1365,'lifecycle.dispose','Thanh lý tài sản','Lifecycle','Thực hiện thanh lý tài sản','2026-11-04 11:13:38'),
(1366,'lifecycle.confirm','Xác nhận bàn giao','Lifecycle','Người nhận xác nhận biên bản','2026-11-04 11:13:38'),
(1367,'qr.generate','Sinh mã QR và tem','Stocktake','In tem nhãn QR code','2026-11-04 11:13:38'),
(1368,'qr.scan','Quét QR tra cứu','Stocktake','Tra cứu thông tin qua mã QR','2026-11-04 11:13:38'),
(1369,'stocktake.manage','Quản lý đợt kiểm kê','Stocktake','Tạo và đóng đợt kiểm kê','2026-11-04 11:13:38'),
(1370,'stocktake.scan','Quét kiểm kê','Stocktake','Ghi nhận quét kiểm kê thực tế','2026-11-04 11:13:38'),
(1371,'stocktake.approve','Duyệt kết quả kiểm kê','Stocktake','Chốt số liệu và áp dụng kết quả','2026-11-04 11:13:38'),
(1372,'depreciation.read','Xem khấu hao','Depreciation','Xem bảng khấu hao và giá trị còn lại','2026-11-04 11:13:38'),
(1373,'depreciation.params','Khai báo thông số khấu hao','Depreciation','Khai báo tham số khấu hao tài sản','2026-11-04 11:13:38'),
(1374,'depreciation.run','Chạy khấu hao','Depreciation','Thực hiện tính khấu hao tháng','2026-11-04 11:13:38'),
(1375,'depreciation.lock','Chốt kỳ khấu hao','Depreciation','Khóa số liệu kỳ khấu hao','2026-11-04 11:13:38'),
(1376,'depreciation.unlock','Mở khóa kỳ khấu hao','Depreciation','Quyền đặc biệt mở khóa kỳ đã chốt','2026-11-04 11:13:38'),
(1377,'maintenance.read','Xem bảo trì','Maintenance','Xem lịch và phiếu bảo trì sửa chữa','2026-11-04 11:13:38'),
(1378,'maintenance.plan','Lập kế hoạch bảo trì','Maintenance','Tạo lịch bảo trì định kỳ','2026-11-04 11:13:38'),
(1379,'maintenance.order','Tạo phiếu bảo trì','Maintenance','Lập phiếu yêu cầu bảo dưỡng','2026-11-04 11:13:38'),
(1380,'maintenance.report','Báo hỏng tài sản','Maintenance','Nhân viên báo hỏng sự cố','2026-11-04 11:13:38'),
(1381,'maintenance.execute','Xử lý bảo trì','Maintenance','Kỹ thuật viên cập nhật sửa chữa','2026-11-04 11:13:38'),
(1382,'dashboard.read','Xem Dashboard','Report','Xem bảng tổng quan dashboard','2026-11-04 11:13:38'),
(1383,'report.assets','Báo cáo tài sản','Report','Xem và xuất báo cáo tài sản','2026-11-04 11:13:38'),
(1384,'report.depreciation','Báo cáo khấu hao','Report','Xem và xuất báo cáo khấu hao','2026-11-04 11:13:38'),
(1385,'report.maintenance','Báo cáo bảo trì','Report','Xem báo cáo chi phí và lịch bảo trì','2026-11-04 11:13:38'),
(1386,'notification.read','Xem thông báo','Notification','Xem và đánh dấu đã đọc thông báo','2026-11-04 11:13:38');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `request_approvals`
--

DROP TABLE IF EXISTS `request_approvals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `request_approvals` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `request_id` int(10) unsigned NOT NULL,
  `round` int(10) unsigned NOT NULL,
  `step_order` int(10) unsigned NOT NULL,
  `approver_id` int(10) unsigned NOT NULL,
  `decision` varchar(50) NOT NULL,
  `reason` text DEFAULT NULL,
  `decided_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `delegated_by_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_request_approvals_unique_step` (`request_id`,`round`,`step_order`),
  KEY `request_approvals_approver_id_foreign` (`approver_id`),
  KEY `request_approvals_delegated_by_id_foreign` (`delegated_by_id`),
  CONSTRAINT `request_approvals_approver_id_foreign` FOREIGN KEY (`approver_id`) REFERENCES `users` (`id`),
  CONSTRAINT `request_approvals_delegated_by_id_foreign` FOREIGN KEY (`delegated_by_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `request_approvals_request_id_foreign` FOREIGN KEY (`request_id`) REFERENCES `requests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `request_approvals`
--

LOCK TABLES `request_approvals` WRITE;
/*!40000 ALTER TABLE `request_approvals` DISABLE KEYS */;
INSERT INTO `request_approvals` VALUES
(41,16,1,1,319,'approved','CSVC kiểm tra kho hiện tại đã hết, xác nhận cần mua sắm','2026-11-04 11:13:41',NULL),
(42,16,1,2,322,'approved','Kế toán trưởng cân đối ngân sách quý 1: Hợp lệ','2026-11-04 11:13:41',NULL),
(43,16,1,3,316,'approved','Giám đốc phê duyệt triển khai mua sắm','2026-11-04 11:13:41',NULL),
(44,17,1,1,327,'approved','Trưởng phòng xác nhận thiết bị lỗi','2026-11-04 11:13:41',NULL),
(45,17,1,2,319,'approved','CSVC kiểm tra cần thay linh kiện ngoài: 1.850.000 đ','2026-11-04 11:13:41',NULL),
(46,17,1,3,322,'approved','Kế toán trưởng phê duyệt chi phí sửa chữa','2026-11-04 11:13:41',NULL),
(47,17,1,4,316,'approved','Giám đốc đồng ý chi sửa chữa','2026-11-04 11:13:41',NULL);
/*!40000 ALTER TABLE `request_approvals` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_request_approvals_no_update
    BEFORE UPDATE ON request_approvals
    FOR EACH ROW
    BEGIN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Dữ liệu lịch sử phê duyệt phiếu là append-only, không thể chỉnh sửa!';
    END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_request_approvals_no_delete
      BEFORE DELETE ON request_approvals
      FOR EACH ROW
      BEGIN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Dữ liệu lịch sử phê duyệt phiếu là append-only, không thể xóa!';
      END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `request_lines`
--

DROP TABLE IF EXISTS `request_lines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `request_lines` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `request_id` int(10) unsigned NOT NULL,
  `asset_id` bigint(20) unsigned DEFAULT NULL,
  `item_name` varchar(255) NOT NULL,
  `category_id` int(10) unsigned DEFAULT NULL,
  `supplier_id` int(10) unsigned DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `estimated_cost` decimal(18,2) NOT NULL DEFAULT 0.00,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `to_assignee_id` int(10) unsigned DEFAULT NULL,
  `to_org_unit_id` int(10) unsigned DEFAULT NULL,
  `to_location_id` int(10) unsigned DEFAULT NULL,
  `handover_confirmed_at` datetime DEFAULT NULL,
  `handover_confirmed_by` int(10) unsigned DEFAULT NULL,
  `proceeds_expected` decimal(18,2) DEFAULT NULL,
  `proceeds_actual` decimal(18,2) DEFAULT NULL,
  `capitalized_asset_id` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `request_lines_category_id_foreign` (`category_id`),
  KEY `request_lines_supplier_id_foreign` (`supplier_id`),
  KEY `idx_request_lines_request` (`request_id`),
  KEY `idx_request_lines_asset` (`asset_id`),
  KEY `request_lines_to_org_unit_id_foreign` (`to_org_unit_id`),
  KEY `request_lines_to_location_id_foreign` (`to_location_id`),
  KEY `request_lines_handover_confirmed_by_foreign` (`handover_confirmed_by`),
  KEY `idx_request_lines_capitalized_asset` (`capitalized_asset_id`),
  KEY `idx_request_lines_to_assignee` (`to_assignee_id`),
  CONSTRAINT `request_lines_asset_id_foreign` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE SET NULL,
  CONSTRAINT `request_lines_capitalized_asset_id_foreign` FOREIGN KEY (`capitalized_asset_id`) REFERENCES `assets` (`id`) ON DELETE SET NULL,
  CONSTRAINT `request_lines_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `asset_categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `request_lines_handover_confirmed_by_foreign` FOREIGN KEY (`handover_confirmed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `request_lines_request_id_foreign` FOREIGN KEY (`request_id`) REFERENCES `requests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `request_lines_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `request_lines_to_assignee_id_foreign` FOREIGN KEY (`to_assignee_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `request_lines_to_location_id_foreign` FOREIGN KEY (`to_location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL,
  CONSTRAINT `request_lines_to_org_unit_id_foreign` FOREIGN KEY (`to_org_unit_id`) REFERENCES `org_units` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `request_lines`
--

LOCK TABLES `request_lines` WRITE;
/*!40000 ALTER TABLE `request_lines` DISABLE KEYS */;
INSERT INTO `request_lines` VALUES
(19,16,NULL,'Màn hình máy tính Dell 24 inch Full HD',NULL,NULL,3,6200000.00,'Trang bị cho đội ngũ lập trình','2026-11-04 11:13:41',NULL,231,NULL,NULL,NULL,NULL,NULL,NULL),
(20,17,60666,'Laptop Dell Latitude 5440 Core i7 / 16GB RAM #1',NULL,NULL,1,1850000.00,NULL,'2026-11-04 11:13:41',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(21,18,NULL,'Máy in laser Canon LBP2900',NULL,NULL,1,4500000.00,'Máy in laser đen trắng chuyên dụng','2026-11-04 11:13:41',NULL,231,NULL,NULL,NULL,NULL,NULL,NULL),
(22,18,NULL,'Máy quét phẳng Canon CanoScan LiDE 300',NULL,NULL,1,10000000.00,'Máy quét quang học chất lượng cao','2026-11-04 11:13:41',NULL,231,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `request_lines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `requests`
--

DROP TABLE IF EXISTS `requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `requests` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `requester_id` int(10) unsigned NOT NULL,
  `org_unit_id` int(10) unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `reason` text NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'draft',
  `current_step` int(10) unsigned NOT NULL DEFAULT 1,
  `round` int(10) unsigned NOT NULL DEFAULT 1,
  `steps_snapshot` int(10) unsigned NOT NULL DEFAULT 1,
  `version` int(10) unsigned NOT NULL DEFAULT 1,
  `total_estimated_cost` decimal(18,2) NOT NULL DEFAULT 0.00,
  `has_cost` tinyint(1) NOT NULL DEFAULT 0,
  `assigned_approver_id` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_requests_code` (`code`),
  KEY `requests_assigned_approver_id_foreign` (`assigned_approver_id`),
  KEY `idx_requests_type_status` (`type`,`status`),
  KEY `idx_requests_requester` (`requester_id`),
  KEY `idx_requests_org_unit` (`org_unit_id`),
  CONSTRAINT `requests_assigned_approver_id_foreign` FOREIGN KEY (`assigned_approver_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `requests_org_unit_id_foreign` FOREIGN KEY (`org_unit_id`) REFERENCES `org_units` (`id`),
  CONSTRAINT `requests_requester_id_foreign` FOREIGN KEY (`requester_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `requests`
--

LOCK TABLES `requests` WRITE;
/*!40000 ALTER TABLE `requests` DISABLE KEYS */;
INSERT INTO `requests` VALUES
(16,'PH-2026-000001','purchase',327,231,'Đề xuất trang bị thêm màn hình lập trình cho phòng Kỹ thuật','Phục vụ dự án công nghệ mới, lập trình viên cần làm việc 2 màn hình','approved',3,1,3,4,18600000.00,1,NULL,'2026-11-04 11:13:41','2026-11-04 11:13:41'),
(17,'PH-2026-000002','repair',329,231,'Đề xuất sửa chữa thay bàn phím và pin Laptop Dell','Bàn phím bị liệt một số phím và pin bị chai phồng','approved',4,1,4,5,1850000.00,1,NULL,'2026-11-04 11:13:41','2026-11-04 11:13:41'),
(18,'PH-2026-000003','purchase',327,231,'Đề xuất mua sắm máy in laser và máy quét tài liệu dự án','Phòng Kỹ thuật cần in ấn sơ đồ kiến trúc và quét biên bản nghiệm thu phần mềm','pending',1,1,3,1,14500000.00,1,NULL,'2026-11-04 11:13:41','2026-11-04 11:13:41');
/*!40000 ALTER TABLE `requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `role_id` int(10) unsigned NOT NULL,
  `permission_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `role_permissions_permission_id_foreign` (`permission_id`),
  CONSTRAINT `role_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES
(185,1329),
(185,1330),
(185,1331),
(185,1332),
(185,1333),
(185,1334),
(185,1335),
(185,1336),
(185,1337),
(185,1338),
(185,1339),
(185,1340),
(185,1341),
(185,1342),
(185,1343),
(185,1344),
(185,1345),
(185,1346),
(185,1347),
(185,1348),
(185,1349),
(185,1350),
(185,1351),
(185,1352),
(185,1353),
(185,1354),
(185,1357),
(185,1361),
(185,1372),
(185,1373),
(185,1374),
(185,1375),
(185,1376),
(185,1377),
(185,1378),
(185,1379),
(185,1380),
(185,1381),
(185,1382),
(185,1383),
(185,1384),
(185,1385),
(185,1386),
(186,1329),
(186,1336),
(186,1339),
(186,1343),
(186,1344),
(186,1345),
(186,1346),
(186,1347),
(186,1348),
(186,1349),
(186,1350),
(186,1351),
(186,1352),
(186,1353),
(186,1354),
(186,1355),
(186,1356),
(186,1357),
(186,1362),
(186,1363),
(186,1364),
(186,1365),
(186,1367),
(186,1368),
(186,1369),
(186,1370),
(186,1371),
(186,1372),
(186,1377),
(186,1378),
(186,1379),
(186,1382),
(186,1383),
(186,1384),
(186,1385),
(186,1386),
(187,1329),
(187,1336),
(187,1337),
(187,1338),
(187,1339),
(187,1343),
(187,1346),
(187,1347),
(187,1348),
(187,1353),
(187,1354),
(187,1365),
(187,1368),
(187,1371),
(187,1372),
(187,1373),
(187,1374),
(187,1375),
(187,1376),
(187,1377),
(187,1382),
(187,1383),
(187,1384),
(187,1385),
(187,1386),
(188,1329),
(188,1339),
(188,1343),
(188,1346),
(188,1348),
(188,1353),
(188,1354),
(188,1355),
(188,1356),
(188,1357),
(188,1358),
(188,1368),
(188,1382),
(188,1383),
(188,1386),
(189,1329),
(189,1336),
(189,1338),
(189,1339),
(189,1343),
(189,1346),
(189,1348),
(189,1353),
(189,1354),
(189,1359),
(189,1368),
(189,1372),
(189,1373),
(189,1374),
(189,1375),
(189,1376),
(189,1382),
(189,1383),
(189,1384),
(189,1385),
(189,1386),
(190,1329),
(190,1336),
(190,1338),
(190,1339),
(190,1343),
(190,1346),
(190,1348),
(190,1353),
(190,1354),
(190,1360),
(190,1368),
(190,1372),
(190,1373),
(190,1374),
(190,1375),
(190,1376),
(190,1382),
(190,1383),
(190,1384),
(190,1385),
(190,1386),
(191,1339),
(191,1343),
(191,1346),
(191,1348),
(191,1354),
(191,1355),
(191,1356),
(191,1357),
(191,1366),
(191,1368),
(191,1380),
(191,1386),
(192,1339),
(192,1343),
(192,1346),
(192,1348),
(192,1368),
(192,1377),
(192,1381),
(192,1386);
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_system` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=193 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES
(185,'SYS_ADMIN','Quản trị hệ thống','Toàn quyền quản trị kỹ thuật và phân quyền',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(186,'ASSET_MANAGER','Quản lý tài sản','Quản lý danh mục, vòng đời, cấp phát, kiểm kê tài sản',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(187,'ASSET_ACCOUNTANT','Kế toán tài sản','Quản lý khấu hao, số liệu tài chính, báo cáo giá trị',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(188,'DEPT_HEAD','Trưởng bộ phận','Quản lý tài sản đơn vị, duyệt đề xuất mua sắm/điều chuyển',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(189,'CHIEF_ACCOUNTANT','Kế toán trưởng','Kiểm soát tài chính, phê duyệt tài chính cấp 2',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(190,'DIRECTOR','Giám đốc','Phê duyệt cấp cao nhất, xem tổng quan toàn công ty',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(191,'EMPLOYEE','Nhân viên','Xem và xác nhận tài sản cá nhân, báo hỏng, lập đề xuất',1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(192,'TECHNICIAN','Nhân viên kỹ thuật','Tiếp nhận, xử lý và cập nhật kết quả sửa chữa, bảo trì',1,'2026-11-04 11:13:38','2026-11-04 11:13:38');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(128) NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `csrf_token` varchar(128) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_foreign` (`user_id`),
  KEY `sessions_expires_at_index` (`expires_at`),
  CONSTRAINT `sessions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stocktake_items`
--

DROP TABLE IF EXISTS `stocktake_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `stocktake_items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `stocktake_id` int(10) unsigned NOT NULL,
  `asset_id` bigint(20) unsigned DEFAULT NULL,
  `raw_code` varchar(255) DEFAULT NULL,
  `expected_location_id` int(10) unsigned DEFAULT NULL,
  `actual_location_id` int(10) unsigned DEFAULT NULL,
  `scanned_at` datetime DEFAULT NULL,
  `scanned_by` int(10) unsigned DEFAULT NULL,
  `result` enum('pending','matched','missing','extra','misplaced') NOT NULL DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_stocktake_items_asset` (`stocktake_id`,`asset_id`),
  KEY `stocktake_items_asset_id_foreign` (`asset_id`),
  KEY `stocktake_items_expected_location_id_foreign` (`expected_location_id`),
  KEY `stocktake_items_actual_location_id_foreign` (`actual_location_id`),
  KEY `stocktake_items_scanned_by_foreign` (`scanned_by`),
  KEY `idx_stocktake_items_result` (`stocktake_id`,`result`),
  CONSTRAINT `stocktake_items_actual_location_id_foreign` FOREIGN KEY (`actual_location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL,
  CONSTRAINT `stocktake_items_asset_id_foreign` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE SET NULL,
  CONSTRAINT `stocktake_items_expected_location_id_foreign` FOREIGN KEY (`expected_location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL,
  CONSTRAINT `stocktake_items_scanned_by_foreign` FOREIGN KEY (`scanned_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `stocktake_items_stocktake_id_foreign` FOREIGN KEY (`stocktake_id`) REFERENCES `stocktakes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=342 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stocktake_items`
--

LOCK TABLES `stocktake_items` WRITE;
/*!40000 ALTER TABLE `stocktake_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `stocktake_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stocktake_scans`
--

DROP TABLE IF EXISTS `stocktake_scans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `stocktake_scans` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `stocktake_id` int(10) unsigned NOT NULL,
  `raw_code` varchar(255) NOT NULL,
  `asset_id` bigint(20) unsigned DEFAULT NULL,
  `scan_result` varchar(50) NOT NULL,
  `scanned_by` int(10) unsigned NOT NULL,
  `scanned_at` datetime NOT NULL DEFAULT current_timestamp(),
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stocktake_scans_asset_id_foreign` (`asset_id`),
  KEY `stocktake_scans_scanned_by_foreign` (`scanned_by`),
  KEY `idx_stocktake_scans_time` (`stocktake_id`,`scanned_at`),
  KEY `idx_stocktake_scans_code` (`stocktake_id`,`raw_code`),
  CONSTRAINT `stocktake_scans_asset_id_foreign` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE SET NULL,
  CONSTRAINT `stocktake_scans_scanned_by_foreign` FOREIGN KEY (`scanned_by`) REFERENCES `users` (`id`),
  CONSTRAINT `stocktake_scans_stocktake_id_foreign` FOREIGN KEY (`stocktake_id`) REFERENCES `stocktakes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stocktake_scans`
--

LOCK TABLES `stocktake_scans` WRITE;
/*!40000 ALTER TABLE `stocktake_scans` DISABLE KEYS */;
/*!40000 ALTER TABLE `stocktake_scans` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_stocktake_scans_no_update
    BEFORE UPDATE ON stocktake_scans
    FOR EACH ROW
    BEGIN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Bảng stocktake_scans là append-only, cấm thao tác UPDATE';
    END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER trg_stocktake_scans_no_delete
      BEFORE DELETE ON stocktake_scans
      FOR EACH ROW
      BEGIN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Bảng stocktake_scans là append-only, cấm thao tác DELETE';
      END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `stocktakes`
--

DROP TABLE IF EXISTS `stocktakes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `stocktakes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `scope_org_unit_id` int(10) unsigned NOT NULL,
  `scope_location_id` int(10) unsigned DEFAULT NULL,
  `status` enum('in_progress','scanned','closed','cancelled') NOT NULL DEFAULT 'in_progress',
  `started_at` datetime NOT NULL,
  `closed_at` datetime DEFAULT NULL,
  `created_by` int(10) unsigned NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `stocktakes_code_unique` (`code`),
  KEY `stocktakes_scope_location_id_foreign` (`scope_location_id`),
  KEY `stocktakes_created_by_foreign` (`created_by`),
  KEY `idx_stocktakes_org_status` (`scope_org_unit_id`,`status`),
  KEY `idx_stocktakes_created_at` (`created_at`),
  CONSTRAINT `stocktakes_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `stocktakes_scope_location_id_foreign` FOREIGN KEY (`scope_location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL,
  CONSTRAINT `stocktakes_scope_org_unit_id_foreign` FOREIGN KEY (`scope_org_unit_id`) REFERENCES `org_units` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stocktakes`
--

LOCK TABLES `stocktakes` WRITE;
/*!40000 ALTER TABLE `stocktakes` DISABLE KEYS */;
/*!40000 ALTER TABLE `stocktakes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(200) NOT NULL,
  `tax_code` varchar(50) DEFAULT NULL,
  `contact_name` varchar(100) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `suppliers_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES
(106,'NCC_DELL','Công ty TNHH Thiết bị Công nghệ Dell Việt Nam','0101234567',NULL,'024-37654321',NULL,NULL,1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(107,'NCC_HP','Tập đoàn Công nghệ HP Enterprise','0301234567',NULL,'028-38654321',NULL,NULL,1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(108,'NCC_FPT','Công ty CP Bán lẻ Kỹ thuật số FPT','0101778161',NULL,'024-73006666',NULL,NULL,1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(109,'NCC_HOAPHAT','Nội thất Văn phòng Hòa Phát','0100112233',NULL,'024-35558888',NULL,NULL,1,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(110,'NCC_RANGDONG','Công ty CP Bóng đèn Phích nước Rạng Đông','0100108990',NULL,'024-38584310',NULL,NULL,1,'2026-11-04 11:13:38','2026-11-04 11:13:38');
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_settings`
--

DROP TABLE IF EXISTS `system_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_settings` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(100) NOT NULL,
  `value` text NOT NULL,
  `type` enum('string','number','boolean','json') NOT NULL DEFAULT 'string',
  `description` varchar(255) DEFAULT NULL,
  `updated_by` int(10) unsigned DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `system_settings_key_unique` (`key`),
  KEY `system_settings_updated_by_foreign` (`updated_by`),
  CONSTRAINT `system_settings_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=210 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_settings`
--

LOCK TABLES `system_settings` WRITE;
/*!40000 ALTER TABLE `system_settings` DISABLE KEYS */;
INSERT INTO `system_settings` VALUES
(204,'auth.lock.maxAttempts','5','number','Số lần đăng nhập sai tối đa',NULL,'2026-11-04 11:13:38'),
(205,'auth.lock.durationMinutes','15','number','Thời gian khóa tài khoản tạm thời (phút)',NULL,'2026-11-04 11:13:38'),
(206,'auth.session.ttlHours','8','number','Thời hạn phiên đăng nhập (giờ)',NULL,'2026-11-04 11:13:38'),
(207,'asset.code.format','TS-{YYYY}-{SEQ:5}','string','Định dạng mã tài sản sinh tự động',NULL,'2026-11-04 11:13:38'),
(208,'asset.capitalization.threshold','10000000','number','Ngưỡng nguyên giá tài sản cố định trích khấu hao (10 triệu VND)',NULL,'2026-11-04 11:13:38'),
(209,'depreciation.startRule','next_month','string','Quy tắc bắt đầu khấu hao: tháng sau ghi tăng',NULL,'2026-11-04 11:13:38');
/*!40000 ALTER TABLE `system_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `role_id` int(10) unsigned NOT NULL,
  `scope_org_unit_id` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_roles_user_id_role_id_scope_org_unit_id_unique` (`user_id`,`role_id`,`scope_org_unit_id`),
  KEY `user_roles_role_id_foreign` (`role_id`),
  KEY `user_roles_scope_org_unit_id_foreign` (`scope_org_unit_id`),
  CONSTRAINT `user_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_roles_scope_org_unit_id_foreign` FOREIGN KEY (`scope_org_unit_id`) REFERENCES `org_units` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_roles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=481 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES
(445,315,185,NULL,'2026-11-04 11:13:38'),
(446,316,190,NULL,'2026-11-04 11:13:39'),
(447,317,191,227,'2026-11-04 11:13:39'),
(448,318,191,227,'2026-11-04 11:13:39'),
(449,319,186,NULL,'2026-11-04 11:13:39'),
(450,319,188,229,'2026-11-04 11:13:39'),
(451,319,191,229,'2026-11-04 11:13:39'),
(452,320,186,NULL,'2026-11-04 11:13:39'),
(453,320,191,229,'2026-11-04 11:13:39'),
(454,321,192,NULL,'2026-11-04 11:13:39'),
(455,321,191,229,'2026-11-04 11:13:39'),
(456,322,189,NULL,'2026-11-04 11:13:39'),
(457,322,188,230,'2026-11-04 11:13:39'),
(458,322,191,230,'2026-11-04 11:13:39'),
(459,323,187,NULL,'2026-11-04 11:13:39'),
(460,323,191,230,'2026-11-04 11:13:39'),
(461,324,188,228,'2026-11-04 11:13:39'),
(462,324,191,228,'2026-11-04 11:13:39'),
(463,325,191,228,'2026-11-04 11:13:39'),
(464,326,191,228,'2026-11-04 11:13:39'),
(465,327,188,231,'2026-11-04 11:13:39'),
(466,327,191,231,'2026-11-04 11:13:39'),
(467,328,191,231,'2026-11-04 11:13:39'),
(468,329,191,231,'2026-11-04 11:13:39'),
(469,330,191,231,'2026-11-04 11:13:39'),
(470,331,188,232,'2026-11-04 11:13:39'),
(471,331,191,232,'2026-11-04 11:13:39'),
(472,332,191,232,'2026-11-04 11:13:39'),
(473,333,188,233,'2026-11-04 11:13:39'),
(474,333,191,233,'2026-11-04 11:13:39'),
(475,334,188,234,'2026-11-04 11:13:39'),
(476,334,191,234,'2026-11-04 11:13:39'),
(477,335,188,235,'2026-11-04 11:13:39'),
(478,335,191,235,'2026-11-04 11:13:39'),
(479,336,188,236,'2026-11-04 11:13:39'),
(480,336,191,236,'2026-11-04 11:13:39');
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `org_unit_id` int(10) unsigned NOT NULL,
  `status` enum('ACTIVE','LOCKED','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `failed_login_attempts` int(11) NOT NULL DEFAULT 0,
  `locked_until` datetime DEFAULT NULL,
  `last_login_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_unique` (`username`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_org_unit_id_foreign` (`org_unit_id`),
  CONSTRAINT `users_org_unit_id_foreign` FOREIGN KEY (`org_unit_id`) REFERENCES `org_units` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=337 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(315,'admin','$argon2id$v=19$m=65536,p=4,t=3$GaHY9ygHYKfsdLc0U/gcfw$lrKiSQ4teS9qATDARCrSNYpo7UcIFkJUPT4w72Vveb4','Quản trị viên Hệ thống','admin@devmaster.edu.vn',227,'ACTIVE',0,NULL,NULL,'2026-11-04 11:13:38','2026-11-04 11:13:38'),
(316,'gd.trinh','$argon2id$v=19$m=65536,p=4,t=3$0tvZB8NIPcqQ0KPbWqOPKw$tDAVIz76C0u1biqPpsj5pD2GMKzYVJ0iiU2hoKB/348','Trịnh Văn Chung (Giám đốc)','chungtv@devmaster.edu.vn',227,'ACTIVE',0,NULL,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(317,'pgd.minh','$argon2id$v=19$m=65536,p=4,t=3$0tvZB8NIPcqQ0KPbWqOPKw$tDAVIz76C0u1biqPpsj5pD2GMKzYVJ0iiU2hoKB/348','Nguyễn Văn Minh (Phó Giám đốc)','minhnv@devmaster.edu.vn',227,'ACTIVE',0,NULL,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(318,'tk.lan','$argon2id$v=19$m=65536,p=4,t=3$0tvZB8NIPcqQ0KPbWqOPKw$tDAVIz76C0u1biqPpsj5pD2GMKzYVJ0iiU2hoKB/348','Lê Thị Ngọc Lan (Thư ký GĐ)','lanltn@devmaster.edu.vn',227,'ACTIVE',0,NULL,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(319,'tp.csvc','$argon2id$v=19$m=65536,p=4,t=3$0tvZB8NIPcqQ0KPbWqOPKw$tDAVIz76C0u1biqPpsj5pD2GMKzYVJ0iiU2hoKB/348','Hoàng Văn Thắng (Trưởng phòng CSVC)','thanghv@devmaster.edu.vn',229,'ACTIVE',0,NULL,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(320,'pp.csvc','$argon2id$v=19$m=65536,p=4,t=3$0tvZB8NIPcqQ0KPbWqOPKw$tDAVIz76C0u1biqPpsj5pD2GMKzYVJ0iiU2hoKB/348','Phạm Đức Anh (Phó phòng CSVC)','anhpd@devmaster.edu.vn',229,'ACTIVE',0,NULL,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(321,'ktv.csvc.dung','$argon2id$v=19$m=65536,p=4,t=3$0tvZB8NIPcqQ0KPbWqOPKw$tDAVIz76C0u1biqPpsj5pD2GMKzYVJ0iiU2hoKB/348','Bùi Tiến Dũng (Kỹ thuật viên CSVC)','dungbt@devmaster.edu.vn',229,'ACTIVE',0,NULL,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(322,'tp.ketoan','$argon2id$v=19$m=65536,p=4,t=3$0tvZB8NIPcqQ0KPbWqOPKw$tDAVIz76C0u1biqPpsj5pD2GMKzYVJ0iiU2hoKB/348','Trần Thị Mai (Trưởng phòng Kế toán / KTT)','maitt@devmaster.edu.vn',230,'ACTIVE',0,NULL,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(323,'kt.huyen','$argon2id$v=19$m=65536,p=4,t=3$0tvZB8NIPcqQ0KPbWqOPKw$tDAVIz76C0u1biqPpsj5pD2GMKzYVJ0iiU2hoKB/348','Đỗ Khánh Huyền (Kế toán tài sản)','huyendk@devmaster.edu.vn',230,'ACTIVE',0,NULL,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(324,'tp.hcns','$argon2id$v=19$m=65536,p=4,t=3$0tvZB8NIPcqQ0KPbWqOPKw$tDAVIz76C0u1biqPpsj5pD2GMKzYVJ0iiU2hoKB/348','Phan Thị Thanh Nga (Trưởng phòng HCNS)','ngaptt@devmaster.edu.vn',228,'ACTIVE',0,NULL,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(325,'pp.hcns','$argon2id$v=19$m=65536,p=4,t=3$0tvZB8NIPcqQ0KPbWqOPKw$tDAVIz76C0u1biqPpsj5pD2GMKzYVJ0iiU2hoKB/348','Vũ Quốc Huy (Phó phòng HCNS)','huyvq@devmaster.edu.vn',228,'ACTIVE',0,NULL,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(326,'nv.hcns.1','$argon2id$v=19$m=65536,p=4,t=3$0tvZB8NIPcqQ0KPbWqOPKw$tDAVIz76C0u1biqPpsj5pD2GMKzYVJ0iiU2hoKB/348','Ngô Thu Trang (Nhân viên HCNS)','trangnt@devmaster.edu.vn',228,'ACTIVE',0,NULL,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(327,'tp.kythuat','$argon2id$v=19$m=65536,p=4,t=3$0tvZB8NIPcqQ0KPbWqOPKw$tDAVIz76C0u1biqPpsj5pD2GMKzYVJ0iiU2hoKB/348','Đặng Tuấn Nghĩa (Trưởng phòng Kỹ thuật)','nghiadt@devmaster.edu.vn',231,'ACTIVE',0,NULL,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(328,'pp.kythuat','$argon2id$v=19$m=65536,p=4,t=3$0tvZB8NIPcqQ0KPbWqOPKw$tDAVIz76C0u1biqPpsj5pD2GMKzYVJ0iiU2hoKB/348','Trần Văn Mạnh (Phó phòng Kỹ thuật)','manhtv@devmaster.edu.vn',231,'ACTIVE',0,NULL,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(329,'nv.kythuat.1','$argon2id$v=19$m=65536,p=4,t=3$0tvZB8NIPcqQ0KPbWqOPKw$tDAVIz76C0u1biqPpsj5pD2GMKzYVJ0iiU2hoKB/348','Lê Hữu Đạt (Lập trình viên)','datlh@devmaster.edu.vn',231,'ACTIVE',0,NULL,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(330,'nv.kythuat.2','$argon2id$v=19$m=65536,p=4,t=3$0tvZB8NIPcqQ0KPbWqOPKw$tDAVIz76C0u1biqPpsj5pD2GMKzYVJ0iiU2hoKB/348','Phạm Hồng Quân (Kỹ sư Phần mềm)','quanph@devmaster.edu.vn',231,'ACTIVE',0,NULL,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(331,'tp.daotao','$argon2id$v=19$m=65536,p=4,t=3$0tvZB8NIPcqQ0KPbWqOPKw$tDAVIz76C0u1biqPpsj5pD2GMKzYVJ0iiU2hoKB/348','Nguyễn Thành Nam (Trưởng phòng Đào tạo)','namnt@devmaster.edu.vn',232,'ACTIVE',0,NULL,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(332,'nv.daotao.1','$argon2id$v=19$m=65536,p=4,t=3$0tvZB8NIPcqQ0KPbWqOPKw$tDAVIz76C0u1biqPpsj5pD2GMKzYVJ0iiU2hoKB/348','Nguyễn Bích Ngọc (Quản lý lớp học)','ngocnb@devmaster.edu.vn',232,'ACTIVE',0,NULL,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(333,'tp.duan','$argon2id$v=19$m=65536,p=4,t=3$0tvZB8NIPcqQ0KPbWqOPKw$tDAVIz76C0u1biqPpsj5pD2GMKzYVJ0iiU2hoKB/348','Lê Hoàng Long (Trưởng phòng Dự án)','longlh@devmaster.edu.vn',233,'ACTIVE',0,NULL,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(334,'tp.truyenthong','$argon2id$v=19$m=65536,p=4,t=3$0tvZB8NIPcqQ0KPbWqOPKw$tDAVIz76C0u1biqPpsj5pD2GMKzYVJ0iiU2hoKB/348','Vũ Phương Linh (Trưởng phòng Truyền thông)','linhvp@devmaster.edu.vn',234,'ACTIVE',0,NULL,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(335,'tp.tuvan','$argon2id$v=19$m=65536,p=4,t=3$0tvZB8NIPcqQ0KPbWqOPKw$tDAVIz76C0u1biqPpsj5pD2GMKzYVJ0iiU2hoKB/348','Dương Thị Thu (Trưởng phòng Tư vấn)','thudt@devmaster.edu.vn',235,'ACTIVE',0,NULL,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(336,'tp.htdn','$argon2id$v=19$m=65536,p=4,t=3$0tvZB8NIPcqQ0KPbWqOPKw$tDAVIz76C0u1biqPpsj5pD2GMKzYVJ0iiU2hoKB/348','Nguyễn Đình Quân (Trưởng phòng HTDN)','quannd@devmaster.edu.vn',236,'ACTIVE',0,NULL,NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workflow_steps`
--

DROP TABLE IF EXISTS `workflow_steps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `workflow_steps` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `request_type` varchar(50) NOT NULL,
  `step_order` int(10) unsigned NOT NULL,
  `approver_rule` varchar(100) NOT NULL,
  `condition` varchar(30) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_workflow_steps_type_order` (`request_type`,`step_order`)
) ENGINE=InnoDB AUTO_INCREMENT=200 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workflow_steps`
--

LOCK TABLES `workflow_steps` WRITE;
/*!40000 ALTER TABLE `workflow_steps` DISABLE KEYS */;
INSERT INTO `workflow_steps` VALUES
(187,'purchase',1,'role:ASSET_MANAGER',NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(188,'purchase',2,'role:CHIEF_ACCOUNTANT',NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(189,'purchase',3,'role:DIRECTOR',NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(190,'assign',1,'dept_head',NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(191,'transfer',1,'dept_head',NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(192,'transfer',2,'role:ASSET_MANAGER',NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(193,'disposal',1,'role:ASSET_MANAGER',NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(194,'disposal',2,'role:CHIEF_ACCOUNTANT',NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(195,'disposal',3,'role:DIRECTOR',NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(196,'repair',1,'dept_head',NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(197,'repair',2,'role:ASSET_MANAGER',NULL,'2026-11-04 11:13:39','2026-11-04 11:13:39'),
(198,'repair',3,'role:CHIEF_ACCOUNTANT','has_cost','2026-11-04 11:13:39','2026-11-04 11:13:39'),
(199,'repair',4,'role:DIRECTOR','has_cost','2026-11-04 11:13:39','2026-11-04 11:13:39');
/*!40000 ALTER TABLE `workflow_steps` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-04 18:14:21
