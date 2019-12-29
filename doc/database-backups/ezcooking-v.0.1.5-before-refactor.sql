-- MySQL dump 10.13  Distrib 5.7.28, for Linux (x86_64)
--
-- Host: localhost    Database: ezcooking
-- ------------------------------------------------------
-- Server version	5.7.28-0ubuntu0.18.04.4

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category_category`
--

DROP TABLE IF EXISTS `category_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_category`
--

LOCK TABLES `category_category` WRITE;
/*!40000 ALTER TABLE `category_category` DISABLE KEYS */;
INSERT INTO `category_category` VALUES (2,'Getränke'),(3,'Beilage'),(4,'Süßspeise/Dessert'),(5,'Frühstück'),(6,'Hauptspeise'),(7,'Salat'),(8,'Suppe'),(9,'Vorspeise'),(10,'weitere Ernährungskonzepte');
/*!40000 ALTER TABLE `category_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_subcategory`
--

DROP TABLE IF EXISTS `category_subcategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category_subcategory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` int(11) NOT NULL,
  `image_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category` (`category`),
  CONSTRAINT `category_subcategory_ibfk_1` FOREIGN KEY (`category`) REFERENCES `category_category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_subcategory`
--

LOCK TABLES `category_subcategory` WRITE;
/*!40000 ALTER TABLE `category_subcategory` DISABLE KEYS */;
INSERT INTO `category_subcategory` VALUES (19,'Brot und Brötchen',4,'brot-und-broetchen'),(20,'Cremes',4,'cremes'),(21,'Eis',4,'eis'),(22,'Kekse & Plätzchen',4,'no_image'),(23,'Konfiserie',4,'konfiserie'),(24,'Kuchen',4,'no_image'),(25,'Shake',2,'no_image'),(26,'Cocktail',2,'no_image'),(27,'Gemüse',3,'no_image'),(28,'Kartoffeln',3,'no_image'),(29,'Klöße',3,'no_image'),(30,'Nudeln',3,'no_image'),(31,'Reis/Getreide',3,'no_image'),(32,'Eier',6,'no_image'),(33,'Eintopf',6,'no_image'),(34,'Fisch',6,'no_image'),(35,'Geflügel',6,'no_image'),(36,'Gemüse',6,'no_image'),(37,'Hülsenfrüchte',6,'no_image'),(38,'Innereien',6,'no_image'),(39,'Kartoffeln',6,'no_image'),(40,'Krustentier & Muscheln',6,'no_image'),(41,'Lamm & Ziege',6,'no_image'),(42,'Pasta & Nudeln',6,'no_image'),(43,'Pilze',6,'no_image'),(44,'Pizza',6,'no_image'),(45,'Reis/Getreide',6,'no_image'),(46,'Rind',6,'no_image'),(47,'Schwein',6,'no_image'),(48,'Wild & Kaninchen',6,'no_image'),(49,'Eier & Käse',7,'no_image'),(50,'Fleisch & Wurst',7,'no_image'),(51,'Früchte',7,'no_image'),(52,'Gemüse',7,'no_image'),(53,'Kartoffel',7,'no_image'),(54,'Krustentier & Fisch',7,'no_image'),(55,'Pilze',7,'no_image'),(56,'Reis/Nudeln/Getreide',7,'no_image'),(57,'Salatdressing',7,'no_image'),(58,'Warme Salate',7,'no_image'),(59,'Einlage',8,'no_image'),(60,'Gebunden',8,'no_image'),(61,'Klar',8,'no_image'),(62,'Spezial',8,'no_image'),(63,'Kalt',9,'no_image'),(64,'Warm',9,'no_image'),(65,'Diabetiker',10,'no_image'),(66,'Fettarm',10,'no_image'),(67,'Kalorienarm',10,'no_image'),(68,'Trennkost',10,'no_image'),(69,'Vegan',10,'no_image'),(70,'Vegetarisch',10,'no_image'),(71,'High Carb Low Fat',10,'no_image'),(72,'Ketogen',10,'no_image'),(73,'Süß',5,'no_image'),(74,'Herzhaft',5,'no_image');
/*!40000 ALTER TABLE `category_subcategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_unit`
--

DROP TABLE IF EXISTS `category_unit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category_unit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `short_name` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `short_name` (`short_name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_unit`
--

LOCK TABLES `category_unit` WRITE;
/*!40000 ALTER TABLE `category_unit` DISABLE KEYS */;
INSERT INTO `category_unit` VALUES (1,'Gramm','g',1),(2,'Kilogramm','kg',1),(3,'Milliliter','ml',1),(4,'Liter','l',1),(5,'Teelöffel','TL',1),(6,'Esslöffel','EL',1),(7,'Stück','st',1);
/*!40000 ALTER TABLE `category_unit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dish`
--

DROP TABLE IF EXISTS `dish`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dish` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration` int(11) NOT NULL,
  `short_description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preparation` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `creation_date` bigint(20) NOT NULL,
  `creator_id` int(11) NOT NULL,
  `category` int(11) NOT NULL,
  `subcategory` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `creator_id` (`creator_id`),
  KEY `category` (`category`),
  KEY `subcategory` (`subcategory`),
  CONSTRAINT `dish_ibfk_2` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`),
  CONSTRAINT `dish_ibfk_3` FOREIGN KEY (`category`) REFERENCES `category_category` (`id`),
  CONSTRAINT `dish_ibfk_4` FOREIGN KEY (`subcategory`) REFERENCES `category_subcategory` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dish`
--

LOCK TABLES `dish` WRITE;
/*!40000 ALTER TABLE `dish` DISABLE KEYS */;
INSERT INTO `dish` VALUES (106,'Nutella-Eis',120,'Da hast was drauf ','65949335016083c9c158adc88f65729a','<p>Alles in eine Schüssel bzw. einen Handmixer geben, und gut verrühren oder mixen. Joghurt je nach gewünschter Süße untermischen. </p><p>Die Masse in eine geeignete Eisform (Tupper, bzw. kleine Joghurtbecher mit Löffelstiel) geben und mind. 2h tiefkühlen.&nbsp; Reicht für 8-10 Eisförmchen von Tupper.</p><p>Nach dem entnehmen die Hülle kurz unter heißes Wasser halten und das&nbsp; Joghurt-Nutella-Eis auf der Zunge zergehen lassen.</p>',1577391536872,10,4,21),(107,'Pfälzer Kartoffelsalat',30,'Kartoffelsalat mit Speck','6f74f3d8a6fa0cf21835ebd664fbf3bc','<ul><li>Mittelgroße Kartoffeln mit Schale kochen (Schnellkochtopf ca 10 Minuten).</li><li>Anschließend schälen, abkühlen lassen und in Scheiben schneiden.</li><li>Kleingeschnittene Zwiebeln in der Pfanne anbräunen dann aus der Pfanne in eine Schale geben und auf die Seite stellen.\r\n\r\n</li><li>Nun den Speck in der Pfanne knusprig werden lassen. \r\n\r\n</li><li>Salatkräuter in eine Salatschüssel, dazu Öl, Gemüsebrühe, Salz, Pfeffer und Muskat und mit Wasser verdünnen. Anschließend abschmecken.\r\n\r\n</li><li>Die Kartoffeln, warmen Zwiebeln und den warmen Speck mit dem Fett aus der Pfanne dazugeben, zum Schluss gehackte Petersilie dazugeben.</li></ul><p>Guten Appetit</p>',1576938653939,8,7,53),(108,'Dimlimo',15,'Asiatischer Eintopf','9c5f56e71ff37af88b78b5194fe20915','Alle Zutaten in folgender Reihenfolge in einen Topf geben - Einschalten - Fertig!\r\n\r\n1. Kartoffeln würfeln, Paprika schneiden, Fleisch würfeln, Tomaten in Scheiben schneiden, Kraut raspeln,   Zwiebel in Ringe schneiden.\r\n2. Öl in den Topf geben (Topf-Boden gut bedeckt)\r\n3. Fleisch in den Topf geben und salzen\r\n4. Zwiebeln und Knoblauch auf dem Fleisch verteilen\r\n5. Kartoffeln in den Topf geben und salzen\r\n6. Zwiebeln auf den Kartoffeln verteilen\r\n7. Kraut in den Topf geben, salzen und mit Zwiebeln bedecken\r\n8. Paprika in den Topf geben und salzen\r\n9. Tomaten in den Topf geben, salzen und pfeffern\r\n10. Seitlich ungeschälten Knoblauch reinstecken\r\n \r\nKurz auf hoher Temperatur anbraten, danach ca 1. Stunde auf mittlerer - niedriger Temperatur garen lassen.',1571696961114,9,6,33),(112,'Walnußmakronen',15,'','9304e13b13327de1f62882c4867b3145','<p>Das Eiweiß mit einem elektrischen Handrührgerät steif schlagen, daß ein Messerschnitt sichtbar bleibt. Den gesiebten Puderzucker und das Aroma hinzufügen und über kochendem, von der Kochstelle genommenem Wasser so lange weiter schlagen, bis die Masse glänzt. Die Walnußkerne vorsichtig unterheben (nicht rühren). Mit 2 Teelöffeln Häufchen auf ein mit gefettetem Pergamentpapier belegtes Backblech setzen.</p><p><span style=\"font-size: 0.9375rem;\">Strom: 125-150 Grad (vorgeheizt)</span></p><p><span style=\"font-size: 0.9375rem;\">Gas: 1-2</span></p><p><span style=\"font-size: 0.9375rem;\">Backzeit: 20-25 Minuten</span></p>',1576529922446,11,4,22),(113,'Doce de Leite ',30,'süßer Brotaufstrich auf die schnelle','e449240f350ca803516da4ebcef259f7','<p>1. Entferne das Etikett von der Kondensmilchdose</p><p>2. Fülle den Schnellkochtop mit Wasser, sodass die Dose gut im wasser schwimmt (mind 1cm sollte das Wasser ueber der Dose sein) </p><p>3. Kochen lassen für 25-30 min. </p><p>4. Dose vorsichtig rausholen und mit kaltem Wasser abschrecken. </p><p>5. Abkühlen lassen </p><p>6. Dose öffnen und geniessen! </p><p><br></p><p>ps.: In einem normalen Topf muss die Dose mindestens 45min kochen <br></p>',1576938653915,13,4,20),(114,'Pastel',80,'Frittierter Brasilianischer Teig Snack','44b4edfebbdd9e61938ff8e48a7a3bb1','<p><b>Teig</b><br></p><p><br></p><p>1. Mix das Mehl, den Salz und die Hefe in einer Schüssel </p><p>2. Danach die Eier dazu geben und das ganze mit einer Gabel gut vermischen </p><p>3. Anschließend die Butter und die Milch hineinmixen bis es zu einem geschmeidigen Teig wird</p><p>4. Das ganze wird dann schön glatt ausgerollt und für mindestens 45min - 1 std abkühlen lassen </p><p>5. Jetzt kann der glatte Teig zu jeglichen grössen geteilt werden, damit später die Füllung reinpasst und der Teig zugefaltet werden kann, damit nichts von der Füllung rausläuft </p><p><br></p><p><b>Füllung</b></p><p>1. Sobald der Teig zurecht geschnitten wurde kann die Füllung beginnen </p><p>2. Hier kann man mit allen möglichen Zutaten variieren </p><p>3. z.B: Frischkäse in einer Schale mit Zwiebeln, Petersilie, Salz, Pfeffer, kleingeschnittenem Käse und Schinken mixen </p><p>4. Danach die Füllung mit einem Löffel in den Teig legen und anschließend so zuklappen damit es fest und dicht ist </p><p>5. Ab in die Fritöse und rausholen wenn der Teig Goldbraun ist<br></p><p><br></p><p><br></p><p><br></p><p><br></p>',1576949144168,13,4,19);
/*!40000 ALTER TABLE `dish` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dish_ingredients`
--

DROP TABLE IF EXISTS `dish_ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dish_ingredients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `count` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dish_id` int(11) NOT NULL,
  `ingredient_id` int(11) NOT NULL,
  `count_unit` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `dish_id` (`dish_id`),
  KEY `ingredient_id` (`ingredient_id`),
  KEY `count_unit` (`count_unit`),
  CONSTRAINT `dish_ingredients_ibfk_1` FOREIGN KEY (`dish_id`) REFERENCES `dish` (`id`),
  CONSTRAINT `dish_ingredients_ibfk_2` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredient` (`id`),
  CONSTRAINT `dish_ingredients_ibfk_3` FOREIGN KEY (`count_unit`) REFERENCES `category_unit` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=335 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dish_ingredients`
--

LOCK TABLES `dish_ingredients` WRITE;
/*!40000 ALTER TABLE `dish_ingredients` DISABLE KEYS */;
INSERT INTO `dish_ingredients` VALUES (120,'500',108,44,1),(121,'500',108,45,1),(122,'5',108,48,7),(123,'4',108,49,7),(124,'1',108,50,7),(125,'1',108,51,7),(126,'4',108,52,7),(273,'2',112,78,7),(274,'100',112,79,1),(275,'0,5',112,83,7),(276,'200',112,81,1),(288,'1',113,84,7),(289,'1',107,36,2),(290,'250',107,75,1),(291,'100',107,38,1),(292,'1',107,76,7),(293,'1',107,40,7),(294,'1',107,33,7),(295,'1',107,39,7),(296,'1',107,41,7),(297,'50',107,77,3),(298,'10',107,67,1),(309,'1',114,85,2),(310,'2',114,86,7),(311,'4',114,56,6),(312,'250',114,87,3),(313,'1',114,33,5),(314,'1',114,88,5),(315,'1',114,89,7),(316,'1',114,90,7),(317,'1',114,91,7),(318,'1',114,92,7),(331,'4',106,34,6),(332,'250',106,58,3),(333,'100/200',106,93,1),(334,'1',106,94,6);
/*!40000 ALTER TABLE `dish_ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `favorites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `dish_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `dish_id` (`dish_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`dish_id`) REFERENCES `dish` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingredient`
--

DROP TABLE IF EXISTS `ingredient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ingredient` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredient`
--

LOCK TABLES `ingredient` WRITE;
/*!40000 ALTER TABLE `ingredient` DISABLE KEYS */;
INSERT INTO `ingredient` VALUES (51,'1/2 Weißkrautkopf'),(73,'arrrr'),(72,'asd'),(65,'asdasd'),(64,'asdasdasd'),(66,'asdasdff'),(90,'Bacon, Hack, Salami, Käse, Lachs'),(35,'Brot'),(56,'Butter'),(80,'Butter-Vanille-Aroma'),(86,'Eier'),(78,'Eiweiß'),(89,'Fett, Öl'),(82,'Flächen Butter-Vanille-Aroma'),(83,'Fläschchen Butter-Vanille-Aroma'),(55,'Fondor'),(92,'Frischkäse'),(40,'Gemüsebrühe'),(81,'Geviertelte Walnußkerne'),(75,'gewürfelten Schinkenspeck'),(37,'gewürfelten Speck'),(88,'Hefe'),(57,'Kartoffelbreipulver'),(44,'Kartoffeln'),(71,'Käse'),(69,'Ketchup'),(49,'Knoblauchzeh'),(76,'Knorr-Salatkrönung-Gartenkräuter'),(84,'Kondensmilch (Dose, eg. Milchmädchen)'),(54,'Maggi'),(85,'Mehl'),(87,'Milch'),(41,'Muskat'),(61,'Muskatnuss'),(63,'Nasenkaffe'),(93,'Naturjoghurt'),(53,'Nudeln'),(34,'Nutella'),(77,'Öl'),(50,'Paprika Rot'),(36,'Pellkartoffeln'),(42,'Petersielie'),(67,'Petersilie'),(39,'Pfeffer'),(91,'Pilze, Tomaten, Petersilie, ...'),(79,'Puderzucker'),(59,'Röstzwiebel'),(58,'Sahne'),(70,'Salami'),(43,'Salatkräuter'),(33,'Salz'),(45,'Schweinenacken'),(74,'sdfsdsdfff'),(68,'Spaghetti'),(47,'Test'),(46,'Tomaten'),(48,'Tomaten Mittelgroß'),(60,'Wasser'),(62,'Zigaretten'),(94,'Zucker'),(52,'Zwiebel'),(38,'Zwiebeln');
/*!40000 ALTER TABLE `ingredient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@ezlife.eu','$2y$10$Lh4AlHQxsZ065eb39ZpH2.ar7GywLu3OLnAXTU9KUciSsUfp9DhwO','A'),(8,'ajo','fjnalta@gmail.com','$2a$10$0cm1Lk8DHHpmxxIrFQYKueQiRyGYB7qjqJa/nFY8XUvwV1oIo8wUa','U'),(9,'Imes','marcel_schultz@gmx.net','$2a$10$aNMnhDJG33XzZmXZlBEHV.KRuhwdtRmiXF4i0IjU.PDGP2jIHOhQS','U'),(10,'eise','p.ironman@ezlife.eu','$2a$10$UnTp4rPEufjgPkVIb6e0Q.sy1tE8plXAmUIdGhBKhyBUF5qvEHdUm','U'),(11,'RERUMI','r_minges@gmx.de','$2a$10$GA0XoHOCjMRLfvN1PdNqsO1YYbuNzyQMK8nqbK4p9FpngAWI2Kd0a','U'),(12,'InkassoHenry','jonaskuntz@web.de','$2a$10$utDv6GH0rDVB9X6Td.ThT.hJmwUlv6S7su5JPnqc53Y8Y.a4QSaRm','U'),(13,'shampoo','j-p.cloedy','$2a$10$bu1z75/6T8Pfe7dI0ix3VOdBRCChHRNKcditfIkuFvhl/wiPlBNl.','U'),(14,'','','$2a$10$cZGas8mbe2j6ImT4/fCNBekK8WxO9aXIHYNHFO5VXsRQEv1GhLD0m','U');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-12-29 17:47:18
