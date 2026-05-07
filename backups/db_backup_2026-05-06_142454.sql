-- MariaDB dump 10.19  Distrib 10.4.28-MariaDB, for osx10.10 (x86_64)
--
-- Host: 127.0.0.1    Database: somacan_refactor
-- ------------------------------------------------------
-- Server version	9.3.0

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
-- Table structure for table `Blogs`
--

DROP TABLE IF EXISTS `Blogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Blogs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `excerpt` text NOT NULL,
  `content` text NOT NULL,
  `coverImage` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `author` varchar(255) DEFAULT 'Somacan Team',
  `readTime` int DEFAULT NULL,
  `isPublished` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `slug_2` (`slug`),
  UNIQUE KEY `slug_3` (`slug`),
  UNIQUE KEY `slug_4` (`slug`),
  UNIQUE KEY `slug_5` (`slug`),
  UNIQUE KEY `slug_6` (`slug`),
  UNIQUE KEY `slug_7` (`slug`),
  UNIQUE KEY `slug_8` (`slug`),
  UNIQUE KEY `slug_9` (`slug`),
  UNIQUE KEY `slug_10` (`slug`),
  UNIQUE KEY `slug_11` (`slug`),
  UNIQUE KEY `slug_12` (`slug`),
  UNIQUE KEY `slug_13` (`slug`),
  UNIQUE KEY `slug_14` (`slug`),
  UNIQUE KEY `slug_15` (`slug`),
  UNIQUE KEY `slug_16` (`slug`),
  UNIQUE KEY `slug_17` (`slug`),
  UNIQUE KEY `slug_18` (`slug`),
  UNIQUE KEY `slug_19` (`slug`),
  UNIQUE KEY `slug_20` (`slug`),
  UNIQUE KEY `slug_21` (`slug`),
  UNIQUE KEY `slug_22` (`slug`),
  UNIQUE KEY `slug_23` (`slug`),
  UNIQUE KEY `slug_24` (`slug`),
  UNIQUE KEY `slug_25` (`slug`),
  UNIQUE KEY `slug_26` (`slug`),
  UNIQUE KEY `slug_27` (`slug`),
  UNIQUE KEY `slug_28` (`slug`),
  UNIQUE KEY `slug_29` (`slug`),
  UNIQUE KEY `slug_30` (`slug`),
  UNIQUE KEY `slug_31` (`slug`),
  UNIQUE KEY `slug_32` (`slug`),
  UNIQUE KEY `slug_33` (`slug`),
  UNIQUE KEY `slug_34` (`slug`),
  UNIQUE KEY `slug_35` (`slug`),
  UNIQUE KEY `slug_36` (`slug`),
  UNIQUE KEY `slug_37` (`slug`),
  UNIQUE KEY `slug_38` (`slug`),
  UNIQUE KEY `slug_39` (`slug`),
  UNIQUE KEY `slug_40` (`slug`),
  UNIQUE KEY `slug_41` (`slug`),
  UNIQUE KEY `slug_42` (`slug`),
  UNIQUE KEY `slug_43` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Blogs`
--

LOCK TABLES `Blogs` WRITE;
/*!40000 ALTER TABLE `Blogs` DISABLE KEYS */;
/*!40000 ALTER TABLE `Blogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Categories`
--

DROP TABLE IF EXISTS `Categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `sortOrder` int NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `slug_2` (`slug`),
  UNIQUE KEY `slug_3` (`slug`),
  UNIQUE KEY `slug_4` (`slug`),
  UNIQUE KEY `slug_5` (`slug`),
  UNIQUE KEY `slug_6` (`slug`),
  UNIQUE KEY `slug_7` (`slug`),
  UNIQUE KEY `slug_8` (`slug`),
  UNIQUE KEY `slug_9` (`slug`),
  UNIQUE KEY `slug_10` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Categories`
--

LOCK TABLES `Categories` WRITE;
/*!40000 ALTER TABLE `Categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `Categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ContactSubmissions`
--

DROP TABLE IF EXISTS `ContactSubmissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ContactSubmissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('new','in_progress','resolved','archived') NOT NULL DEFAULT 'new',
  `source` varchar(255) NOT NULL DEFAULT 'contact_page',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ContactSubmissions`
--

LOCK TABLES `ContactSubmissions` WRITE;
/*!40000 ALTER TABLE `ContactSubmissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `ContactSubmissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Coupons`
--

DROP TABLE IF EXISTS `Coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Coupons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type` enum('percentage','fixed','free_shipping') NOT NULL DEFAULT 'percentage',
  `value` decimal(10,2) NOT NULL DEFAULT '0.00',
  `minOrderAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `maxDiscountAmount` decimal(10,2) DEFAULT NULL,
  `usageLimit` int DEFAULT NULL,
  `usageCount` int NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `startsAt` datetime DEFAULT NULL,
  `endsAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `code_2` (`code`),
  UNIQUE KEY `code_3` (`code`),
  UNIQUE KEY `code_4` (`code`),
  UNIQUE KEY `code_5` (`code`),
  UNIQUE KEY `code_6` (`code`),
  UNIQUE KEY `code_7` (`code`),
  UNIQUE KEY `code_8` (`code`),
  UNIQUE KEY `code_9` (`code`),
  UNIQUE KEY `code_10` (`code`),
  UNIQUE KEY `code_11` (`code`),
  UNIQUE KEY `code_12` (`code`),
  UNIQUE KEY `code_13` (`code`),
  UNIQUE KEY `code_14` (`code`),
  UNIQUE KEY `code_15` (`code`),
  UNIQUE KEY `code_16` (`code`),
  UNIQUE KEY `code_17` (`code`),
  UNIQUE KEY `code_18` (`code`),
  UNIQUE KEY `code_19` (`code`),
  UNIQUE KEY `code_20` (`code`),
  UNIQUE KEY `code_21` (`code`),
  UNIQUE KEY `code_22` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Coupons`
--

LOCK TABLES `Coupons` WRITE;
/*!40000 ALTER TABLE `Coupons` DISABLE KEYS */;
/*!40000 ALTER TABLE `Coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Orders`
--

DROP TABLE IF EXISTS `Orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer` json NOT NULL,
  `items` json NOT NULL,
  `totalAmount` decimal(10,2) NOT NULL,
  `shippingCost` decimal(10,2) DEFAULT '0.00',
  `status` enum('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  `paymentStatus` enum('pending','paid','failed') DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `paymentMethod` enum('cash_on_delivery','bank_transfer') NOT NULL DEFAULT 'cash_on_delivery',
  `notes` text,
  `userId` int DEFAULT NULL,
  `subtotalAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `discountAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `couponCode` varchar(255) DEFAULT NULL,
  `couponSnapshot` json DEFAULT NULL,
  `shippingSnapshot` json DEFAULT NULL,
  `orderAccessToken` varchar(255) DEFAULT NULL,
  `guestAccountToken` varchar(255) DEFAULT NULL,
  `guestConvertedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Orders`
--

LOCK TABLES `Orders` WRITE;
/*!40000 ALTER TABLE `Orders` DISABLE KEYS */;
INSERT INTO `Orders` VALUES (1,'{\"city\": \"Casablanca\", \"email\": \"achrafixo@gmail.com\", \"phone\": \"0617695452\", \"address\": \"Rue khaouarizmie app 7\", \"lastName\": \"Chihab\", \"firstName\": \"Achraf\", \"postalCode\": \"20000\"}','[{\"name\": \"CBD Relaxant\", \"slug\": \"cbd-relaxant\", \"image\": \"https://shop.somacan.ma/wp-content/uploads/2026/04/CBD-Relaxant-1.png\", \"price\": \"190.00\", \"quantity\": 3}]',570.00,0.00,'pending','pending','2026-05-05 16:01:22','2026-05-05 16:01:22','bank_transfer','',NULL,0.00,0.00,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `Orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Products`
--

DROP TABLE IF EXISTS `Products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `originalPrice` decimal(10,2) DEFAULT NULL,
  `category` enum('oil','body','face','hair','tea','wellness') NOT NULL,
  `images` json DEFAULT NULL,
  `mainImage` varchar(255) NOT NULL,
  `ingredients` json DEFAULT NULL,
  `benefits` json DEFAULT NULL,
  `usage` text,
  `inStock` tinyint(1) DEFAULT '1',
  `stockCount` int DEFAULT '0',
  `rating` float DEFAULT '0',
  `reviewCount` int DEFAULT '0',
  `isFeatured` tinyint(1) DEFAULT '0',
  `isBestseller` tinyint(1) DEFAULT '0',
  `tags` json DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `categoryId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `slug_2` (`slug`),
  UNIQUE KEY `slug_3` (`slug`),
  UNIQUE KEY `slug_4` (`slug`),
  UNIQUE KEY `slug_5` (`slug`),
  UNIQUE KEY `slug_6` (`slug`),
  UNIQUE KEY `slug_7` (`slug`),
  UNIQUE KEY `slug_8` (`slug`),
  UNIQUE KEY `slug_9` (`slug`),
  UNIQUE KEY `slug_10` (`slug`),
  UNIQUE KEY `slug_11` (`slug`),
  UNIQUE KEY `slug_12` (`slug`),
  UNIQUE KEY `slug_13` (`slug`),
  UNIQUE KEY `slug_14` (`slug`),
  UNIQUE KEY `slug_15` (`slug`),
  UNIQUE KEY `slug_16` (`slug`),
  UNIQUE KEY `slug_17` (`slug`),
  UNIQUE KEY `slug_18` (`slug`),
  UNIQUE KEY `slug_19` (`slug`),
  UNIQUE KEY `slug_20` (`slug`),
  UNIQUE KEY `slug_21` (`slug`),
  UNIQUE KEY `slug_22` (`slug`),
  UNIQUE KEY `slug_23` (`slug`),
  UNIQUE KEY `slug_24` (`slug`),
  UNIQUE KEY `slug_25` (`slug`),
  UNIQUE KEY `slug_26` (`slug`),
  UNIQUE KEY `slug_27` (`slug`),
  UNIQUE KEY `slug_28` (`slug`),
  UNIQUE KEY `slug_29` (`slug`),
  UNIQUE KEY `slug_30` (`slug`),
  UNIQUE KEY `slug_31` (`slug`),
  UNIQUE KEY `slug_32` (`slug`),
  UNIQUE KEY `slug_33` (`slug`),
  UNIQUE KEY `slug_34` (`slug`),
  UNIQUE KEY `slug_35` (`slug`),
  UNIQUE KEY `slug_36` (`slug`),
  UNIQUE KEY `slug_37` (`slug`),
  UNIQUE KEY `slug_38` (`slug`),
  UNIQUE KEY `slug_39` (`slug`),
  UNIQUE KEY `slug_40` (`slug`),
  UNIQUE KEY `slug_41` (`slug`),
  UNIQUE KEY `slug_42` (`slug`),
  UNIQUE KEY `slug_43` (`slug`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `Categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Products`
--

LOCK TABLES `Products` WRITE;
/*!40000 ALTER TABLE `Products` DISABLE KEYS */;
INSERT INTO `Products` VALUES (1,'CBD SOMMEIL','cbd-sommeil','Grâce à l’action combinée du CBD, de la mélatonine et de plantes apaisantes comme la valériane et la passiflore, cette formule aide à réguler naturellement le cycle du sommeil, réduire les réveils nocturnes et améliorer la qualité du repos.',195.00,NULL,'wellness','[\"https://shop.somacan.ma/wp-content/uploads/2026/04/CBD-SOMMEIL.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/CBD-SOMMEIL-1000x1000.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/CBD-SOMMEIL-1024x1024.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/CBD-SOMMEIL-768x768.png\"]','https://shop.somacan.ma/wp-content/uploads/2026/04/CBD-SOMMEIL.png','[]','[]','',1,33,4.7,25,1,1,'[\"Gamme de compléments\", \"CBD\", \"Somacan\"]','2026-05-05 10:20:10','2026-05-05 10:25:40',NULL),(2,'CBD Relaxant','cbd-relaxant','Idéal en période de stress ou de tension nerveuse. Ce complément associe avec huile de CBD, magnésium et extraits de plantes relaxantes (mélisse, camomille) pour apaiser l’esprit et relâcher le corps, tout en gardant clarté et énergie.',190.00,NULL,'wellness','[\"https://shop.somacan.ma/wp-content/uploads/2026/04/CBD-Relaxant-1.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/CBD-Relaxant-1-1000x1000.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/CBD-Relaxant-1-1024x1024.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/CBD-Relaxant-1-768x768.png\"]','https://shop.somacan.ma/wp-content/uploads/2026/04/CBD-Relaxant-1.png','[]','[]','',1,36,4.8,32,1,1,'[\"Gamme de compléments\", \"CBD\", \"Somacan\"]','2026-05-05 10:20:10','2026-05-05 10:25:40',NULL),(3,'CBD CHUTE DE CHEVEUX','cbd-chute-de-cheveux','Un complexe renforcé en huile de CBD, zinc, biotine et vitamines B5/B6 pour freiner la chute, stimuler la croissance et renforcer la fibre capillaire. Agit de l’intérieur pour soutenir la vitalité des cheveux au quotidien.',215.00,NULL,'hair','[\"https://shop.somacan.ma/wp-content/uploads/2026/04/CBD-CHUTE-DE-CHEVEUX.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/CBD-CHUTE-DE-CHEVEUX-1000x1000.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/CBD-CHUTE-DE-CHEVEUX-1024x1024.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/CBD-CHUTE-DE-CHEVEUX-768x768.png\"]','https://shop.somacan.ma/wp-content/uploads/2026/04/CBD-CHUTE-DE-CHEVEUX.png','[]','[]','',1,39,4.6,39,1,1,'[\"Gamme de compléments\", \"CBD\", \"Somacan\"]','2026-05-05 10:20:10','2026-05-05 10:25:40',NULL),(4,'CBD Antistress','cbd-antistress','Ce complément aide à mieux gérer le stress, équilibrer les réponses émotionnelles et renforcer la résistance mentale au quotidien.',225.00,NULL,'wellness','[\"https://shop.somacan.ma/wp-content/uploads/2026/04/CBD-Antistress.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/CBD-Antistress-1000x1000.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/CBD-Antistress-1024x1024.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/CBD-Antistress-768x768.png\"]','https://shop.somacan.ma/wp-content/uploads/2026/04/CBD-Antistress.png','[]','[]','',1,42,4.7,46,1,1,'[\"Gamme de compléments\", \"CBD\", \"Somacan\"]','2026-05-05 10:20:10','2026-05-05 10:25:40',NULL),(5,'Tisanes à base de CBD Thé Vert & Menthe','tisanes-a-base-de-cbd-the-vert-menthe','Un mélange naturel associant la fraîcheur de la menthe et les notes du thé vert, enrichi en CBD (de 5 à 10 mg). Faible en calories (3 kcal) et sans sucres, cette infusion favorise la digestion et procure une sensation de légèreté.',120.00,NULL,'tea','[\"https://shop.somacan.ma/wp-content/uploads/2026/04/ChatGPT-Image-24-avr.-2026-11_42_54.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/ChatGPT-Image-24-avr.-2026-11_42_54-1000x1000.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/ChatGPT-Image-24-avr.-2026-11_42_54-1024x1024.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/ChatGPT-Image-24-avr.-2026-11_42_54-768x768.png\"]','https://shop.somacan.ma/wp-content/uploads/2026/04/ChatGPT-Image-24-avr.-2026-11_42_54.png','[]','[]','',1,45,4.8,53,1,0,'[\"Tisanes\", \"CBD\", \"Somacan\"]','2026-05-05 10:20:10','2026-05-05 10:25:40',NULL),(6,'Tisanes à base de CBD Verveine','tisanes-a-base-de-cbd-verveine','Une infusion douce à base de verveine,de CBD (de 5 à 10 mg) pour un moment de détente naturel. Légère (1 kcal), sans sucres ni protéines, elle accompagne parfaitement vos instants de détente en fin de journée.',120.00,NULL,'tea','[\"https://shop.somacan.ma/wp-content/uploads/2026/04/ChatGPT-Image-24-avr.-2026-11_30_06.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/ChatGPT-Image-24-avr.-2026-11_30_06-1000x1000.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/ChatGPT-Image-24-avr.-2026-11_30_06-1024x1024.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/ChatGPT-Image-24-avr.-2026-11_30_06-768x768.png\"]','https://shop.somacan.ma/wp-content/uploads/2026/04/ChatGPT-Image-24-avr.-2026-11_30_06.png','[]','[]','',1,48,4.6,60,0,0,'[\"Tisanes\", \"CBD\", \"Somacan\"]','2026-05-05 10:20:10','2026-05-05 10:25:40',NULL),(7,'Soin intensif corps ARGAN','soin-intensif-corps-argan','Le soin intensif corps ELIXIR VERT à l’argan et au cannabis nourrit, répare et hydrate la peau en profondeur. Sa texture légère pénètre rapidement pour une peau douce, souple et lumineuse.',190.00,NULL,'body','[\"https://shop.somacan.ma/wp-content/uploads/2026/04/Soin-intensif-corps-ARGAN-Produit-2.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Soin-intensif-corps-ARGAN-Produit-2-1000x1000.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Soin-intensif-corps-ARGAN-Produit-2-1024x1024.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Soin-intensif-corps-ARGAN-Produit-2-768x768.png\"]','https://shop.somacan.ma/wp-content/uploads/2026/04/Soin-intensif-corps-ARGAN-Produit-2.png','[]','[\"💧 Hydratation intense et durable\", \"🌿 Nourrit en profondeur\", \"✨ Améliore l’élasticité de la peau\", \"🛡️ Protège contre le dessèchement\", \"🌟 Effet peau douce & lumineuse\", \"⚡ Absorption rapide (non gras)\", \"🔁 Idéal pour usage quotidien\"]','Appliquer sur peau propre, idéalement après la douche. Masser jusqu’à absorption complète. 👉 Insister sur les zones sèches : coudes, genoux, jambes, bras',1,51,4.7,67,0,0,'[\"Soins visage &amp; corps\", \"CBD\", \"Somacan\"]','2026-05-05 10:20:10','2026-05-05 10:25:40',NULL),(8,'Sérum Anti-Âge','serum-anti-age','Le sérum anti-âge ELIXIR VERT au cannabis hydrate, lisse les ridules et améliore la fermeté de la peau. Sa texture légère pénètre rapidement pour un teint plus éclatant et revitalisé.',140.00,NULL,'body','[\"https://shop.somacan.ma/wp-content/uploads/2026/04/Serum-Anti-Age-Produit-2.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Serum-Anti-Age-Produit-2-1000x1000.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Serum-Anti-Age-Produit-2-1024x1024.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Serum-Anti-Age-Produit-2-768x768.png\"]','https://shop.somacan.ma/wp-content/uploads/2026/04/Serum-Anti-Age-Produit-2.png','[]','[\"✨ Réduit l’apparence des rides et ridules\", \"💧 Hydratation intense et durable\", \"🌿 Effet antioxydant (protège contre le vieillissement)\", \"🔥 Améliore la fermeté et l’élasticité\", \"🌟 Redonne éclat et uniformité au teint\", \"⚡ Texture légère, non grasse\", \"🧬 Favorise la régénération de la peau\"]','Appliquer quelques gouttes sur une peau propre et sèche (visage et cou). Masser délicatement jusqu’à absorption complète. 👉 Utiliser matin et/ou soir 👉 Peut être combiné avec une crème hydratante',1,54,4.8,74,0,0,'[\"Soins visage &amp; corps\", \"CBD\", \"Somacan\"]','2026-05-05 10:20:10','2026-05-05 10:25:40',NULL),(9,'Huile relaxante','huile-relaxante','L’huile relaxante ELIXIR VERT au cannabis apaise le corps, soulage les tensions et favorise la détente. Idéale en massage, elle nourrit la peau tout en offrant un moment de bien-être profond.',170.00,NULL,'oil','[\"https://shop.somacan.ma/wp-content/uploads/2026/04/Huile-relaxanteProduit-2.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Huile-relaxanteProduit-2-1000x1000.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Huile-relaxanteProduit-2-1024x1024.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Huile-relaxanteProduit-2-768x768.png\"]','https://shop.somacan.ma/wp-content/uploads/2026/04/Huile-relaxanteProduit-2.png','[]','[\"🧘‍♂️ Favorise la détente et la relaxation\", \"💪 Aide à soulager les tensions musculaires\", \"🌿 Apaise le corps après l’effort ou le stress\", \"💧 Nourrit intensément la peau\", \"✨ Laisse la peau douce et satinée\", \"⚡ Texture idéale pour le massage\", \"🛌 Favorise un moment de bien-être avant le coucher\"]','Appliquer sur le corps en massage, en insistant sur les zones de tension (épaules, dos, jambes). Peut être utilisée :\naprès la douche\naprès le sport\navant le coucher pour favoriser la détente',1,57,4.6,81,0,0,'[\"Soins visage &amp; corps\", \"CBD\", \"Somacan\"]','2026-05-05 10:20:10','2026-05-05 10:25:40',NULL),(10,'Huile de Visage','huile-de-visage','L’huile visage ELIXIR VERT au cannabis hydrate, nourrit et rééquilibre la peau au quotidien. Sa texture légère pénètre rapidement pour une peau douce, apaisée et lumineuse.',140.00,NULL,'oil','[\"https://shop.somacan.ma/wp-content/uploads/2026/04/Huile-de-Visage-Produit-2.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Huile-de-Visage-Produit-2-1000x1000.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Huile-de-Visage-Produit-2-1024x1024.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Huile-de-Visage-Produit-2-768x768.png\"]','https://shop.somacan.ma/wp-content/uploads/2026/04/Huile-de-Visage-Produit-2.png','[]','[\"🌿 Hydrate intensément et durablement\", \"💧 Nourrit la peau en profondeur\", \"✨ Améliore l’éclat et l’uniformité du teint\", \"🛡️ Renforce la barrière cutanée\", \"❄️ Apaise les irritations et rougeurs\", \"💪 Améliore la souplesse et l’élasticité\", \"⚡ Texture légère, non grasse\", \"👩‍🦰 Convient à tous les types de peau\"]','Appliquer quelques gouttes sur le visage propre et sec, matin et/ou soir. Masser délicatement jusqu’à absorption complète. Peut être utilisée seule ou avant votre crème pour renforcer l’hydratation. Idéale également comme base de maquillage pour un effet glow naturel.',1,60,4.7,88,0,0,'[\"Soins visage &amp; corps\", \"CBD\", \"Somacan\"]','2026-05-05 10:20:10','2026-05-05 10:25:40',NULL),(11,'Huile de figue de barbarie','huile-de-figue-de-barbarie','L’huile ELIXIR VERT à la figue de barbarie est un soin anti-âge intensif enrichi en huile de cannabis (30%). Elle nourrit, régénère et illumine la peau tout en améliorant son élasticité. Sa texture légère pénètre rapidement pour une peau douce, hydratée et éclatante.',300.00,NULL,'oil','[\"https://shop.somacan.ma/wp-content/uploads/2026/04/Huile-de-figue-de-barbarie-Produit-2.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Huile-de-figue-de-barbarie-Produit-2-1000x1000.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Huile-de-figue-de-barbarie-Produit-2-1024x1024.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Huile-de-figue-de-barbarie-Produit-2-768x768.png\"]','https://shop.somacan.ma/wp-content/uploads/2026/04/Huile-de-figue-de-barbarie-Produit-2.png','[]','[\"🌿 Puissant effet anti-âge naturel\", \"✨ Atténue rides et ridules\", \"💧 Hydrate intensément et durablement\", \"🛡️ Protège la peau grâce aux antioxydants\", \"🌟 Redonne éclat et luminosité\", \"💪 Améliore l’élasticité et la fermeté\", \"⚡ Texture légère, non grasse\", \"👩‍🦰 Convient au visage et au corps\"]','Appliquer quelques gouttes sur peau propre et sèche (visage ou corps). Masser délicatement jusqu’à absorption complète. Peut être utilisée seule ou en complément de votre crème quotidienne. Idéale en soin de nuit pour une action réparatrice optimale.',1,63,4.8,95,0,0,'[\"Soins visage &amp; corps\", \"CBD\", \"Somacan\"]','2026-05-05 10:20:10','2026-05-05 10:25:40',NULL),(12,'Soin hydratant barbe & visage','soin-hydratant-barbe-visage','Formulé avec 0,5 % d’huile de graines de cannabis, ce soin hydrate profondément, revitalise la peau et facilite le coiffage de la barbe sans alourdir les poils. Parfait pour une routine quotidienne naturelle et efficace.',125.00,NULL,'face','[\"https://shop.somacan.ma/wp-content/uploads/2026/04/Soin-hydratant-barbe-visage-produit-packaging.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Soin-hydratant-barbe-visage-produit-packaging-1000x1000.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Soin-hydratant-barbe-visage-produit-packaging-1024x1024.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Soin-hydratant-barbe-visage-produit-packaging-768x768.png\"]','https://shop.somacan.ma/wp-content/uploads/2026/04/Soin-hydratant-barbe-visage-produit-packaging.png','[]','[\"💪 Aide à réduire la chute des cheveux\", \"🌿 Renforce la fibre capillaire\", \"🧬 Stimule le cuir chevelu\", \"💧 Nettoie sans dessécher\", \"🔥 Apporte volume et vitalité\", \"🌟 Améliore la densité capillaire\", \"⚡ Usage fréquent sans agression\"]','Appliquer sur cheveux mouillés. Masser le cuir chevelu pendant quelques secondes. Rincer abondamment. 👉 À utiliser 3 à 4 fois par semaine minimum 👉 Pour des résultats optimaux → routine complète',1,66,4.6,102,0,0,'[\"Gamme Homme Barbe &amp; Visage\", \"CBD\", \"Somacan\"]','2026-05-05 10:20:10','2026-05-05 10:25:40',NULL),(13,'Nettoyant barbe, visage & cheveux','nettoyant-barbe-visage-cheveux','Ce soin complet enrichi en huile de graines de cannabis nettoie délicatement tout en créant un environnement sain pour favoriser la croissance de la barbe et des cheveux. Parfait pour une routine simple et efficace.',130.00,NULL,'hair','[\"https://shop.somacan.ma/wp-content/uploads/2026/04/Nettoyant-barbe-visage-cheveux-produit-packaging.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Nettoyant-barbe-visage-cheveux-produit-packaging-1000x1000.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Nettoyant-barbe-visage-cheveux-produit-packaging-1024x1024.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Nettoyant-barbe-visage-cheveux-produit-packaging-768x768.png\"]','https://shop.somacan.ma/wp-content/uploads/2026/04/Nettoyant-barbe-visage-cheveux-produit-packaging.png','[]','[\"🧼 Nettoie barbe, visage et cheveux en un seul geste\", \"🌿 Formule douce adaptée à un usage quotidien\", \"💧 Hydrate et évite le dessèchement\", \"🔥 Apporte fraîcheur et sensation de propreté durable\", \"🧔 Adoucit la barbe et facilite le coiffage\", \"💇‍♂️ Respecte le cuir chevelu\", \"⚡ Gain de temps avec un produit tout-en-un\"]','Appliquer sur peau et cheveux mouillés. Faire mousser puis rincer abondamment. 👉 Utilisation quotidienne recommandée.',1,69,4.7,109,0,0,'[\"Gamme Homme Barbe &amp; Visage\", \"CBD\", \"Somacan\"]','2026-05-05 10:20:10','2026-05-05 10:25:40',NULL),(14,'Moustache wax','moustache-wax','Formulé avec des huiles précieuses (argan, cactus, ricin, sésame) et enrichi en beurre de karité, cire d’abeille et huile de graines de cannabis, ce baume assure une tenue ferme tout en nourrissant intensément, pour un style élégant et parfaitement structuré.',120.00,NULL,'face','[\"https://shop.somacan.ma/wp-content/uploads/2026/04/Moustache-wax-produit-packaging.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Moustache-wax-produit-packaging-1000x1000.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Moustache-wax-produit-packaging-1024x1024.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Moustache-wax-produit-packaging-768x768.png\"]','https://shop.somacan.ma/wp-content/uploads/2026/04/Moustache-wax-produit-packaging.png','[]','[\"🧔 Structure et discipline la moustache\", \"💪 Maintien longue durée sans effet carton\", \"🌿 Nourrit et protège le poil\", \"✨ Apporte une finition propre et naturelle\", \"🔥 Idéale pour styliser tous types de moustaches\", \"💧 Évite le dessèchement du poil\", \"🎯 Application facile et précise\"]','Prélever une petite quantité de cire, chauffer entre les doigts puis appliquer sur la moustache. Modeler selon le style souhaité :\nnaturel\nstructuré\ntwisté (handlebar 🔥)',1,72,4.8,116,0,0,'[\"Gamme Homme Barbe &amp; Visage\", \"CBD\", \"Somacan\"]','2026-05-05 10:20:10','2026-05-05 10:25:40',NULL),(15,'Huile à barbe','huile-a-barbe','Formulé à base d’huile de graines de cannabis, de beurre de karité et d’huiles végétales (argan, ricin, coco…), ce baume discipline la barbe tout en apaisant les démangeaisons et les irritations des premières pousses.',140.00,NULL,'oil','[\"https://shop.somacan.ma/wp-content/uploads/2026/04/Huile-a-barbe-produit-packaging-.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Huile-a-barbe-produit-packaging--1000x1000.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Huile-a-barbe-produit-packaging--1024x1024.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Huile-a-barbe-produit-packaging--768x768.png\"]','https://shop.somacan.ma/wp-content/uploads/2026/04/Huile-a-barbe-produit-packaging-.png','[]','[\"🌿 Nourrit et hydrate intensément la barbe\", \"🧔 Adoucit les poils et facilite le coiffage\", \"✨ Apporte brillance et aspect soigné\", \"❄️ Apaise les démangeaisons et irritations\", \"💪 Renforce le poil et améliore sa texture\", \"⚡ Texture légère, non grasse et rapidement absorbée\", \"🔁 Idéale pour un usage quotidien\"]','Prélever quelques gouttes à l’aide de la pipette, chauffer entre les mains puis appliquer sur la barbe propre et sèche. Masser pour bien répartir le produit jusqu’à la peau, puis coiffer selon le style souhaité. Utiliser quotidiennement pour un résultat optimal.',1,75,4.6,123,0,0,'[\"Gamme Homme Barbe &amp; Visage\", \"CBD\", \"Somacan\"]','2026-05-05 10:20:10','2026-05-05 10:25:40',NULL),(16,'Baume à barbe','baume-a-barbe','Formulé à base d’huile de graines de cannabis, de beurre de karité et d’huiles végétales (argan, ricin, coco…), ce baume discipline la barbe tout en apaisant les démangeaisons et les irritations des premières pousses.',110.00,NULL,'face','[\"https://shop.somacan.ma/wp-content/uploads/2026/04/Baume-a-Barbe-Produit-Packaging.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Baume-a-Barbe-Produit-Packaging-1000x1000.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Baume-a-Barbe-Produit-Packaging-1024x1024.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Baume-a-Barbe-Produit-Packaging-768x768.png\"]','https://shop.somacan.ma/wp-content/uploads/2026/04/Baume-a-Barbe-Produit-Packaging.png','[]','[\"🌿 Hydrate intensément la barbe et la peau\", \"🧔 Discipline les poils et facilite le coiffage\", \"💪 Renforce et protège la fibre capillaire\", \"❄️ Apaise les démangeaisons et irritations\", \"✨ Apporte douceur, brillance et aspect soigné\", \"🇲🇦 Produit issu du savoir-faire marocain\"]','Prélever une petite quantité de baume, chauffer entre les mains puis appliquer uniformément sur la barbe propre et sèche. Coiffer selon le style souhaité.',1,78,4.7,130,0,0,'[\"Gamme Homme Barbe &amp; Visage\", \"CBD\", \"Somacan\"]','2026-05-05 10:20:10','2026-05-05 10:25:40',NULL),(17,'Shampoing Anti Chute','shampoing-anti-chute','Formulé à base d’huile de graine de cannabis, ce shampooing nettoie en douceur tout en fortifiant la fibre capillaire pour limiter la chute due à la casse. Il hydrate en profondeur et laisse les cheveux souples, doux et revitalisés.',140.00,NULL,'face','[\"https://shop.somacan.ma/wp-content/uploads/2026/04/Shampoing-anti-chute-produit-packaging.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Shampoing-anti-chute-produit-packaging-1000x1000.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Shampoing-anti-chute-produit-packaging-1024x1024.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Shampoing-anti-chute-produit-packaging-768x768.png\"]','https://shop.somacan.ma/wp-content/uploads/2026/04/Shampoing-anti-chute-produit-packaging.png','[]','[\"💪 Aide à réduire la chute des cheveux\", \"🌿 Renforce la fibre capillaire\", \"🧬 Stimule le cuir chevelu\", \"💧 Nettoie sans dessécher\", \"🔥 Apporte volume et vitalité\", \"🌟 Améliore la densité capillaire\", \"⚡ Usage fréquent sans agression\"]','Appliquer sur cheveux mouillés. Masser le cuir chevelu pendant quelques secondes. Rincer abondamment. 👉 À utiliser 3 à 4 fois par semaine minimum 👉 Pour des résultats optimaux → routine complète',1,81,4.8,137,0,0,'[\"Gamme capilaire\", \"CBD\", \"Somacan\"]','2026-05-05 10:20:10','2026-05-05 10:25:40',NULL),(18,'Huile Anti Chute','huile-anti-chute','Une association d’huile de graines de cannabis et d’actifs végétaux (argan, ricin, avocat…) qui nourrit intensément les cheveux, aide à limiter leur chute et favorise leur croissance.',200.00,NULL,'oil','[\"https://shop.somacan.ma/wp-content/uploads/2026/04/HUILE-ANTI-CHUTE-produit-packaging-.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/HUILE-ANTI-CHUTE-produit-packaging--1000x1000.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/HUILE-ANTI-CHUTE-produit-packaging--1024x1024.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/HUILE-ANTI-CHUTE-produit-packaging--768x768.png\"]','https://shop.somacan.ma/wp-content/uploads/2026/04/HUILE-ANTI-CHUTE-produit-packaging-.png','[]','[\"🌿 Réduit la chute des cheveux\", \"💪 Renforce la fibre capillaire dès la racine\", \"🌱 Stimule la pousse et la densité capillaire\", \"Nourrit intensément le cuir chevelu\", \"❄️ Apaise les irritations et démangeaisons\", \"✨ Améliore la brillance et la vitalité des cheveux\", \"⚡ Texture légère, sans effet gras\"]','Appliquer quelques gouttes directement sur le cuir chevelu propre et sec ou légèrement humide. Masser délicatement du bout des doigts pour stimuler la circulation et favoriser l’absorption. Laisser agir sans rincer ou utiliser en bain d’huile avant shampoing. Utiliser régulièrement pour des résultats optimaux.',1,84,4.6,144,0,0,'[\"Gamme capilaire\", \"CBD\", \"Somacan\"]','2026-05-05 10:20:10','2026-05-05 10:25:40',NULL),(19,'Conditionneur demelant','conditionneur-demelant','Enrichi en huile de graines de cannabis, cet après-shampooing nourrit en profondeur, régénère et renforce la fibre capillaire. Il démêle efficacement tout en laissant les cheveux souples, doux et brillants durablement.',150.00,NULL,'face','[\"https://shop.somacan.ma/wp-content/uploads/2026/04/Conditionneur-demelant-produit-packaging_.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Conditionneur-demelant-produit-packaging_-1000x1000.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Conditionneur-demelant-produit-packaging_-1024x1024.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Conditionneur-demelant-produit-packaging_-768x768.png\"]','https://shop.somacan.ma/wp-content/uploads/2026/04/Conditionneur-demelant-produit-packaging_.png','[]','[\"🌿 Hydrate et nourrit intensément les cheveux\", \"🪮 Facilite le démêlage instantanément\", \"💪 Réduit la casse et renforce la fibre capillaire\", \"✨ Apporte douceur, brillance et souplesse\", \"🌱 N’alourdit pas les cheveux\", \"🔁 Idéal pour un usage quotidien\", \"🇲🇦 Formulé avec le savoir-faire marocain\"]','Après le shampooing, appliquer une noisette de produit sur cheveux mouillés, en insistant sur les longueurs et les pointes. Laisser agir 2 à 3 minutes, puis rincer abondamment. Pour un résultat optimal, utiliser régulièrement dans votre routine capillaire.',1,87,4.7,151,0,0,'[\"Gamme capilaire\", \"CBD\", \"Somacan\"]','2026-05-05 10:20:10','2026-05-05 10:25:40',NULL),(20,'Crème pour mains','creme-pour-mains','La crème mains ELIXIR VERT au cannabis hydrate, protège et répare les mains au quotidien. Sa texture légère pénètre rapidement pour des mains douces, souples et parfaitement nourries.',100.00,NULL,'body','[\"https://shop.somacan.ma/wp-content/uploads/2026/04/Creme-pour-mains-produit-1.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Creme-pour-mains-produit-1-1000x1000.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Creme-pour-mains-produit-1-1024x1024.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Creme-pour-mains-produit-1-768x768.png\"]','https://shop.somacan.ma/wp-content/uploads/2026/04/Creme-pour-mains-produit-1.png','[]','[\"🌿 Hydrate intensément et durablement les mains\", \"🛡️ Protège contre le froid, le dessèchement et les agressions\", \"✨ Répare les mains sèches et abîmées\", \"💧 Améliore la souplesse et la douceur de la peau\", \"⚡ Texture légère, non grasse et absorption rapide\", \"👜 Format pratique à emporter partout\", \"🔁 Idéale pour un usage quotidien\"]','Appliquer une petite quantité sur les mains propres et sèches. Masser délicatement jusqu’à absorption complète, en insistant sur les zones sèches et les cuticules. Renouveler l’application aussi souvent que nécessaire au cours de la journée.',1,90,4.8,158,0,0,'[\"Crème visage &amp; corps\", \"CBD\", \"Somacan\"]','2026-05-05 10:20:10','2026-05-05 10:25:40',NULL),(21,'Crème pour le corps','creme-pour-le-corps','Cette crème pour le corps, enrichie en huile de graines de cannabis, hydrate intensément, nourrit la peau en profondeur et apaise les tiraillements. Sa texture onctueuse pénètre rapidement, laissant la peau douce, souple et délicatement parfumée.',150.00,NULL,'body','[\"https://shop.somacan.ma/wp-content/uploads/2026/04/Creme-pour-le-corps-produit-packaging-.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Creme-pour-le-corps-produit-packaging--1000x1000.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Creme-pour-le-corps-produit-packaging--1024x1024.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Creme-pour-le-corps-produit-packaging--768x768.png\"]','https://shop.somacan.ma/wp-content/uploads/2026/04/Creme-pour-le-corps-produit-packaging-.png','[]','[\"🌿 Hydrate intensément et durablement la peau\", \"💧 Nourrit en profondeur et restaure le confort cutané\", \"✨ Améliore la souplesse et l’élasticité\", \"❄️ Apaise les sensations de tiraillement et de sécheresse\", \"🛡️ Protège la peau des agressions extérieures\", \"🌱 Texture onctueuse, non grasse et rapidement absorbée\", \"🔁 Idéale pour un usage quotidien\"]','Appliquer quotidiennement sur peau propre et sèche, de préférence après la douche. Masser délicatement jusqu’à absorption complète, en insistant sur les zones sèches (coudes, genoux, jambes).',1,93,4.6,165,0,0,'[\"Crème visage &amp; corps\", \"CBD\", \"Somacan\"]','2026-05-05 10:20:10','2026-05-05 10:25:40',NULL),(22,'Crème de nuit','creme-de-nuit','La crème de nuit à l’huile de graines de cannabis hydrate, régénère et revitalise la peau pendant le sommeil, pour un teint frais et lumineux au réveil.',130.00,NULL,'body','[\"https://shop.somacan.ma/wp-content/uploads/2026/04/Creme-de-nuit-produit-packaging-.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Creme-de-nuit-produit-packaging--1000x1000.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Creme-de-nuit-produit-packaging--1024x1024.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/Creme-de-nuit-produit-packaging--768x768.png\"]','https://shop.somacan.ma/wp-content/uploads/2026/04/Creme-de-nuit-produit-packaging-.png','[]','[\"🌿 Nourrit intensément la peau pendant la nuit\", \"🔄 Favorise la régénération cellulaire\", \"💧 Répare et restaure l’hydratation cutanée\", \"✨ Améliore la texture et l’éclat de la peau\", \"😌 Apaise les peaux fatiguées ou stressées\", \"🌙 Idéale pour une routine nocturne complète\", \"🌱 Convient à tous les types de peau\"]','Appliquer chaque soir sur une peau propre et sèche, sur le visage et le cou. Masser délicatement jusqu’à absorption complète. Pour de meilleurs résultats, utiliser en complément de la crème de jour ELIXIR VERT.',1,96,4.7,172,0,0,'[\"Crème visage &amp; corps\", \"CBD\", \"Somacan\"]','2026-05-05 10:20:10','2026-05-05 10:25:40',NULL),(23,'Crème de jour','creme-de-jour','Cette crème de jour, formulée à l’huile de graines de cannabis, hydrate la peau en profondeur, la protège des agressions extérieures et lui apporte éclat et souplesse tout au long de la journée. Sa texture légère pénètre rapidement sans laisser de film gras.',140.00,NULL,'body','[\"https://shop.somacan.ma/wp-content/uploads/2026/04/creme-de-jour-produit-packaging-.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/creme-de-jour-produit-packaging--1000x1000.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/creme-de-jour-produit-packaging--1024x1024.png\", \"https://shop.somacan.ma/wp-content/uploads/2026/04/creme-de-jour-produit-packaging--768x768.png\"]','https://shop.somacan.ma/wp-content/uploads/2026/04/creme-de-jour-produit-packaging-.png','[]','[]','',1,99,4.8,179,0,0,'[\"Crème visage &amp; corps\", \"CBD\", \"Somacan\"]','2026-05-05 10:20:10','2026-05-05 10:25:40',NULL);
/*!40000 ALTER TABLE `Products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SiteContents`
--

DROP TABLE IF EXISTS `SiteContents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SiteContents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pageKey` varchar(255) NOT NULL,
  `sectionKey` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `contentType` enum('hero','section','menu','theme','footer','form') NOT NULL DEFAULT 'section',
  `content` json NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `sortOrder` int NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `site_contents_page_key_section_key` (`pageKey`,`sectionKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SiteContents`
--

LOCK TABLES `SiteContents` WRITE;
/*!40000 ALTER TABLE `SiteContents` DISABLE KEYS */;
/*!40000 ALTER TABLE `SiteContents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `StoreSettings`
--

DROP TABLE IF EXISTS `StoreSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `StoreSettings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `scope` varchar(255) NOT NULL DEFAULT 'default',
  `baseShippingCost` decimal(10,2) NOT NULL DEFAULT '30.00',
  `freeShippingThreshold` decimal(10,2) DEFAULT '400.00',
  `cityRates` json NOT NULL,
  `allowGuestCheckout` tinyint(1) NOT NULL DEFAULT '1',
  `guestAccountInviteEnabled` tinyint(1) NOT NULL DEFAULT '1',
  `currency` varchar(255) NOT NULL DEFAULT 'MAD',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `scope` (`scope`),
  UNIQUE KEY `scope_2` (`scope`),
  UNIQUE KEY `scope_3` (`scope`),
  UNIQUE KEY `scope_4` (`scope`),
  UNIQUE KEY `scope_5` (`scope`),
  UNIQUE KEY `scope_6` (`scope`),
  UNIQUE KEY `scope_7` (`scope`),
  UNIQUE KEY `scope_8` (`scope`),
  UNIQUE KEY `scope_9` (`scope`),
  UNIQUE KEY `scope_10` (`scope`),
  UNIQUE KEY `scope_11` (`scope`),
  UNIQUE KEY `scope_12` (`scope`),
  UNIQUE KEY `scope_13` (`scope`),
  UNIQUE KEY `scope_14` (`scope`),
  UNIQUE KEY `scope_15` (`scope`),
  UNIQUE KEY `scope_16` (`scope`),
  UNIQUE KEY `scope_17` (`scope`),
  UNIQUE KEY `scope_18` (`scope`),
  UNIQUE KEY `scope_19` (`scope`),
  UNIQUE KEY `scope_20` (`scope`),
  UNIQUE KEY `scope_21` (`scope`),
  UNIQUE KEY `scope_22` (`scope`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `StoreSettings`
--

LOCK TABLES `StoreSettings` WRITE;
/*!40000 ALTER TABLE `StoreSettings` DISABLE KEYS */;
INSERT INTO `StoreSettings` VALUES (1,'default',30.00,400.00,'[]',1,1,'MAD','2026-05-06 12:07:27','2026-05-06 12:07:27');
/*!40000 ALTER TABLE `StoreSettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Testimonials`
--

DROP TABLE IF EXISTS `Testimonials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Testimonials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `text` text NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Testimonials`
--

LOCK TABLES `Testimonials` WRITE;
/*!40000 ALTER TABLE `Testimonials` DISABLE KEYS */;
/*!40000 ALTER TABLE `Testimonials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `addressLine1` varchar(255) DEFAULT NULL,
  `addressLine2` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `postalCode` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT 'Maroc',
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `locationLabel` varchar(255) DEFAULT NULL,
  `role` enum('customer','admin') NOT NULL DEFAULT 'customer',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `email_23` (`email`),
  UNIQUE KEY `email_24` (`email`),
  UNIQUE KEY `email_25` (`email`),
  UNIQUE KEY `email_26` (`email`),
  UNIQUE KEY `email_27` (`email`),
  UNIQUE KEY `email_28` (`email`),
  UNIQUE KEY `email_29` (`email`),
  UNIQUE KEY `email_30` (`email`),
  UNIQUE KEY `email_31` (`email`),
  UNIQUE KEY `email_32` (`email`),
  UNIQUE KEY `email_33` (`email`),
  UNIQUE KEY `email_34` (`email`),
  UNIQUE KEY `email_35` (`email`),
  UNIQUE KEY `email_36` (`email`),
  UNIQUE KEY `email_37` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'Achraf','Chihab','achrafixo@gmail.com','$2a$10$uMVSvp2gMe3deIctOJmpu.hGyBRKM1c/sTtagp/qrV8H4qlqHxjES','+212617695452','2026-05-06 11:20:30','2026-05-06 11:54:49','Sidi Maârouf','Sidi Maârouf','Casablanca','20001','Maroc',33.5435408,-7.6423645,'Sidi Maârouf, Arrondissement d\'Aïn-Chock, Préfecture d\'arrondissement d\'Aïn Chock, Casablanca, Pachalik de Casablanca, Préfecture de Casablanca, Casablanca-Settat, 20001, Maroc','customer');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-06 14:24:55
