
output "static_website_endpoint" {
  description = "The primary endpoint for the static website."
  value       = azurerm_storage_account.sa.primary_web_endpoint
}
