-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: snm_dispensary
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `available_day_tbl`
--

-- DROP TABLE IF EXISTS `available_day_tbl`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!50503 SET character_set_client = utf8mb4 */;
-- CREATE TABLE `available_day_tbl` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `available_day` varchar(100) NOT NULL,
--   `created_datetime` datetime NOT NULL,
--   `updated_datetime` datetime NOT NULL,
--   `updated_by` int NOT NULL,
--   `is_deleted` tinyint NOT NULL DEFAULT '0' COMMENT '0 - no, 1 - yes',
--   PRIMARY KEY (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cities`
--

-- DROP TABLE IF EXISTS `cities`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!50503 SET character_set_client = utf8mb4 */;
-- CREATE TABLE `cities` (
--   `id` int NOT NULL,
--   `city_name` varchar(30) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
--   `state_id` int NOT NULL,
--   `status` tinyint NOT NULL DEFAULT '1',
--   `is_deleted` tinyint NOT NULL DEFAULT '0'
-- ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
-- /*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `city_tbl`
--

-- DROP TABLE IF EXISTS `city_tbl`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!50503 SET character_set_client = utf8mb4 */;
-- CREATE TABLE `city_tbl` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `city_name` varchar(100) NOT NULL,
--   `state_id` bigint unsigned NOT NULL,
--   `is_deleted` tinyint NOT NULL DEFAULT '0' COMMENT '0 - no, 1 - yes',
--   PRIMARY KEY (`id`),
--   KEY `state_id` (`state_id`),
--   CONSTRAINT `city_tbl_ibfk_1` FOREIGN KEY (`state_id`) REFERENCES `state_tbl` (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=5742 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- /*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `department_tbl`
--

-- DROP TABLE IF EXISTS `department_tbl`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!50503 SET character_set_client = utf8mb4 */;
-- CREATE TABLE `department_tbl` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `department_name` varchar(100) NOT NULL,
--   `created_datetime` datetime NOT NULL,
--   `updated_datetime` datetime NOT NULL,
--   `updated_by` int NOT NULL,
--   `is_deleted` tinyint NOT NULL DEFAULT '0' COMMENT '0 - no, 1 - yes',
--   PRIMARY KEY (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- /*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `qualification_tbl`
--

-- DROP TABLE IF EXISTS `qualification_tbl`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!50503 SET character_set_client = utf8mb4 */;
-- CREATE TABLE `qualification_tbl` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `qualification_name` varchar(100) NOT NULL,
--   `created_datetime` datetime NOT NULL,
--   `updated_datetime` datetime NOT NULL,
--   `updated_by` int NOT NULL,
--   `is_deleted` tinyint NOT NULL DEFAULT '0' COMMENT '0 - no, 1 - yes',
--   PRIMARY KEY (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- /*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `registration_tbl`
--

-- DROP TABLE IF EXISTS `registration_tbl`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!50503 SET character_set_client = utf8mb4 */;
-- CREATE TABLE `registration_tbl` (
--   `reg_id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `user_type` varchar(10) NOT NULL,
--   `login_id` varchar(100) NOT NULL,
--   `title` varchar(50) NOT NULL COMMENT 'Dr., Mr., Ms., Miss.',
--   `full_name` varchar(100) NOT NULL,
--   `email` varchar(100) NOT NULL,
--   `password` varchar(255) NOT NULL,
--   `mobile_no` varchar(15) NOT NULL,
--   `dob` date NOT NULL,
--   `gender` int NOT NULL COMMENT 'Male - 1, Female - 2, Others - 3',
--   `address` text NOT NULL,
--   `state_id` bigint unsigned NOT NULL,
--   `city_id` bigint unsigned NOT NULL,
--   `qualification_id` int NOT NULL,
--   `department_id` int NOT NULL,
--   `available_day_id` bigint NOT NULL,
--   `shifttime_id` bigint NOT NULL,
--   `profile_img_path` varchar(150) NOT NULL,
--   `certificate_doc_path` varchar(150) NOT NULL,
--   `is_present` tinyint NOT NULL COMMENT '0 - absent, 1 - present',
--   `pass_entry` tinyint NOT NULL COMMENT '0 - No, 1 - Yes',
--   `sewa_location_id` int NOT NULL,
--   `remark` text NOT NULL,
--   `created_datetime` datetime NOT NULL,
--   `updated_datetime` datetime NOT NULL,
--   `is_deleted` tinyint NOT NULL DEFAULT '0' COMMENT '0 - no, 1 - yes',
--   `total_exp` decimal(4,2) NOT NULL,
--   `prev_sewa_perform` varchar(100) NOT NULL,
--   `recom_by` varchar(100) NOT NULL,
--   `samagam_held_in` varchar(100) NOT NULL,
--   PRIMARY KEY (`reg_id`),
--   KEY `registration_tbl_state_id_foreign` (`state_id`),
--   KEY `registration_tbl_city_id_foreign` (`city_id`),
--   CONSTRAINT `registration_tbl_city_id_foreign` FOREIGN KEY (`city_id`) REFERENCES `city_tbl` (`id`),
--   CONSTRAINT `registration_tbl_state_id_foreign` FOREIGN KEY (`state_id`) REFERENCES `state_tbl` (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- /*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sewalocation_tbl`
--

-- DROP TABLE IF EXISTS `sewalocation_tbl`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!50503 SET character_set_client = utf8mb4 */;
-- CREATE TABLE `sewalocation_tbl` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `sewalocation_name` varchar(100) NOT NULL,
--   `created_datetime` datetime NOT NULL,
--   `updated_datetime` datetime NOT NULL,
--   `updated_by` int NOT NULL,
--   `is_deleted` tinyint NOT NULL DEFAULT '0' COMMENT '0 - no, 1 - yes',
--   PRIMARY KEY (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- /*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shifttime_tbl`
--

-- DROP TABLE IF EXISTS `shifttime_tbl`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!50503 SET character_set_client = utf8mb4 */;
-- CREATE TABLE `shifttime_tbl` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `shifttime` varchar(100) NOT NULL,
--   `created_datetime` datetime NOT NULL,
--   `updated_datetime` datetime NOT NULL,
--   `updated_by` int NOT NULL,
--   `is_deleted` tinyint NOT NULL DEFAULT '0' COMMENT '0 - no, 1 - yes',
--   PRIMARY KEY (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- /*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `state_tbl`
--

-- DROP TABLE IF EXISTS `state_tbl`;
-- /*!40101 SET @saved_cs_client     = @@character_set_client */;
-- /*!50503 SET character_set_client = utf8mb4 */;
-- CREATE TABLE `state_tbl` (
--   `id` bigint unsigned NOT NULL AUTO_INCREMENT,
--   `state_name` varchar(100) NOT NULL,
--   `country_id` bigint unsigned NOT NULL,
--   `is_deleted` tinyint NOT NULL DEFAULT '0' COMMENT '0 - no, 1 - yes',
--   PRIMARY KEY (`id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- /*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'snm_dispensary'
--
/*!50003 DROP PROCEDURE IF EXISTS `sp_check_email_for_update` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_check_email_for_update`(
    IN p_email VARCHAR(100),
    IN p_exclude_user_id BIGINT UNSIGNED
)
BEGIN
    SELECT COUNT(*) as email_exists
    FROM registration_tbl 
    WHERE email = p_email 
    AND reg_id != p_exclude_user_id 
    AND is_deleted = 0;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_forgot_password_by_mobile` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
-- CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_forgot_password_by_mobile`(
--     IN p_mobile_no VARCHAR(15)
-- )
-- BEGIN
--     -- Validate input
--     IF p_mobile_no IS NULL OR p_mobile_no = '' THEN
--         SIGNAL SQLSTATE '45000'
--         SET MESSAGE_TEXT = 'Invalid input: Mobile number is required';
--     END IF;

--     -- Check and return login_id and password
--     SELECT 
--         login_id,
--         password
--     FROM registration_tbl
--     WHERE mobile_no = p_mobile_no
--       AND is_deleted = 0;
-- END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_admin_summary` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_admin_summary`()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM registration_tbl WHERE is_deleted = 0) as totalUsers,
        (SELECT COUNT(*) FROM registration_tbl WHERE is_deleted = 0 AND created_datetime >= DATE(NOW() - INTERVAL 7 DAY)) as recentRegistrations,
        (SELECT COUNT(*) FROM registration_tbl WHERE is_deleted = 0 AND is_present = 1) as presentUsers,
        (SELECT COUNT(*) FROM registration_tbl WHERE is_deleted = 0 AND pass_entry = 1) as usersWithPass,
        (SELECT COUNT(*) FROM registration_tbl WHERE is_deleted = 0 AND user_type = 'admin') as adminUsers,
        (SELECT COUNT(*) FROM registration_tbl WHERE is_deleted = 0 AND user_type = 'ms') as medicalStaff;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_available_day_by_id` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
-- CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_available_day_by_id`(
--     IN p_id BIGINT UNSIGNED
-- )
-- BEGIN
--     -- ======= Validate Input =======
--     IF p_id IS NULL THEN
--         SIGNAL SQLSTATE '45000'
--         SET MESSAGE_TEXT = 'Invalid input: ID cannot be NULL';
--     END IF;

--     -- ======= Fetch All if ID is 0 =======
--     IF p_id = 0 THEN
--         SELECT 
--             id,
--             available_day,
--             created_datetime,
--             updated_datetime,
--             updated_by,
--             is_deleted
--         FROM available_day_tbl
--         WHERE is_deleted = 0;
        
--     -- ======= Fetch Specific Record =======
--     ELSE
--         SELECT 
--             id,
--             available_day,
--             created_datetime,
--             updated_datetime,
--             updated_by,
--             is_deleted
--         FROM available_day_tbl
--         WHERE id = p_id AND is_deleted = 0;
--     END IF;

-- END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_city_details` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
-- CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_city_details`(
--     IN p_state_id BIGINT UNSIGNED
-- )
-- BEGIN
--     SELECT id, city_name, state_id
--     FROM city_tbl
--     WHERE state_id = p_state_id 
--     AND is_deleted = 0  -- ✅ FIXED: Use correct column name
--     ORDER BY city_name;
-- END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_dashboard_stats` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_dashboard_stats`()
BEGIN
    -- Get total users
    SELECT COUNT(*) as total_users 
    FROM registration_tbl 
    WHERE is_deleted = 0;
    
    -- Get recent registrations (last 7 days)
    SELECT COUNT(*) as recent_registrations 
    FROM registration_tbl 
    WHERE is_deleted = 0 
    AND created_datetime >= DATE(NOW() - INTERVAL 7 DAY);
    
    -- Get department-wise statistics with colors
    SELECT 
        d.department_name as title,
        COUNT(r.reg_id) as value,
        CASE 
            WHEN LOWER(d.department_name) LIKE '%admin%' THEN '#EC4899'
            WHEN LOWER(d.department_name) LIKE '%nursing%' THEN '#3B82F6'
            WHEN LOWER(d.department_name) LIKE '%dressing%' THEN '#F59E0B'
            WHEN LOWER(d.department_name) LIKE '%paramedical%' THEN '#10B981'
            WHEN LOWER(d.department_name) LIKE '%pathology%' THEN '#8B5CF6'
            WHEN LOWER(d.department_name) LIKE '%accupressure%' OR LOWER(d.department_name) LIKE '%acupuncture%' THEN '#06B6D4'
            WHEN LOWER(d.department_name) LIKE '%pharmacy%' THEN '#EC4899'
            WHEN LOWER(d.department_name) LIKE '%physiotherapy%' THEN '#3B82F6'
            WHEN LOWER(d.department_name) LIKE '%homeopathy%' THEN '#F59E0B'
            WHEN LOWER(d.department_name) LIKE '%ambulance%' THEN '#10B981'
            WHEN LOWER(d.department_name) LIKE '%registration%' THEN '#8B5CF6'
            WHEN LOWER(d.department_name) LIKE '%lab%' THEN '#06B6D4'
            ELSE '#6B7280'
        END as color
    FROM department_tbl d
    LEFT JOIN registration_tbl r ON d.id = r.department_id AND r.is_deleted = 0
    WHERE d.is_deleted = 0
    GROUP BY d.id, d.department_name
    ORDER BY COUNT(r.reg_id) DESC, d.department_name;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_department_by_id` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
-- CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_department_by_id`(
--     IN p_id BIGINT UNSIGNED
-- )
-- BEGIN
--     IF p_id = 0 THEN
--         -- Get all departments
--         SELECT id, department_name
--         FROM department_tbl
--         WHERE is_deleted = 0  -- ✅ FIXED: Use correct column name
--         ORDER BY department_name;
--     ELSE
--         -- Get specific department
--         SELECT id, department_name
--         FROM department_tbl
--         WHERE id = p_id AND is_deleted = 0;  -- ✅ FIXED: Use correct column name
--     END IF;
-- END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_dutychart_count` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_dutychart_count`(
    IN p_search VARCHAR(255),
    IN p_department_id INT,
    IN p_user_type VARCHAR(20),
    IN p_state_id BIGINT UNSIGNED,
    IN p_city_id BIGINT UNSIGNED,
    IN p_date DATE,
    IN p_is_present TINYINT,
    IN p_has_pass TINYINT,
    IN p_experience DECIMAL(5,2)
)
BEGIN
    SET @sql = 'SELECT COUNT(*) as total 
    FROM registration_tbl r 
    LEFT JOIN department_tbl d ON r.department_id = d.id AND d.is_deleted = 0
    LEFT JOIN state_tbl s ON r.state_id = s.id AND s.is_deleted = 0
    LEFT JOIN city_tbl c ON r.city_id = c.id AND c.is_deleted = 0
    WHERE r.is_deleted = 0';
    
    IF p_search IS NOT NULL AND p_search != '' THEN
        SET @sql = CONCAT(@sql, ' AND (r.full_name LIKE ''%', p_search, '%'' OR r.email LIKE ''%', p_search, '%'' OR r.mobile_no LIKE ''%', p_search, '%'')');
    END IF;
    
    IF p_department_id IS NOT NULL AND p_department_id > 0 THEN
        SET @sql = CONCAT(@sql, ' AND r.department_id = ', p_department_id);
    END IF;
    
    IF p_user_type IS NOT NULL AND p_user_type != '' THEN
        SET @sql = CONCAT(@sql, ' AND r.user_type = ''', p_user_type, '''');
    END IF;
    
    IF p_state_id IS NOT NULL AND p_state_id > 0 THEN
        SET @sql = CONCAT(@sql, ' AND r.state_id = ', p_state_id);
    END IF;
    
    IF p_city_id IS NOT NULL AND p_city_id > 0 THEN
        SET @sql = CONCAT(@sql, ' AND r.city_id = ', p_city_id);
    END IF;
    
    IF p_date IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND DATE(r.created_datetime) = ''', p_date, '''');
    END IF;
    
    IF p_is_present IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND r.is_present = ', p_is_present);
    END IF;
    
    IF p_has_pass IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND r.pass_entry = ', p_has_pass);
    END IF;
    
    IF p_experience IS NOT NULL AND p_experience > 0 THEN
        SET @sql = CONCAT(@sql, ' AND r.total_exp >= ', p_experience);
    END IF;
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_dutychart_filtered` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_dutychart_filtered`(
    IN p_search VARCHAR(255),
    IN p_department_id INT,
    IN p_user_type VARCHAR(20),
    IN p_state_id BIGINT UNSIGNED,
    IN p_city_id BIGINT UNSIGNED,
    IN p_date DATE,
    IN p_is_present TINYINT,
    IN p_has_pass TINYINT,
    IN p_experience DECIMAL(5,2),
    IN p_sort_by VARCHAR(50),
    IN p_sort_order VARCHAR(4),
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SET @sql = 'SELECT 
        r.reg_id, r.full_name, r.email, r.mobile_no, r.user_type, r.title,
        r.is_present, r.pass_entry, r.total_exp, r.created_datetime, r.dob,
        r.address, r.gender, r.prev_sewa_perform, r.recom_by,
        d.department_name, s.state_name, c.city_name, q.qualification_name
    FROM registration_tbl r
    LEFT JOIN department_tbl d ON r.department_id = d.id AND d.is_deleted = 0
    LEFT JOIN state_tbl s ON r.state_id = s.id AND s.is_deleted = 0
    LEFT JOIN city_tbl c ON r.city_id = c.id AND c.is_deleted = 0
    LEFT JOIN qualification_tbl q ON r.qualification_id = q.id AND q.is_deleted = 0
    WHERE r.is_deleted = 0';
    
    IF p_search IS NOT NULL AND p_search != '' THEN
        SET @sql = CONCAT(@sql, ' AND (r.full_name LIKE ''%', p_search, '%'' OR r.email LIKE ''%', p_search, '%'' OR r.mobile_no LIKE ''%', p_search, '%'')');
    END IF;
    
    IF p_department_id IS NOT NULL AND p_department_id > 0 THEN
        SET @sql = CONCAT(@sql, ' AND r.department_id = ', p_department_id);
    END IF;
    
    IF p_user_type IS NOT NULL AND p_user_type != '' THEN
        SET @sql = CONCAT(@sql, ' AND r.user_type = ''', p_user_type, '''');
    END IF;
    
    IF p_state_id IS NOT NULL AND p_state_id > 0 THEN
        SET @sql = CONCAT(@sql, ' AND r.state_id = ', p_state_id);
    END IF;
    
    IF p_city_id IS NOT NULL AND p_city_id > 0 THEN
        SET @sql = CONCAT(@sql, ' AND r.city_id = ', p_city_id);
    END IF;
    
    IF p_date IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND DATE(r.created_datetime) = ''', p_date, '''');
    END IF;
    
    IF p_is_present IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND r.is_present = ', p_is_present);
    END IF;
    
    IF p_has_pass IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND r.pass_entry = ', p_has_pass);
    END IF;
    
    IF p_experience IS NOT NULL AND p_experience > 0 THEN
        SET @sql = CONCAT(@sql, ' AND r.total_exp >= ', p_experience);
    END IF;
    
    -- Add sorting
    IF p_sort_by = 'department_name' THEN
        SET @sql = CONCAT(@sql, ' ORDER BY d.department_name ', p_sort_order);
    ELSEIF p_sort_by = 'state_name' THEN
        SET @sql = CONCAT(@sql, ' ORDER BY s.state_name ', p_sort_order);
    ELSE
        SET @sql = CONCAT(@sql, ' ORDER BY r.', IFNULL(p_sort_by, 'created_datetime'), ' ', IFNULL(p_sort_order, 'DESC'));
    END IF;
    
    -- Add pagination
    SET @sql = CONCAT(@sql, ' LIMIT ', p_limit, ' OFFSET ', p_offset);
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_dutychart_stats` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_dutychart_stats`()
BEGIN
    -- Get summary stats
    SELECT 
        COUNT(*) as totalStaff,
        COUNT(CASE WHEN is_present = 1 THEN 1 END) as presentStaff,
        COUNT(CASE WHEN pass_entry = 1 THEN 1 END) as staffWithPass,
        COUNT(CASE WHEN user_type = 'admin' THEN 1 END) as adminCount,
        COUNT(CASE WHEN user_type = 'ms' THEN 1 END) as medicalStaffCount,
        AVG(total_exp) as avgExperience
    FROM registration_tbl 
    WHERE is_deleted = 0;
    
    -- Get department breakdown
    SELECT 
        d.department_name,
        COUNT(r.reg_id) as staffCount,
        COUNT(CASE WHEN r.is_present = 1 THEN 1 END) as presentCount
    FROM department_tbl d
    LEFT JOIN registration_tbl r ON d.id = r.department_id AND r.is_deleted = 0
    WHERE d.is_deleted = 0
    GROUP BY d.id, d.department_name
    ORDER BY staffCount DESC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_qualification_by_id` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
-- CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_qualification_by_id`(
--     IN p_id BIGINT UNSIGNED
-- )
-- BEGIN
--     IF p_id = 0 THEN
--         -- Get all qualifications
--         SELECT id, qualification_name
--         FROM qualification_tbl
--         WHERE is_deleted = 0  -- ✅ FIXED: Use correct column name
--         ORDER BY qualification_name;
--     ELSE
--         -- Get specific qualification
--         SELECT id, qualification_name
--         FROM qualification_tbl
--         WHERE id = p_id AND is_deleted = 0;  -- ✅ FIXED: Use correct column name
--     END IF;
-- END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_sewalocation_by_id` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
-- CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_sewalocation_by_id`(
--     IN p_id BIGINT UNSIGNED
-- )
-- BEGIN
--     -- ======= Input Validation =======
--     IF p_id IS NULL THEN
--         SIGNAL SQLSTATE '45000'
--         SET MESSAGE_TEXT = 'Invalid input: ID cannot be NULL';
--     END IF;

--     -- ======= Return All Records if ID is 0 =======
--     IF p_id = 0 THEN
--         SELECT 
--             id,
--             sewalocation_name,
--             created_datetime,
--             updated_datetime,
--             updated_by,
--             is_deleted
--         FROM sewalocation_tbl
--         WHERE is_deleted = 0;

--     -- ======= Return Specific Record =======
--     ELSE
--         SELECT 
--             id,
--             sewalocation_name,
--             created_datetime,
--             updated_datetime,
--             updated_by,
--             is_deleted
--         FROM sewalocation_tbl
--         WHERE id = p_id AND is_deleted = 0;
--     END IF;
-- END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_shifttime_by_id` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
-- CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_shifttime_by_id`(
--     IN p_id BIGINT UNSIGNED
-- )
-- BEGIN
--     -- ====== Validate Input ======
--     IF p_id IS NULL THEN
--         SIGNAL SQLSTATE '45000'
--         SET MESSAGE_TEXT = 'Invalid input: ID cannot be NULL';
--     END IF;

--     -- ====== Fetch All Active Records ======
--     IF p_id = 0 THEN
--         SELECT 
--             id,
--             shifttime,
--             created_datetime,
--             updated_datetime,
--             updated_by,
--             is_deleted
--         FROM shifttime_tbl
--         WHERE is_deleted = 0;

--     -- ====== Fetch Specific Record by ID ======
--     ELSE
--         SELECT 
--             id,
--             shifttime,
--             created_datetime,
--             updated_datetime,
--             updated_by,
--             is_deleted
--         FROM shifttime_tbl
--         WHERE id = p_id AND is_deleted = 0;
--     END IF;
-- END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_state_details` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
-- CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_state_details`(
--     IN p_country_id VARCHAR(20)
-- )
-- BEGIN
--     SELECT id, state_name, country_id
--     FROM state_tbl
--     WHERE is_deleted = 0  -- ✅ FIXED: Use correct column name
--     AND (p_country_id IS NULL OR p_country_id = '' OR country_id = p_country_id)
--     ORDER BY state_name;
-- END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_users_count_filtered` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_users_count_filtered`(
    IN p_search VARCHAR(255),
    IN p_department VARCHAR(100),
    IN p_user_type VARCHAR(20)
)
BEGIN
    SET @sql = 'SELECT COUNT(*) as total
                FROM registration_tbl r
                LEFT JOIN department_tbl d ON r.department_id = d.id
                WHERE r.is_deleted = 0';
    
    IF p_search IS NOT NULL AND p_search != '' THEN
        SET @sql = CONCAT(@sql, ' AND (r.full_name LIKE ''%', p_search, '%'' OR r.email LIKE ''%', p_search, '%'' OR r.mobile_no LIKE ''%', p_search, '%'')');
    END IF;
    
    IF p_department IS NOT NULL AND p_department != '' THEN
        SET @sql = CONCAT(@sql, ' AND d.department_name = ''', p_department, '''');
    END IF;
    
    IF p_user_type IS NOT NULL AND p_user_type != '' THEN
        SET @sql = CONCAT(@sql, ' AND r.user_type = ''', p_user_type, '''');
    END IF;
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_users_filtered` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_users_filtered`(
    IN p_search VARCHAR(255),
    IN p_department VARCHAR(100),
    IN p_user_type VARCHAR(20),
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SET @sql = 'SELECT r.reg_id, r.full_name, r.email, r.user_type, r.mobile_no,
                       r.profile_img_path, r.created_datetime, r.dob, r.address, r.title,
                       r.is_present, r.pass_entry, r.total_exp,
                       q.qualification_name, d.department_name, s.state_name, c.city_name
                FROM registration_tbl r
                LEFT JOIN qualification_tbl q ON r.qualification_id = q.id AND q.is_deleted = 0
                LEFT JOIN department_tbl d ON r.department_id = d.id AND d.is_deleted = 0
                LEFT JOIN state_tbl s ON r.state_id = s.id AND s.is_deleted = 0
                LEFT JOIN city_tbl c ON r.city_id = c.id AND c.is_deleted = 0
                WHERE r.is_deleted = 0';
    
    IF p_search IS NOT NULL AND p_search != '' THEN
        SET @sql = CONCAT(@sql, ' AND (r.full_name LIKE ''%', p_search, '%'' OR r.email LIKE ''%', p_search, '%'' OR r.mobile_no LIKE ''%', p_search, '%'')');
    END IF;
    
    IF p_department IS NOT NULL AND p_department != '' THEN
        SET @sql = CONCAT(@sql, ' AND d.department_name = ''', p_department, '''');
    END IF;
    
    IF p_user_type IS NOT NULL AND p_user_type != '' THEN
        SET @sql = CONCAT(@sql, ' AND r.user_type = ''', p_user_type, '''');
    END IF;
    
    SET @sql = CONCAT(@sql, ' ORDER BY r.created_datetime DESC LIMIT ', p_limit, ' OFFSET ', p_offset);
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_user_profiles` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
-- CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_user_profiles`(
--     IN p_search_key VARCHAR(100),
--     IN p_department_id INT,
--     IN p_qualification_id INT,
--     IN p_sewa_location_id INT,
--     IN p_city_id BIGINT,
--     IN p_state_id BIGINT,
--     IN p_is_present TINYINT,
--     IN p_pass_entry TINYINT
-- )
-- BEGIN
--     SELECT 
--         reg_id,
--         user_type,
--         login_id,
--         title,
--         full_name,
--         email,
--         password,
--         mobile_no,
--         dob,
--         gender,
--         address,
--         state_id,
--         city_id,
--         qualification_id,
--         department_id,
--         available_day_id,
--         shifttime_id,
--         profile_img_path,
--         certificate_doc_path,
--         is_present,
--         pass_entry,
--         sewa_location_id,
--         remark,
--         created_datetime,
--         updated_datetime,
--         is_deleted,
--         total_exp,
--         prev_sewa_perform,
--         recom_by,
--         samagam_held_in
--     FROM registration_tbl
--     WHERE
--         (
--             CAST(reg_id AS CHAR) LIKE CONCAT('%', p_search_key, '%')
--             OR full_name LIKE CONCAT('%', p_search_key, '%')
--             OR mobile_no LIKE CONCAT('%', p_search_key, '%')
--             OR email LIKE CONCAT('%', p_search_key, '%')
--         )
--         AND (p_department_id IS NULL OR department_id = p_department_id)
--         AND (p_qualification_id IS NULL OR qualification_id = p_qualification_id)
--         AND (p_sewa_location_id IS NULL OR sewa_location_id = p_sewa_location_id)
--         AND (p_city_id IS NULL OR city_id = p_city_id)
--         AND (p_state_id IS NULL OR state_id = p_state_id)
--         AND (p_is_present IS NULL OR is_present = p_is_present)
--         AND (p_pass_entry IS NULL OR pass_entry = p_pass_entry)
--         AND is_deleted = 0;
-- END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_user_profile_complete` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_user_profile_complete`(
    IN p_user_id BIGINT UNSIGNED
)
BEGIN
    SELECT 
        r.reg_id, r.full_name, r.email, r.user_type, r.mobile_no, r.title,
        r.profile_img_path, r.created_datetime, r.dob, r.address,
        r.gender, r.total_exp, r.prev_sewa_perform, r.recom_by,
        q.qualification_name, d.department_name, s.state_name, c.city_name
    FROM registration_tbl r
    LEFT JOIN qualification_tbl q ON r.qualification_id = q.id AND q.is_deleted = 0
    LEFT JOIN department_tbl d ON r.department_id = d.id AND d.is_deleted = 0
    LEFT JOIN state_tbl s ON r.state_id = s.id AND s.is_deleted = 0
    LEFT JOIN city_tbl c ON r.city_id = c.id AND c.is_deleted = 0
    WHERE r.reg_id = p_user_id AND r.is_deleted = 0;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_save_user_profile` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
-- CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_save_user_profile`(
--     IN p_action VARCHAR(10), -- 'insert' or 'update'
--     IN p_id BIGINT UNSIGNED,
--     IN p_user_type VARCHAR(10),
--     IN p_login_id VARCHAR(100),
--     IN p_title VARCHAR(50),
--     IN p_full_name VARCHAR(100),
--     IN p_email VARCHAR(100),
--     IN p_password VARCHAR(255),
--     IN p_mobile_no VARCHAR(15),
--     IN p_dob DATE,
--     IN p_gender INT,
--     IN p_address TEXT,
--     IN p_state_id BIGINT UNSIGNED,
--     IN p_city_id BIGINT UNSIGNED,
--     IN p_qualification_id INT,
--     IN p_department_id INT,
--     IN p_available_day_id BIGINT,
--     IN p_shifttime_id BIGINT,
--     IN p_profile_img_path VARCHAR(150),
--     IN p_certificate_doc_path VARCHAR(150),
--     IN p_is_present TINYINT,
--     IN p_pass_entry TINYINT,
--     IN p_sewa_location_id INT,
--     IN p_remark TEXT,
--     IN p_total_exp DECIMAL(4,2),
--     IN p_prev_sewa_perform VARCHAR(100),
--     IN p_recom_by VARCHAR(100),
--     IN p_samagam_held_in VARCHAR(100),
--     IN p_is_deleted TINYINT
-- )
-- BEGIN
--     IF p_action = 'insert' THEN
--         INSERT INTO registration_tbl (
--             user_type,
--             login_id,
--             title,
--             full_name,
--             email,
--             password,
--             mobile_no,
--             dob,
--             gender,
--             address,
--             state_id,
--             city_id,
--             qualification_id,
--             department_id,
--             available_day_id,
--             shifttime_id,
--             profile_img_path,
--             certificate_doc_path,
--             is_present,
--             pass_entry,
--             sewa_location_id,
--             remark,
--             total_exp,
--             prev_sewa_perform,
--             recom_by,
--             samagam_held_in,
--             created_datetime,
--             updated_datetime,
--             is_deleted
--         )
--         VALUES (
--             p_user_type,
--             p_login_id,
--             p_title,
--             p_full_name,
--             p_email,
--             p_password,
--             p_mobile_no,
--             p_dob,
--             p_gender,
--             p_address,
--             p_state_id,
--             p_city_id,
--             p_qualification_id,
--             p_department_id,
--             p_available_day_id,
--             p_shifttime_id,
--             p_profile_img_path,
--             p_certificate_doc_path,
--             p_is_present,
--             p_pass_entry,
--             p_sewa_location_id,
--             p_remark,
--             p_total_exp,
--             p_prev_sewa_perform,
--             p_recom_by,
--             p_samagam_held_in,
--             NOW(),
--             NOW(),
--             p_is_deleted
--         );

--     ELSEIF p_action = 'update' THEN
--         UPDATE registration_tbl
--         SET
--             user_type = p_user_type,
--             login_id = p_login_id,
--             title = p_title,
--             full_name = p_full_name,
--             email = p_email,
--             password = p_password,
--             mobile_no = p_mobile_no,
--             dob = p_dob,
--             gender = p_gender,
--             address = p_address,
--             state_id = p_state_id,
--             city_id = p_city_id,
--             qualification_id = p_qualification_id,
--             department_id = p_department_id,
--             available_day_id = p_available_day_id,
--             shifttime_id = p_shifttime_id,
--             profile_img_path = p_profile_img_path,
--             certificate_doc_path = p_certificate_doc_path,
--             is_present = p_is_present,
--             pass_entry = p_pass_entry,
--             sewa_location_id = p_sewa_location_id,
--             remark = p_remark,
--             total_exp = p_total_exp,
--             prev_sewa_perform = p_prev_sewa_perform,
--             recom_by = p_recom_by,
--             samagam_held_in = p_samagam_held_in,
--             updated_datetime = NOW(),
--             is_deleted = p_is_deleted
--         WHERE reg_id = p_id;
--     END IF;
-- END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_staff_presence` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_staff_presence`(
    IN p_user_id BIGINT UNSIGNED,
    IN p_is_present TINYINT,
    IN p_pass_entry TINYINT,
    IN p_remark TEXT
)
BEGIN
    UPDATE registration_tbl 
    SET 
        is_present = COALESCE(p_is_present, is_present),
        pass_entry = COALESCE(p_pass_entry, pass_entry),
        remark = COALESCE(p_remark, remark),
        updated_datetime = NOW()
    WHERE reg_id = p_user_id AND is_deleted = 0;
    
    SELECT ROW_COUNT() as affected_rows;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_user_presence` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_user_presence`(
    IN p_user_id BIGINT UNSIGNED,
    IN p_is_present TINYINT,
    IN p_pass_entry TINYINT
)
BEGIN
    UPDATE registration_tbl 
    SET 
        is_present = COALESCE(p_is_present, is_present),
        pass_entry = COALESCE(p_pass_entry, pass_entry),
        updated_datetime = NOW()
    WHERE reg_id = p_user_id AND is_deleted = 0;
    
    SELECT ROW_COUNT() as affected_rows;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_user_profile` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_user_profile`(
    IN p_user_id BIGINT UNSIGNED,
    IN p_full_name VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_mobile_no VARCHAR(15),
    IN p_address TEXT,
    IN p_state_id BIGINT UNSIGNED,
    IN p_city_id BIGINT UNSIGNED,
    IN p_department_id BIGINT UNSIGNED,
    IN p_qualification_id BIGINT UNSIGNED
)
BEGIN
    UPDATE registration_tbl 
    SET 
        full_name = COALESCE(p_full_name, full_name),
        email = COALESCE(p_email, email),
        mobile_no = COALESCE(p_mobile_no, mobile_no),
        address = COALESCE(p_address, address),
        state_id = COALESCE(p_state_id, state_id),
        city_id = COALESCE(p_city_id, city_id),
        department_id = COALESCE(p_department_id, department_id),
        qualification_id = COALESCE(p_qualification_id, qualification_id),
        updated_datetime = NOW()
    WHERE reg_id = p_user_id AND is_deleted = 0;
    
    SELECT ROW_COUNT() as affected_rows;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_validate_login` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
-- CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_validate_login`(
--     IN p_user_type VARCHAR(10),
--     IN p_login_id VARCHAR(100),
--     IN p_password VARCHAR(255)
-- )
-- BEGIN
--     -- Fetch matching user
--     SELECT 
--         reg_id,
--         user_type,
--         full_name,
--         email,
--         mobile_no,
--         gender,
--         state_id,
--         city_id,
--         qualification_id,
--         department_id,
--         available_day_id,
--         shifttime_id,
--         profile_img_path,
--         certificate_doc_path,
--         is_present,
--         pass_entry,
--         sewa_location_id,
--         remark,
--         created_datetime,
--         updated_datetime,
--         total_exp,
--         prev_sewa_perform,
--         recom_by,
--         samagam_held_in
--     FROM registration_tbl
--     WHERE user_type = p_user_type
--       AND login_id = p_login_id
--       AND password = p_password
--       AND is_deleted = 0;
-- END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-23 12:19:03
