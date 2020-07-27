Write-Host "Creating database"
docker-compose exec sqlserver /opt/mssql-tools/bin/sqlcmd -H localhost -U sa -P changeme -i /initial-database-config.sql
