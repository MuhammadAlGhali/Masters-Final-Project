-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 31, 2022 at 07:32 PM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `password-vault`
--

-- --------------------------------------------------------

--
-- Table structure for table `cards`
--

CREATE TABLE `cards` (
  `user` varchar(120) NOT NULL,
  `category` varchar(120) NOT NULL DEFAULT 'card',
  `username` varchar(120) NOT NULL,
  `cardnumber` varchar(256) NOT NULL,
  `pin` varchar(256) DEFAULT NULL,
  `expirymonth` int(11) DEFAULT NULL,
  `expiryyear` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `holdername` varchar(60) NOT NULL,
  `cardtype` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `Identity`
--

CREATE TABLE `Identity` (
  `user` varchar(120) NOT NULL,
  `category` varchar(120) NOT NULL DEFAULT 'identity',
  `username` varchar(120) NOT NULL,
  `ifirstname` text DEFAULT NULL,
  `imiddlename` text DEFAULT NULL,
  `ilastname` text DEFAULT NULL,
  `iname` varchar(60) NOT NULL,
  `iemail` varchar(120) DEFAULT NULL,
  `iphone` varchar(120) DEFAULT NULL,
  `issn` varchar(256) DEFAULT NULL,
  `ipassport` varchar(256) DEFAULT NULL,
  `ilicense` varchar(256) DEFAULT NULL,
  `iaddress1` text DEFAULT NULL,
  `iaddress2` text DEFAULT NULL,
  `iaddress3` text DEFAULT NULL,
  `icity` text DEFAULT NULL,
  `istate` text DEFAULT NULL,
  `icountry` text DEFAULT NULL,
  `izip` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `email` varchar(120) NOT NULL,
  `firstname` varchar(30) DEFAULT NULL,
  `lastname` varchar(30) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `password` varchar(120) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `websitepasswords`
--

CREATE TABLE `websitepasswords` (
  `user` varchar(120) NOT NULL,
  `category` varchar(120) NOT NULL DEFAULT 'websitepassword',
  `username` varchar(120) NOT NULL,
  `url` varchar(256) NOT NULL,
  `pass` text DEFAULT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cards`
--
ALTER TABLE `cards`
  ADD PRIMARY KEY (`user`,`category`,`username`,`holdername`) USING BTREE;

--
-- Indexes for table `Identity`
--
ALTER TABLE `Identity`
  ADD PRIMARY KEY (`user`,`category`,`username`,`iname`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `websitepasswords`
--
ALTER TABLE `websitepasswords`
  ADD PRIMARY KEY (`user`,`category`,`username`,`url`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cards`
--
ALTER TABLE `cards`
  ADD CONSTRAINT `cards_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Identity`
--
ALTER TABLE `Identity`
  ADD CONSTRAINT `identity_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `websitepasswords`
--
ALTER TABLE `websitepasswords`
  ADD CONSTRAINT `websitepasswords_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
