CREATE LOGIN [DbUser] WITH PASSWORD = 'changeme'
GO

CREATE DATABASE [MyDb]
GO

USE [MyDb]

CREATE ROLE db_executor
GO
GRANT EXECUTE TO db_executor
GO

CREATE USER [DbUser] FOR LOGIN [DbUser] WITH DEFAULT_SCHEMA=[db_datareader]
GO
ALTER ROLE [db_datareader] ADD MEMBER [DbUser]
GO
ALTER ROLE [db_datawriter] ADD MEMBER [DbUser]
GO
ALTER ROLE [db_executor] ADD MEMBER [DbUser]
GO
